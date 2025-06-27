<template>
  <div class="relative h-60 w-full flex items-center justify-center">
      <img
        v-for="img in images"
        :key="img.key"
        :src="img.src"
        :alt="img.alt || ''"
        class=""
        :class="img.class || defaultClass"
      />
  </div>
</template>

<script setup>
defineProps({
  images: {
    type: Array,
    required: true,
    // formato esperado:
    // { key: string, src: string, class?: string, alt?: string }
  }
})

const defaultClass = "w-32 h-32 object-cover rounded shadow"
</script>

<style scoped>
/*.fade-image-enter-active,
.fade-image-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-image-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-image-leave-to {
  opacity: 0;
  transform: translateY(-20px);
} */
</style>
