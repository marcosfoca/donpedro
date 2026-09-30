#!/usr/bin/env python3
"""Quita un fondo croma verde con menos halo que postproceso.py fondo.

  python scripts/arte/limpiar_croma.py entrada.png salida.png [--tol 120] [--erosion 1]

1) Alfa por "verdosidad" (G por encima de max(R, B)), más robusto que la distancia RGB.
2) Despill: en todo píxel visible se limita G a max(R, B) (+ un pequeño margen): elimina el tinte verde del borde.
3) Erosión del alfa (px) para comerse la línea de transición.
"""
import argparse

import numpy as np
from PIL import Image, ImageFilter


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("salida")
    ap.add_argument("--tol", type=float, default=120, help="verdosidad a partir de la cual es fondo")
    ap.add_argument("--erosion", type=int, default=1)
    ap.add_argument("--croma", choices=["verde", "magenta"], default="verde")
    a = ap.parse_args()

    img = np.array(Image.open(a.entrada).convert("RGBA")).astype(np.float32)
    r, g, b = img[..., 0], img[..., 1], img[..., 2]
    if a.croma == "verde":
        verdosidad = g - np.maximum(r, b)  # ~255 en el croma puro, <= 0 en el personaje
    else:
        verdosidad = np.minimum(r, b) - g  # "magentez": ~255 en #FF00FF
    # 0 → opaco; tol → transparente; rampa lineal entre tol/3 y tol
    lo = a.tol / 3
    alpha = np.clip(1 - (verdosidad - lo) / (a.tol - lo), 0, 1) * 255

    # despill en todo píxel con algo de alfa
    if a.croma == "verde":
        tope = np.maximum(r, b) + 6
        img[..., 1] = np.where(alpha > 0, np.minimum(g, tope), g)
    else:
        # el tinte magenta sube R y B a la vez: se resta lo que min(R, B) excede a G
        exceso = np.where(alpha > 0, np.clip(np.minimum(r, b) - g - 6, 0, None), 0)
        img[..., 0] = r - exceso
        img[..., 2] = b - exceso
    img[..., 3] = alpha

    out = Image.fromarray(img.clip(0, 255).astype(np.uint8))
    if a.erosion > 0:
        canal_a = out.getchannel("A").filter(ImageFilter.MinFilter(a.erosion * 2 + 1))
        out.putalpha(canal_a)
    out.save(a.salida)
    print(a.salida)


if __name__ == "__main__":
    main()
