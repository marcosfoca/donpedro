#!/usr/bin/env python3
"""Separa las figuras de una hoja de sprites SIN fondo (PNG con alfa) cuando no caen en una
rejilla exacta: corta por las franjas horizontales vacías (filas) y, dentro de cada fila, por las
columnas vacías. Orden: de arriba abajo y de izquierda a derecha.

  python scripts/arte/separar_figuras.py hoja.png carpeta_salida nombre1 nombre2 ... [--margen 8]
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image


def tramos(ocupado: np.ndarray, hueco_min: int) -> list[tuple[int, int]]:
    """Tramos [ini, fin) de True separados por al menos `hueco_min` False seguidos."""
    res, ini, vacios = [], None, 0
    for i, v in enumerate(ocupado):
        if v:
            if ini is None:
                ini = i
            vacios = 0
        elif ini is not None:
            vacios += 1
            if vacios >= hueco_min:
                res.append((ini, i - vacios + 1))
                ini, vacios = None, 0
    if ini is not None:
        res.append((ini, len(ocupado) - vacios))
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("hoja")
    ap.add_argument("salida")
    ap.add_argument("nombres", nargs="+")
    ap.add_argument("--margen", type=int, default=8)
    ap.add_argument("--umbral", type=int, default=40, help="alfa mínimo para contar como figura")
    ap.add_argument("--hueco", type=int, default=12, help="píxeles vacíos seguidos que separan figuras")
    a = ap.parse_args()

    im = Image.open(a.hoja).convert("RGBA")
    alfa = np.asarray(im.getchannel("A")) > a.umbral
    salida = Path(a.salida)
    salida.mkdir(parents=True, exist_ok=True)

    figuras = []
    for y0, y1 in tramos(alfa.any(axis=1), a.hueco):
        franja = alfa[y0:y1]
        for x0, x1 in tramos(franja.any(axis=0), a.hueco):
            sub = franja[:, x0:x1]
            ys = np.where(sub.any(axis=1))[0]
            if sub.sum() < 2000:  # motas sueltas
                continue
            figuras.append((y0 + ys[0], y0 + ys[-1] + 1, x0, x1))

    if len(figuras) != len(a.nombres):
        raise SystemExit(f"Encontradas {len(figuras)} figuras y se esperaban {len(a.nombres)}: revisa --hueco")

    m = a.margen
    for (y0, y1, x0, x1), nombre in zip(figuras, a.nombres):
        caja = (max(0, x0 - m), max(0, y0 - m), min(im.width, x1 + m), min(im.height, y1 + m))
        f = salida / f"{nombre}.png"
        im.crop(caja).save(f)
        print(f, caja)


if __name__ == "__main__":
    main()
