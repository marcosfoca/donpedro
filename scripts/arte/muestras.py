"""Muestras de color de Q4 ("Uno en concreto") e iconos "discretos" y "concreto".

Parte de las muestras de piel ya aprobadas (arte/aprobado/iconos/q4-*.png): toma la textura del
círculo azul marino (grano de piel) y la tiñe con el color de cada tono, así todas comparten el
mismo grano que los iconos del quiz. El metalizado usa el círculo dorado tal cual.

  python scripts/arte/muestras.py

Salida: public/arte/muestras/<tono>.webp (160 px) y public/arte/iconos/q4-{discretos,concreto}.webp
(256 px de ancho, como el resto de iconos).
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

RAIZ = Path(__file__).resolve().parents[2]
APROBADO = RAIZ / "arte" / "aprobado" / "iconos"
SALIDA_MUESTRAS = RAIZ / "public" / "arte" / "muestras"
SALIDA_ICONOS = RAIZ / "public" / "arte" / "iconos"

# Color base de cada tono (sRGB). La textura se modula alrededor de este color.
TONOS = {
    "negro": (38, 34, 32),
    "marron": (98, 58, 36),
    "beige": (214, 190, 158),
    "blanco": (246, 241, 230),
    "gris": (132, 132, 130),
    "marino": (40, 58, 104),
    "burdeos": (112, 30, 44),
    "azul": (62, 118, 190),
    "rojo": (190, 52, 40),
    "rosa": (226, 146, 170),
    "verde": (58, 132, 86),
}


def circulo(imagen: Image.Image, condicion) -> Image.Image:
    """Recorta el círculo cuyos píxeles cumplen `condicion` (sobre el array RGBA)."""
    a = np.asarray(imagen.convert("RGBA")).astype(int)
    m = condicion(a) & (a[..., 3] > 200)
    ys, xs = np.nonzero(m)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    lado = min(x1 - x0, y1 - y0)
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    r = lado // 2 - 3  # un poco hacia dentro: fuera el borde antialias
    return imagen.convert("RGBA").crop((cx - r, cy - r, cx + r, cy + r))


def mascara_redonda(lado: int, escala: int = 4) -> Image.Image:
    grande = Image.new("L", (lado * escala, lado * escala), 0)
    ImageDraw.Draw(grande).ellipse((0, 0, lado * escala - 1, lado * escala - 1), fill=255)
    return grande.resize((lado, lado), Image.LANCZOS)


def tenir(textura: Image.Image, color: tuple[int, int, int], lado: int) -> Image.Image:
    """Tiñe la textura: luminancia relativa (grano y sombreado) × color base."""
    t = textura.resize((lado, lado), Image.LANCZOS).convert("L")
    lum = np.asarray(t).astype(float)
    rel = lum / lum.mean()
    # Contraste del grano más suave en los tonos claros (si no, el blanco se ensucia).
    brillo = sum(color) / (3 * 255)
    rel = 1 + (rel - 1) * (1.0 - 0.55 * brillo)
    rgb = np.clip(np.stack([rel * c for c in color], axis=-1), 0, 255).astype(np.uint8)
    out = Image.fromarray(rgb, "RGB").convert("RGBA")
    out.putalpha(mascara_redonda(lado))
    return out


def redondo(img: Image.Image, lado: int) -> Image.Image:
    out = img.resize((lado, lado), Image.LANCZOS).convert("RGBA")
    alfa = Image.fromarray(np.minimum(np.asarray(out.split()[3]), np.asarray(mascara_redonda(lado))))
    out.putalpha(alfa)
    return out


def main() -> None:
    oscuros = Image.open(APROBADO / "q4-oscuros.png")
    claros = Image.open(APROBADO / "q4-claros.png")
    # Azul marino: el círculo de abajo a la derecha, entero (está encima de los otros dos).
    marino = circulo(oscuros, lambda a: (a[..., 2] > a[..., 0] + 25) & (a[..., 2] > 60))
    # Dorado: abajo a la derecha de q4-claros.
    dorado = circulo(claros, lambda a: (a[..., 1] > 150) & (a[..., 0] - a[..., 2] > 85))

    SALIDA_MUESTRAS.mkdir(parents=True, exist_ok=True)
    lado = 160
    muestras = {tono: tenir(marino, color, lado) for tono, color in TONOS.items()}
    muestras["metal"] = redondo(dorado, lado)
    for tono, img in muestras.items():
        img.save(SALIDA_MUESTRAS / f"{tono}.webp", "WEBP", quality=90, method=6)

    # Iconos de Q4 con la misma composición que los aprobados (3 círculos en triángulo).
    ancho, alto = oscuros.size
    r = int(min(ancho, alto) * 0.285)
    centros = [(ancho // 2, int(alto * 0.33)), (int(ancho * 0.27), int(alto * 0.68)), (int(ancho * 0.73), int(alto * 0.68))]

    def componer(tonos: list[str], radios: list[int] | None = None, anillo: int | None = None) -> Image.Image:
        lienzo = Image.new("RGBA", (ancho, alto), (0, 0, 0, 0))
        for i, tono in enumerate(tonos):
            rr = (radios or [r] * 3)[i]
            base = tenir(marino, TONOS[tono], 2 * rr) if tono in TONOS else redondo(dorado, 2 * rr)
            cx, cy = centros[i]
            lienzo.alpha_composite(base, (cx - rr, cy - rr))
        return lienzo

    discretos = componer(["negro", "marron", "beige"])
    discretos.resize((256, round(256 * alto / ancho)), Image.LANCZOS).save(SALIDA_ICONOS / "q4-discretos.webp", "WEBP", quality=90, method=6)

    # "Uno en concreto": una muestra grande con anillo de cuero y sello de visto bueno, y dos pequeñas detrás.
    lienzo = Image.new("RGBA", (ancho, alto), (0, 0, 0, 0))
    rp = int(r * 0.7)
    for tono, (cx, cy) in (("beige", (int(ancho * 0.2), int(alto * 0.64))), ("negro", (int(ancho * 0.8), int(alto * 0.64)))):
        lienzo.alpha_composite(tenir(marino, TONOS[tono], 2 * rp), (cx - rp, cy - rp))
    rg = int(r * 1.17)
    cx, cy = ancho // 2, int(alto * 0.5)
    escala = 4
    anillo = Image.new("RGBA", ((2 * rg + 24) * escala,) * 2, (0, 0, 0, 0))
    ImageDraw.Draw(anillo).ellipse((0, 0, anillo.width - 1, anillo.height - 1), fill=(129, 96, 64, 255))
    anillo = anillo.resize((2 * rg + 24,) * 2, Image.LANCZOS)
    sombra = anillo.copy().filter(ImageFilter.GaussianBlur(6))
    sombra.putalpha(sombra.split()[3].point(lambda v: v * 0.35))
    lienzo.alpha_composite(sombra, (cx - rg - 12, cy - rg - 8))
    lienzo.alpha_composite(anillo, (cx - rg - 12, cy - rg - 12))
    blanco = Image.new("RGBA", ((2 * rg + 10) * escala,) * 2, (0, 0, 0, 0))
    ImageDraw.Draw(blanco).ellipse((0, 0, blanco.width - 1, blanco.height - 1), fill=(251, 247, 234, 255))
    blanco = blanco.resize((2 * rg + 10,) * 2, Image.LANCZOS)
    lienzo.alpha_composite(blanco, (cx - rg - 5, cy - rg - 5))
    lienzo.alpha_composite(tenir(marino, TONOS["burdeos"], 2 * rg), (cx - rg, cy - rg))
    # Sello con la marca de visto bueno, arriba a la derecha.
    rs = int(rg * 0.42)
    sx, sy = cx + int(rg * 0.72), cy - int(rg * 0.72)
    sello = Image.new("RGBA", (2 * rs * escala,) * 2, (0, 0, 0, 0))
    d = ImageDraw.Draw(sello)
    d.ellipse((0, 0, sello.width - 1, sello.height - 1), fill=(129, 96, 64, 255), outline=(251, 247, 234, 255), width=5 * escala)
    w = sello.width
    d.line([(w * 0.28, w * 0.52), (w * 0.44, w * 0.68), (w * 0.73, w * 0.35)], fill=(251, 247, 234, 255), width=int(w * 0.11), joint="curve")
    sello = sello.resize((2 * rs,) * 2, Image.LANCZOS)
    lienzo.alpha_composite(sello, (sx - rs, sy - rs))
    lienzo.resize((256, round(256 * alto / ancho)), Image.LANCZOS).save(SALIDA_ICONOS / "q4-concreto.webp", "WEBP", quality=90, method=6)
    print("OK:", ", ".join(sorted(muestras)), "+ q4-discretos, q4-concreto")


if __name__ == "__main__":
    main()
