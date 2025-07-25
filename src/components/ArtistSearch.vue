<template>
  <SearchInput
    label="Artista"
    placeholder="Buscar artista..."
    :fetchSuggestions="fetchArtists"
    @select="selectArtist"
  >
    <template #suggestion="{ item }">
      <div>
        <div class="font-medium">{{ item.name }}</div>
        <div v-if="item.subtitle" class="text-sm text-gray-400">
          {{ item.subtitle }}
        </div>
      </div>
    </template>
  </SearchInput>
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

  return (data.artists?.slice(0, 10) || []).map(artist => ({
    ...artist,
    name: artist.name,
    subtitle: artist.disambiguation || '', // lo pasamos como subtitle
  }))
}

async function selectArtist(artist) {
  await fetchArtistImage(artist.id)
  emit('artist-selected', { artist, image: imageUrl.value })
}
</script>
