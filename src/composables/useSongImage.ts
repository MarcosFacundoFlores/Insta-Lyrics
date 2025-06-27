import { ref } from "vue";

export function useSongImage() {
  const imageUrl = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSongImage(mbid: string) {
    imageUrl.value = null;
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(
        `/api/song-image?mbid=${encodeURIComponent(mbid)}`
      );

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        const text = await res.text();
        console.error("❌ Respuesta no-JSON:", text);
        throw new Error("Respuesta inválida del servidor");
      }

      if (res.ok && data?.image) {
        imageUrl.value = data.image;
      } else {
        error.value = data?.error || "No se encontró imagen";
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e.message;
      } else {
        error.value = "Error desconocido";
      }
    } finally {
      loading.value = false;
    }
  }

  return {
    imageUrl,
    loading,
    error,
    fetchSongImage,
  };
}
