<template>
  <div class="w-full h-auto flex items-center justify-center">
    <transition-group
      name="fade-image"
      tag="div"
      class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
    >
      <img
        v-for="img in images"
        :key="img.key"
        :src="img.src"
        :alt="img.alt || ''"
        class="w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-full shadow"
      />
    </transition-group>
  </div>
</template>


<script setup>
defineProps({
  images: {
    type: Array,
    required: true,
    // [{ key: string, src: string, alt?: string }]
  },
});
</script>

<style scoped>
/* Fade + slide for entering images */
.fade-image-enter-active {
  transition: all 0.5s ease;
}
.fade-image-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-image-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Ensure no flicker or collapse on move (if needed later) */
.fade-image-move {
  transition: transform 0.5s ease;
}
</style>

