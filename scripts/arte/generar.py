#!/usr/bin/env python3
"""Variante local de generar.py (skill landing-gamificada) con formato y modelo configurables.

Uso:
  python scripts/arte/generar.py --out arte/fachada/r02 --prompt "..." \
      [--variaciones v.txt] [--ref img.png ...] [--n 4] [--aspecto 9:16] [--modelo gemini-3-pro-image]

La clave se lee de la variable de entorno GEMINI_API_KEY (cárgala desde .env.local; nunca en el código).
Genera NN.png y una hoja de contacto index.html en --out.
"""
import argparse
import os
import sys
from io import BytesIO
from pathlib import Path

from google import genai
from google.genai import types
from PIL import Image

MODELO_DEFECTO = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image")


def generar(client, modelo, prompt, refs, aspecto, tamano=None):
    opciones = {k: v for k, v in {"aspect_ratio": aspecto, "image_size": tamano}.items() if v}
    cfg = types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(**opciones) if opciones else None,
    )
    resp = client.models.generate_content(model=modelo, contents=[prompt, *refs], config=cfg)
    for cand in resp.candidates or []:
        for part in (cand.content.parts if cand.content else []) or []:
            if getattr(part, "inline_data", None) and part.inline_data.data:
                return Image.open(BytesIO(part.inline_data.data))
    return None


def hoja_contacto(out, archivos, prompts):
    celdas = "".join(
        f'<figure><img src="{a.name}"><figcaption><b>{i}</b> {p}</figcaption></figure>'
        for i, (a, p) in zip([int(a.stem) for a in archivos], zip(archivos, prompts))
    )
    (out / "index.html").write_text(
        "<meta charset='utf-8'><style>body{font-family:sans-serif;background:#222;color:#eee;margin:16px}"
        "main{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}"
        "img{width:100%;background:repeating-conic-gradient(#555 0 25%,#444 0 50%) 0/20px 20px}"
        "b{font-size:1.4em;color:#ffcc00;margin-right:6px}figcaption{font-size:.8em}</style>"
        f"<h2>{out}</h2><main>{celdas}</main>",
        encoding="utf-8",
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--variaciones")
    ap.add_argument("--ref", nargs="*", default=[])
    ap.add_argument("--n", type=int, default=4)
    ap.add_argument("--aspecto", default=None, help="p. ej. 9:16, 16:9, 1:1")
    ap.add_argument("--modelo", default=MODELO_DEFECTO)
    ap.add_argument("--tamano", default=None, help="1K, 2K o 4K (solo modelos que lo admitan)")
    a = ap.parse_args()

    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    refs = [Image.open(r) for r in a.ref]
    if a.variaciones:
        extras = [l.strip() for l in Path(a.variaciones).read_text(encoding="utf-8").splitlines() if l.strip()]
    else:
        extras = [""] * a.n
    prompts = [f"{a.prompt}\n{e}".strip() for e in extras]

    client = genai.Client()
    archivos, usados = [], []
    for i, p in enumerate(prompts, 1):
        try:
            img = generar(client, a.modelo, p, refs, a.aspecto, a.tamano)
        except Exception as e:  # noqa: BLE001 — seguimos con el resto de variantes
            print(f"[{i}] error: {e}", file=sys.stderr)
            continue
        if img is None:
            print(f"[{i}] sin imagen (bloqueo o error), revisa el prompt", file=sys.stderr)
            continue
        f = out / f"{i:02d}.png"
        img.save(f)
        archivos.append(f)
        usados.append(p)
        print(f"[{i}] {f} {img.size}")
    hoja_contacto(out, archivos, usados)
    print(f"Hoja de contacto: {out / 'index.html'}  (modelo {a.modelo}, aspecto {a.aspecto})")


if __name__ == "__main__":
    main()
