<template>
  <div
    class="flex flex-col items-center p-4 relative overflow-hidden min-h-screen"
  >
    <ImageStack :images="imageStack" />

    <!-- Input artista -->
    <transition name="fade-down" @after-leave="onArtistInputLeave">
      <div v-if="inputStep === 'artist'" key="artist" class="w-full mt-8">
        <ArtistSearch @artist-selected="handleArtistSelected" />
      </div>
    </transition>

    <!-- Input canción -->
    <transition name="fade-up">
      <div v-if="inputStep === 'song'" key="song" class="w-full mt-8">
        <SongSearch
          :artist="selectedArtist"
          @song-selected="handleSongSelected"
        />
      </div>
    </transition>

    <transition name="fade-up">
      <SongInfo
        v-if="selectedArtist && selectedSong"
        :artist-name="selectedArtist.name"
        :song-title="selectedSong.title"
      />
    </transition>
    <transition name="fade-up">
      <GenerateButton
        v-if="selectedArtist && selectedSong"
        @generate="handleGenerate"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import ImageStack from "./components/ImageStack.vue";
import ArtistSearch from "./components/ArtistSearch.vue";
import SongSearch from "./components/SongSearch.vue";
import SongInfo from "./components/SongInfo.vue";
import GenerateButton from "./components/GenerateButton.vue";

const inputStep = ref("artist");

const selectedArtist = ref(null);
const selectedArtistImage = ref(null);
const selectedAlbumImage = ref(null);
const selectedSong = ref(null);

const imageStack = ref([]);

function handleArtistSelected({ artist, image }) {
  selectedArtist.value = artist;
  selectedArtistImage.value = image;

  imageStack.value = [
    {
      key: "artist",
      src: selectedArtistImage.value,
      alt: selectedArtist.value?.name || "",
    },
  ];

  inputStep.value = "artist-leaving";
}

function onArtistInputLeave() {
  inputStep.value = "song";
}

function handleSongSelected({ song, image }) {
  selectedAlbumImage.value = image;
  selectedSong.value = song;
  imageStack.value.push({
    key: "album",
    src: selectedAlbumImage.value,
    alt: "Carátula del álbum",
  });

  inputStep.value = "generate";
}

function handleGenerate() {
  console.log("Generar imagen con letra 🎶");
  // Acá vas a colocar la lógica futura para componer la historia de Instagram
}
</script>

<style scoped>
/* Transición de salida hacia abajo */
.fade-down-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(40px);
}

/* Transición de entrada hacia arriba */
.fade-up-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
</style>
