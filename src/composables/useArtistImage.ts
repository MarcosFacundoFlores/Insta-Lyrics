import { ref } from "vue";

export function useArtistImage() {
  const imageUrl = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchArtistImage(mbid: string) {
    imageUrl.value = null;
    error.value = null;
    loading.value = true;

    try {
      const res = await fetch(
        `/api/artist-image?mbid=${encodeURIComponent(mbid)}`
      );
      const data = await res.json();

      if (res.ok) {
        imageUrl.value = data.image;
      } else {
        error.value = data.error || "No image found";
      }
    } catch (e) {
      error.value = "Network error";
    } finally {
      loading.value = false;
    }
  }

  return {
    imageUrl,
    loading,
    error,
    fetchArtistImage,
  };
}
