#!/usr/bin/env python3
"""Sintetiza la campanilla de la puerta (A15) sin muestras de terceros: síntesis aditiva de
parciales inarmónicos de campana con decaimiento exponencial, dos toques (la campanilla oscila).

  python scripts/arte/campanilla.py public/sonido/campanilla.wav
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 1.4


def toque(t, f0, amp):
    # parciales típicos de campana pequeña (proporciones inarmónicas) y sus caídas
    parciales = [(1.0, 1.0, 2.2), (2.0, 0.55, 3.0), (2.76, 0.4, 4.2), (5.4, 0.22, 6.5), (8.93, 0.12, 9.0)]
    s = np.zeros_like(t)
    for ratio, a, caida in parciales:
        s += a * np.sin(2 * np.pi * f0 * ratio * t) * np.exp(-caida * t)
    ataque = np.clip(t / 0.004, 0, 1)
    return amp * s * ataque


def main(salida):
    t = np.arange(int(SR * DUR)) / SR
    senal = toque(t, 1568.0, 1.0)  # sol6
    d = int(0.16 * SR)
    senal[d:] += toque(t[: len(t) - d], 1568.0 * 1.012, 0.55)  # segundo golpe, algo desafinado
    senal /= np.max(np.abs(senal))
    senal *= 0.6  # margen: suave, no estridente
    fin = int(0.25 * SR)
    senal[-fin:] *= np.linspace(1, 0, fin)  # cola sin clic
    pcm = (senal * 32767).astype(np.int16)
    with wave.open(salida, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(salida, f"{len(pcm) / SR:.2f}s")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "public/sonido/campanilla.wav")
