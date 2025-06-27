<template>
  <div class="flex flex-col items-center p-4 relative overflow-hidden min-h-screen">
    <!-- Imagenes -->
    <div class="relative flex justify-center items-center h-60 w-full">
      <!-- Imagen del artista -->
      <img
        v-if="selectedArtistImage"
        :src="selectedArtistImage"
        alt="Foto del artista"
        class="w-40 h-40 object-cover rounded-full shadow absolute"
        :class="{
          'left-1/2 -translate-x-1/2': !showAlbumImage,
          'left-[25%] -translate-x-1/2': showAlbumImage,
        }"
      />

      <!-- Imagen del álbum -->
      <img
        v-if="showAlbumImage && selectedAlbumImage"
        :src="selectedAlbumImage"
        alt="Foto del álbum"
        class="w-40 h-40 object-cover rounded-full shadow right-[25%]"
      />
    </div>

    <!-- Input artista -->
    <div v-if="inputStep === 'artist'" class="w-full mt-8">
      <ArtistSearch @artist-selected="handleArtistSelected" />
    </div>

    <!-- Input canción -->
    <div v-if="inputStep === 'song'" class="w-full mt-8">
      <SongSearch :artist="selectedArtist" @song-selected="handleSongSelected" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ArtistSearch from './components/ArtistSearch.vue'
import SongSearch from './components/SongSearch.vue'

const selectedArtist = ref(null)
const selectedArtistImage = ref(null)
const selectedAlbumImage = ref(null)

const inputStep = ref('artist') // 'artist' | 'song'
const showAlbumImage = ref(false)

function handleArtistSelected({ artist, image }) {
  selectedArtist.value = artist
  selectedArtistImage.value = image
  selectedAlbumImage.value = null
  showAlbumImage.value = false
  inputStep.value = 'song'
}

function handleSongSelected({ song, image }) {
  selectedAlbumImage.value = image || null
  showAlbumImage.value = !!image
}
</script>

<style scoped>
/* No transitions, just layout */
</style>
