<template>
  <SearchInput
    label="Artista"
    placeholder="Buscar artista..."
    :fetchSuggestions="fetchArtists"
    @select="selectArtist"
  />
</template>

<script setup>
import SearchInput from './SearchInput.vue'
import { useArtistImage } from '../composables/useArtistImage'
import { ref } from 'vue'

const emit = defineEmits(['artist-selected'])
const { imageUrl, fetchArtistImage } = useArtistImage()

async function fetchArtists(query) {
  const url = `https://musicbrainz.org/ws/2/artist?query=artist:${encodeURIComponent(query)}&fmt=json`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'InstaLyricsApp/1.0' },
  })
  const data = await res.json()
  return data.artists?.slice(0, 10) || []
}

async function selectArtist(artist) {
  await fetchArtistImage(artist.id)
  emit('artist-selected', { artist, image: imageUrl.value })
}
</script>
