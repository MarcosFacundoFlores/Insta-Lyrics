<template>
  <div class="w-full max-w-md">
    <label class="block text-sm font-medium mb-1">Artista</label>
    <input
      v-model="searchTerm"
      @input="onInput"
      type="text"
      placeholder="Empieza a escribir..."
      class="w-full p-2 border rounded"
    />

    <ul
      v-if="suggestions.length"
      class="border mt-1 rounded bg-white shadow max-h-96 overflow-y-auto"
    >
      <li
        v-for="artist in suggestions"
        :key="artist.id"
        @click="selectArtist(artist)"
        class="p-2 hover:bg-gray-100 cursor-pointer transition"
      >
        {{ artist.name }}
        <span v-if="artist.disambiguation" class="text-xs text-gray-500 block">
          ({{ artist.disambiguation }})
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useArtistImage } from "../composables/useArtistImage.ts";
const emit = defineEmits(["artist-selected"]);

const { imageUrl, fetchArtistImage } = useArtistImage();

const searchTerm = ref("");
const suggestions = ref([]);
let timeout;

async function onInput() {
  clearTimeout(timeout);
  if (searchTerm.value.length < 2) {
    suggestions.value = [];
    return;
  }

  timeout = setTimeout(async () => {
    const query = `artist:${encodeURIComponent(searchTerm.value)}`;
    const url = `https://musicbrainz.org/ws/2/artist?query=${query}&fmt=json`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "InstaLyricsApp/1.0",
      },
    });

    const data = await res.json();
    suggestions.value = data.artists?.slice(0, 10) || [];
  }, 400); // un poco más largo para evitar rate limit
}

async function selectArtist(artist) {
  searchTerm.value = artist.name;
  suggestions.value = [];

  await fetchArtistImage(artist.id);
  const image = imageUrl.value;

  emit("artist-selected", {
    artist,
    image,
  });
}
</script>
