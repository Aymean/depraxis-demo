"""Compile + purge Tailwind, then inline it into index.html's <style id="tw"> block."""
import pathlib, re, subprocess, sys, shutil

root = pathlib.Path(__file__).parent
css_out = root / "build" / "tw.css"
css_out.parent.mkdir(exist_ok=True)

npx = shutil.which("npx") or shutil.which("npx.cmd")
cmd = [npx, "-y", "tailwindcss@3", "-c", "tailwind.config.js",
       "-i", "src/input.css", "-o", str(css_out), "-m"]
r = subprocess.run(cmd, cwd=root, capture_output=True, text=True, shell=False)
sys.stderr.write(r.stderr[-2000:])
if r.returncode != 0:
    sys.exit("tailwind build failed")

css = css_out.read_text(encoding="utf-8").strip()
html = (root / "index.html").read_text(encoding="utf-8")
new, n = re.subn(r'(<style id="tw">).*?(</style>)', lambda m: m.group(1) + css + m.group(2),
                 html, count=1, flags=re.S)
assert n == 1, "tw style block not found"
(root / "index.html").write_text(new, encoding="utf-8")
print(f"inlined {len(css)} bytes of purged tailwind")
