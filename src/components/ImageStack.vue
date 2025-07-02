<template>
  <div class="w-full h-48 flex items-center justify-center">
    <div class="flex items-center justify-center gap-12">
      <img
        v-for="img in images"
        :key="img.key"
        :src="img.src"
        :alt="img.alt || ''"
        class="w-32 h-32 object-cover rounded-full shadow"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  images: {
    type: Array,
    required: true,
    // [{ key: string, src: string, alt?: string }]
  },
})
</script>
