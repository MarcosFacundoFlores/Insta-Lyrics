<template>
  <button
    @click="$emit('generate')"
    class="mt-4 px-6 py-3 bg-black text-white rounded-full shadow-md hover:bg-gray-800 transition-colors duration-300"
  >
    Generar Letra
  </button>
</template>

<script setup>
defineEmits(['generate'])
</script>
