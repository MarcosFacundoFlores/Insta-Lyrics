<template>
  <div class="flex flex-col items-center p-4 relative overflow-hidden min-h-screen">
    <ImageStack :images="imageStack" />

    <!-- Inputs -->
    <transition name="fade-down" @after-leave="onArtistInputLeave">
      <div v-if="inputStep === 'artist'" key="artist" class="w-full">
        <ArtistSearch @artist-selected="handleArtistSelected" />
      </div>
    </transition>

    <transition name="fade-up">
      <div v-if="inputStep === 'song'" key="song" class="w-full">
        <SongSearch :artist="selectedArtist" @song-selected="handleSongSelected" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import ImageStack from "./components/ImageStack.vue"
import ArtistSearch from "./components/ArtistSearch.vue"
import SongSearch from "./components/SongSearch.vue"

const inputStep = ref("artist")

const selectedArtist = ref(null)
const selectedArtistImage = ref(null)
const selectedAlbumImage = ref(null)

const imageStack = ref([])

function handleArtistSelected({ artist, image }) {
  selectedArtist.value = artist
  selectedArtistImage.value = image

  imageStack.value.push({
    key: 'artist',
    src: image,
    class: 'w-40 h-40 rounded-full left-1/2 -translate-x-1/2',
  })

  inputStep.value = 'artist-leaving'
}

function onArtistInputLeave() {
  inputStep.value = 'song'
}

function handleSongSelected({ song, image }) {
  selectedAlbumImage.value = image

  imageStack.value = imageStack.value.map(img =>
    img.key === 'artist'
      ? { ...img, class: 'w-40 h-40 rounded-full left-[25%] -translate-x-1/2' }
      : img
  )

  imageStack.value.push({
    key: 'album',
    src: image,
    class: 'w-32 h-32 rounded-xl right-[25%]',
  })

  inputStep.value = 'generate'
}
</script>
