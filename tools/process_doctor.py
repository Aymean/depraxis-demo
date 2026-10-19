"""Doctor portrait pipeline for the De Praxes site.

    python -I tools/process_doctor.py <input-photo> <slug>
    python -I tools/process_doctor.py "C:/Users/lotze/Downloads/Dr.Eman.JPEG" eman

Writes images/dr-<slug>.webp (640x640, WebP q85) in the repo:
  1. applies EXIF orientation
  2. removes the background with rembg (birefnet-portrait, falls back to birefnet-general)
  3. cleans the hair edge (alpha cleanup + foreground colour estimation, so no wall-coloured halo)
  4. composites the person onto flat site cream #F5F1E8
  5. frames every doctor the same way: the detected face is scaled to FACE_FRAC of the frame
     height, the eye line sits at EYE_Y, and the face is centred horizontally.
     Areas outside the original photo are filled with the same cream.

Options:  --out DIR   (default: <repo>/images)   --debug   (also saves the cut-out PNG + mask)
Needs: rembg 2.x, pymatting, opencv-python, pillow. First run downloads the rembg model (~1 GB)
into ~/.rembg/models/birefnet-portrait/ (slow; see HANDOFF.md). Keep original photos OUT of the repo.
"""
import argparse, pathlib, sys

import numpy as np
from PIL import Image, ImageOps

CREAM = (0xF5, 0xF1, 0xE8)
OUT_PX = 640          # existing dr-*.webp are 640x640 (cards: aspect-square + object-cover)
FACE_FRAC = 0.255     # detected face-box height / frame height  -> same head size for everyone
EYE_Y = 0.32          # eye line as a fraction of frame height    -> same eye line / headroom
WORK_MAX = 2048       # long side used for processing (originals can be 4000 px)
QUALITY = 85

REPO = pathlib.Path(__file__).resolve().parent.parent


def load(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im).convert("RGB")
    if max(im.size) > WORK_MAX:
        im.thumbnail((WORK_MAX, WORK_MAX), Image.LANCZOS)
    return im


def cut_mask(im):
    from rembg import new_session, remove
    for model in ("birefnet-portrait", "birefnet-general"):
        try:
            sess = new_session(model)
            break
        except Exception as e:  # model not available -> next
            print(f"  {model} unavailable ({e}); trying next", file=sys.stderr)
    else:
        raise SystemExit("no rembg model available")
    print(f"  model: {model}")
    mask = remove(im, session=sess, only_mask=True, post_process_mask=False)
    a = np.asarray(mask.convert("L"), dtype=np.float64) / 255.0
    # kill faint wall residue, firm up the core, keep the soft hair transition
    a = np.clip((a - 0.06) / (0.94 - 0.06), 0, 1)
    a = keep_largest(a)
    return a


def keep_largest(a):
    """Drop detached specks (stray bits of wall/furniture) — keep the person blob."""
    import cv2
    solid = (a > 0.5).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(solid, connectivity=8)
    if n <= 2:
        return a
    biggest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    keep = (lab == biggest).astype(np.uint8)
    keep = cv2.dilate(keep, np.ones((25, 25), np.uint8))  # keep soft hair around the blob
    return a * keep


def composite(im, a):
    """Estimate clean foreground colours (removes the wall tint in hair) and put on cream."""
    img = np.asarray(im, dtype=np.float64) / 255.0
    try:
        from pymatting import estimate_foreground_ml
        fg = estimate_foreground_ml(img, a)
    except Exception as e:
        print(f"  foreground estimation skipped ({e})", file=sys.stderr)
        fg = img
    bg = np.array(CREAM, dtype=np.float64) / 255.0
    out = fg * a[..., None] + bg * (1 - a[..., None])
    return Image.fromarray(np.clip(out * 255 + 0.5, 0, 255).astype(np.uint8))


YUNET_URL = ("https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/"
             "face_detection_yunet_2023mar.onnx")
YUNET = pathlib.Path.home() / ".cache" / "dpx" / "face_detection_yunet_2023mar.onnx"


def find_face(im, a):
    """Most confident face on the person: (cx, eye_y, box_h) or None. OpenCV YuNet detector."""
    import cv2
    if not YUNET.exists():
        import urllib.request
        YUNET.parent.mkdir(parents=True, exist_ok=True)
        print(f"  downloading face model -> {YUNET}")
        urllib.request.urlretrieve(YUNET_URL, YUNET)
    scale = 1024 / max(im.size)               # detect on a 1024 px copy
    small = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    bgr = cv2.cvtColor(np.asarray(small), cv2.COLOR_RGB2BGR)
    det = cv2.FaceDetectorYN.create(str(YUNET), "", small.size, 0.6, 0.3, 5000)
    _, faces = det.detect(bgr)
    best = None
    for f in (faces if faces is not None else []):
        x, y, w, h = (v / scale for v in f[:4])
        ex = (f[4] + f[6]) / 2 / scale
        ey = (f[5] + f[7]) / 2 / scale
        if a[min(int(ey), a.shape[0] - 1), min(int(ex), a.shape[1] - 1)] < 0.5:   # must be on the person
            continue
        if best is None or f[-1] > best[-1]:
            best = (float(ex), float(ey), float(h), float(f[-1]))
    return best


def frame(comp, face, a):
    if face is None:
        # fallback: top of the person + mask width at head level
        rows = np.where(a.max(axis=1) > 0.5)[0]
        top = int(rows[0])
        cols = np.where(a[top + 40] > 0.5)[0] if top + 40 < a.shape[0] else np.array([a.shape[1] // 2])
        cx = float(cols.mean())
        fh = a.shape[0] * 0.09
        eye = top + fh * 0.75
        print("  WARNING: no face found, used mask fallback — check the result", file=sys.stderr)
    else:
        cx, eye, fh, _ = face         # eye centre x, eye line y, face-box height
    side = fh / FACE_FRAC
    left = cx - side / 2
    top = eye - EYE_Y * side
    box = tuple(int(round(v)) for v in (left, top, left + side, top + side))
    canvas = Image.new("RGB", (box[2] - box[0], box[3] - box[1]), CREAM)
    canvas.paste(comp, (-box[0], -box[1]))      # outside the photo stays cream
    return canvas.resize((OUT_PX, OUT_PX), Image.LANCZOS)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input")
    ap.add_argument("slug", help="file becomes dr-<slug>.webp, e.g. eman")
    ap.add_argument("--out", default=str(REPO / "images"))
    ap.add_argument("--debug", action="store_true")
    args = ap.parse_args()

    out = pathlib.Path(args.out) / f"dr-{args.slug}.webp"
    print(f"{args.input} -> {out}")
    im = load(args.input)
    a = cut_mask(im)
    comp = composite(im, a)
    face = find_face(im, a)
    print(f"  face: {face}")
    res = frame(comp, face, a)
    res.save(out, "WEBP", quality=QUALITY, method=6)
    if args.debug:
        dbg = out.with_name(f"dr-{args.slug}.debug.png")
        rgba = im.copy(); rgba.putalpha(Image.fromarray((a * 255).astype(np.uint8)))
        rgba.save(dbg)
        print(f"  debug cut-out: {dbg}")
    print(f"  saved {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
