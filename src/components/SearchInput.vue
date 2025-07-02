<template>
  <div class="relative w-full max-w-md">
    <label class="block text-sm font-medium mb-1">{{ label }}</label>
    <input
      v-model="searchTerm"
      @input="onInput"
      type="text"
      :placeholder="placeholder"
      class="w-full p-2 border rounded"
    />

    <!-- Spinner -->
    <div
      v-if="loading"
      class="absolute top-full left-0 mt-1 w-full border border-gray-200 shadow rounded flex items-center justify-center py-3 z-50"
    >
      <svg
        class="animate-spin h-5 w-5 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        />
      </svg>
    </div>

    <!-- Lista de sugerencias -->
    <ul
      v-if="suggestions.length"
      class="absolute top-full left-0 mt-1 w-full border rounded shadow max-h-96 overflow-y-auto z-50"
    >
      <li
        v-for="item in suggestions"
        :key="item.id"
        @click="selectItem(item)"
        class="p-2 hover:bg-gray-700 cursor-pointer transition"
      >
        <slot name="suggestion" :item="item">
          {{ item.name }}
        </slot>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Buscar' },
  placeholder: { type: String, default: 'Buscar...' },
  fetchSuggestions: { type: Function, required: true },
})
const emit = defineEmits(['select'])

const searchTerm = ref('')
const suggestions = ref([])
const loading = ref(false)
let timeout

async function onInput() {
  clearTimeout(timeout)
  suggestions.value = []

  if (searchTerm.value.length < 2) {
    loading.value = false
    return
  }

  loading.value = true

  timeout = setTimeout(async () => {
    try {
      const result = await props.fetchSuggestions(searchTerm.value)
      suggestions.value = result
    } catch (e) {
      console.warn('Error fetching suggestions:', e)
      suggestions.value = []
    } finally {
      loading.value = false
    }
  }, 500)
}

function selectItem(item) {
  searchTerm.value = item.name
  suggestions.value = []
  emit('select', item)
}
</script>
