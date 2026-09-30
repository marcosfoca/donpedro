import { assets } from "@/content/assets";

/**
 * Campanilla de la puerta (A15). El archivo puede NO existir todavía: todo error se ignora.
 * Solo suena si `activo` (el sonido está apagado por defecto) y tras un gesto de la clienta.
 */
let campanilla: HTMLAudioElement | null = null;

export function precargarCampanilla(): void {
  if (typeof window === "undefined" || campanilla) return;
  try {
    const audio = new Audio(assets.sonido.campanilla);
    audio.preload = "auto";
    audio.volume = 0.6;
    audio.addEventListener("error", () => {
      campanilla = null;
    });
    campanilla = audio;
  } catch {
    campanilla = null;
  }
}

export async function reproducirCampanilla(activo: boolean): Promise<void> {
  if (!activo || typeof window === "undefined") return;
  try {
    if (!campanilla) precargarCampanilla();
    if (!campanilla) return;
    campanilla.currentTime = 0;
    await campanilla.play();
  } catch {
    // Archivo ausente, formato no soportado o reproducción bloqueada: silencio.
  }
}
