<template>
  <div class="mt-6 text-center">
    <h2 class="text-2xl font-semibold">{{ songTitle }}</h2>
    <p class="text-gray-600 text-sm mt-1">{{ artistName }}</p>
  </div>
</template>

<script setup>
defineProps({
  songTitle: { type: String, required: true },
  artistName: { type: String, required: true },
})
</script>
