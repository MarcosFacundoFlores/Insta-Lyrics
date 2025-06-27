<template>
  <SearchInput
    label="Canción"
    placeholder="Buscar canción..."
    :fetchSuggestions="fetchSongs"
    @select="selectSong"
  />
</template>

<script setup>
import { ref } from "vue";
import SearchInput from "./SearchInput.vue";
import { useSongImage } from "../composables/useSongImage";

const props = defineProps({
  artist: { type: Object, required: true }, // artist.id y artist.name
});
const emit = defineEmits(["song-selected"]);
const { imageUrl, fetchSongImage } = useSongImage();

async function fetchSongs(query) {
  const mbid = props.artist.id;
  const encoded = encodeURIComponent(query);

  const url = `https://musicbrainz.org/ws/2/recording?query=recording:${encoded}%20AND%20arid:${mbid}&fmt=json`;
  const res = await fetch(url, {
    headers: { "User-Agent": "InstaLyricsApp/1.0" },
  });
  const data = await res.json();

  const songs = data.recordings?.slice(0, 10) || [];

  return songs.map((song) => ({
    ...song,
    name: song.title, // ← necesario para que el dropdown muestre texto
  }));
}


async function selectSong(song) {
  // buscamos el primer release asociado
  await fetchSongImage(song.id);

  emit("song-selected", {
    song: song,
    image: imageUrl.value,
  });
}
</script>
