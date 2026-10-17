"""De Praxes site generator (v9, multi-page).

    python build.py

1. Assembles every src/pages/<name>.html into <name>.html at the repo root:
   shared <head> (per-page title / description / canonical / OG), header +
   nav with the current page marked, footer, WhatsApp bubble, mobile bar,
   icon sprite, and only the JS modules that page asks for.
2. Compiles + purges Tailwind (tailwind.config.js scans the generated pages)
   and inlines it into every page's <style id="tw"> block.
3. Writes sitemap.xml.

Each page source starts with a JSON front-matter comment:
    <!--page {"title_ar": "...", "title_en": "...", "desc": "...", "nav": "about",
              "js": ["inside"], "crumbs": [...]} -->
The generated .html files are committed — Cloudflare serves the repo as-is.
"""
import json, pathlib, re, shutil, subprocess, sys

root = pathlib.Path(__file__).parent
SRC = root / "src"
SITE = "https://depraxis.zaylogear.com"
read = lambda p: (SRC / p).read_text(encoding="utf-8")

# ------------------------------------------------------------------ nav
# (key, href, ar, en). Desktop nav shows everything but home (the logo is home).
NAV = [
    ("home",        "index.html",       "الرئيسية",          "Home"),
    ("about",       "about.html",       "من نحن",            "About"),
    ("departments", "departments.html", "الأقسام",           "Departments"),
    ("technology",  "technology.html",  "التقنيات والأجهزة", "Technology"),
    ("cases",       "cases.html",       "الحالات",           "Cases"),
    ("doctors",     "doctors.html",     "الأطباء",           "Doctors"),
    ("reviews",     "reviews.html",     "التقييمات",         "Reviews"),
    ("partners",    "partners.html",    "شركاؤنا",           "Partners"),
    ("contact",     "contact.html",     "تواصل معنا",        "Contact"),
]
# department pages light up "Departments" in the nav
NAV_PARENT = {"dental": "departments", "dermatology": "departments", "laser": "departments"}


def cur(active, key):
    return ' aria-current="page"' if active == key else ""


def header(active):
    desk = "\n".join(
        f'        <a href="{h}" class="navlink ulink hover:text-ink transition-colors"{cur(active, k)}>'
        f'<span lang-ar>{ar}</span><span lang-en>{en}</span></a>'
        for k, h, ar, en in NAV if k != "home")
    mob = "\n".join(
        f'      <a href="{h}" class="mnavlink py-2.5"{cur(active, k)}><span lang-ar>{ar}</span><span lang-en>{en}</span></a>'
        for k, h, ar, en in NAV)
    return read("partials/header.html").replace("{{DESKNAV}}", desk).replace("{{MOBNAV}}", mob).replace(
        "{{BOOKCUR}}", cur(active, "book"))


def crumbs(items):
    """items: [[ar, en, href|None], ...] — 'Home' is prepended."""
    out = ['<nav class="crumbs reveal" aria-label="مسار الصفحة">',
           '<a href="index.html"><span lang-ar>الرئيسية</span><span lang-en>Home</span></a>']
    for i, (ar, en, href) in enumerate(items):
        out.append('<span class="sep" aria-hidden="true">/</span>')
        last = i == len(items) - 1
        tag = f'<span aria-current="page">' if last else f'<a href="{href}">'
        end = "</span>" if last else "</a>"
        out.append(f'{tag}<span lang-ar>{ar}</span><span lang-en>{en}</span>{end}')
    out.append("</nav>")
    return "\n".join(out)


def build_page(src_path):
    raw = src_path.read_text(encoding="utf-8")
    m = re.match(r"\s*<!--page\s*(\{.*?\})\s*-->\s*", raw, flags=re.S)
    assert m, f"{src_path.name}: missing <!--page {{...}} --> front-matter"
    meta = json.loads(m.group(1))
    body = raw[m.end():]
    name = src_path.stem
    out_name = f"{name}.html"
    path = "" if name == "index" else ("" if name == "404" else name)
    canonical = f"{SITE}/{path}"

    body = body.replace("{{CRUMBS}}", crumbs(meta.get("crumbs", []))) if "{{CRUMBS}}" in body else body

    css = read("css/site.css") + read("css/v9.css")
    jsonld = read("partials/jsonld.html") if meta.get("jsonld") else ""
    # 404.html is served for any unknown path (nested ones too) — anchor its relative URLs at the root
    noindex = '<meta name="robots" content="noindex">\n<base href="/">\n' if name == "404" else ""
    head = (read("partials/head.html")
            .replace("{{TITLE_AR}}", meta["title_ar"])
            .replace("{{TITLE_EN}}", meta["title_en"])
            .replace("{{DESC}}", meta["desc"])
            .replace("{{CANONICAL}}", canonical)
            .replace("{{JSONLD}}", jsonld)
            .replace("{{NOINDEX}}", noindex)
            .replace("{{CSS}}", css))

    mods = ["core"] + meta.get("js", [])
    js = "\n".join(read(f"js/{m_}.js") for m_ in mods) + "\nDPX.start();\n"
    active = NAV_PARENT.get(name, meta.get("nav", name))
    html = (head
            + f'<body data-page="{name}" data-mbar="{meta.get("mbar", 0)}">\n'
            + '<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:start-3 focus:z-[100] focus:bg-ink focus:text-cream focus:px-4 focus:py-2 focus:text-sm">\n'
            + '  <span lang-ar>تخطَّ إلى المحتوى</span><span lang-en>Skip to content</span>\n</a>\n\n'
            + read("partials/sprite.svg") + "\n"
            + header(active) + "\n"
            + '<main id="main">\n' + body.strip() + "\n</main>\n\n"
            + read("partials/footer.html") + "\n"
            + read("partials/chrome.html") + "\n"
            + '<script src="vendor/gsap.min.js" defer></script>\n'
            + '<script src="vendor/ScrollTrigger.min.js" defer></script>\n'
            + "<script>\n" + js + "</script>\n</body>\n</html>\n")
    (root / out_name).write_text(html, encoding="utf-8")
    return out_name, path, meta


def tailwind(pages):
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
    for p in pages:
        f = root / p
        html = f.read_text(encoding="utf-8")
        new, n = re.subn(r'(<style id="tw">).*?(</style>)', lambda m: m.group(1) + css + m.group(2),
                         html, count=1, flags=re.S)
        assert n == 1, f"tw style block not found in {p}"
        f.write_text(new, encoding="utf-8")
    print(f"inlined {len(css)} bytes of purged tailwind into {len(pages)} pages")


def sitemap(paths):
    urls = "\n".join(f"  <url><loc>{SITE}/{p}</loc></url>" for p in paths)
    (root / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "\n</urlset>\n",
        encoding="utf-8")


if __name__ == "__main__":
    built, paths = [], []
    for src in sorted((SRC / "pages").glob("*.html")):
        out, path, meta = build_page(src)
        built.append(out)
        if src.stem != "404":
            paths.append(path)
        print("built", out)
    tailwind(built)
    sitemap(paths)
