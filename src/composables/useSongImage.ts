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
      const data = await res.json();

      if (res.ok) {
        imageUrl.value = data.image;
      } else {
        error.value = data?.error || "No se encontró imagen";
      }
    } catch (e) {
      error.value = "Network Error";
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
