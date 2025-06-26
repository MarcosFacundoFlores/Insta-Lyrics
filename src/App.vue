<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
    <h1 class="text-3xl font-bold mb-6">InstaLyrics 🎶</h1>

    <ArtistSearch @artist-selected="handleArtistSelected" />

    <div v-if="selectedArtist" class="mt-6 text-center">
      <p class="text-gray-700">ID del artista: {{ selectedArtist.id }}</p>
    </div>

    <div v-if="artistImage" class="mt-4">
      <img :src="artistImage" alt="Foto del artista" class="w-48 h-48 object-cover rounded-full shadow" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ArtistSearch from './components/ArtistSearch.vue'

const selectedArtist = ref(null)
const artistImage = ref(null)

function handleArtistSelected({ artist, image }) {
  selectedArtist.value = artist
  artistImage.value = image
}
</script>
