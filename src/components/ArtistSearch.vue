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

    <ul v-if="suggestions.length" class="border mt-1 rounded bg-white shadow max-h-96 overflow-y-auto">
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
import { ref } from 'vue'
const emit = defineEmits(['artist-selected'])

const searchTerm = ref('')
const suggestions = ref([])
let timeout

async function onInput() {
  clearTimeout(timeout)
  if (searchTerm.value.length < 2) {
    suggestions.value = []
    return
  }

  timeout = setTimeout(async () => {
    const query = `artist:${encodeURIComponent(searchTerm.value)}`
    const url = `https://musicbrainz.org/ws/2/artist?query=${query}&fmt=json`

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'InstaLyricsApp/1.0',
      },
    })

    const data = await res.json()
    suggestions.value = data.artists?.slice(0, 10) || []
  }, 400) // un poco más largo para evitar rate limit
}

async function selectArtist(artist) {
  searchTerm.value = artist.name
  suggestions.value = []

  const image = await fetchImageFromMusicBrainz(artist.id)

  emit('artist-selected', {
    artist,
    image,
  })
}


async function fetchImageFromMusicBrainz(mbid) {
  try {
    const url = `https://musicbrainz.org/ws/2/artist/${mbid}?inc=url-rels&fmt=json`
    const res = await fetch(url)
    const data = await res.json()
    const relations = data.relations || []

    // 🔍 1. Intentamos imagen directa (Wikimedia)
    for (const rel of relations) {
      if (rel.type === 'image') {
        let imageUrl = rel.url.resource
        if (imageUrl.startsWith('https://commons.wikimedia.org/wiki/File:')) {
          const filename = imageUrl.split('/').pop()
          const wikiRes = await fetch(
            `https://en.wikipedia.org/w/api.php?action=query&titles=File:${filename}&prop=imageinfo&iiprop=url&format=json&origin=*`
          )
          const wikiData = await wikiRes.json()
          const pages = wikiData.query.pages
          const page = pages[Object.keys(pages)[0]]
          return page?.imageinfo?.[0]?.url || null
        }
        return imageUrl
      }
    }

    // 🔍 2. Fallback: usamos SoundCloud
    const scRel = relations.find(r => r.type === 'soundcloud')
    if (scRel?.url?.resource) {
      const image = await fetchImageFromSoundCloudProfile(scRel.url.resource)
      if (image) return image
    }
  } catch (err) {
    console.warn('Error obteniendo imagen', err)
  }

  return null
}


async function fetchImageFromSoundCloudProfile(profileUrl) {
  try {
    const response = await fetch(profileUrl)
    const html = await response.text()

    const match = html.match(/<meta property="og:image" content="([^"]+)"/)
    if (match && match[1]) {
      return match[1]
    }
  } catch (e) {
    console.warn('No se pudo scrapear imagen desde SoundCloud:', e)
  }
  return null
}



</script>
