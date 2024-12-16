<!-- <template>
  <div class="flex flex-col gap-2">
    <label class="text-sm text-[#6E717C] font-medium">{{ label }}</label>
    <VueMultiselect
      v-model="selectedItems"
      :placeholder="placeholder"
      :searchable="true"
      :internal-search="false"
      :options="items"
      :multiple="true"
      :taggable="false"
      :close-on-select="false"
      track-by="id"
      :loading="loading"
      :hide-selected="false"
      select-label="firstName"
      label="firstName"
      class="multiselect-custom"
      @search-change="handleSearch"
      @select="handleSelect"
      @remove="handleRemove"
      @open="isDropdownOpen = true"
      @close="isDropdownOpen = false"
    >

      <template #tag="{ option, remove }">
        <slot 
          name="selected-item" 
          :item="option" 
          :remove="remove"
          v-if="!isDropdownOpen"
        >
          <div class="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 mr-1 mb-1">
            <img 
              v-if="option.image" 
              :src="option.image" 
              class="w-6 h-6 rounded-full object-cover"
              :alt="option.name"
            >
            <span class="text-sm">{{ option.firstName }} {{ option.lastName }}</span>
            <button 
              type="button"
              @click.stop="remove(option)"
              class="text-gray-500 hover:text-gray-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </slot>
      </template>


      <template #option="{ option }">
        <slot name="option" :item="option">
          <div class="flex items-center gap-2 p-2 hover:bg-gray-50">
            <img 
              v-if="option.image" 
              :src="option.image" 
              class="w-8 h-8 rounded-full object-cover border"
              :alt="option.name"
            >
            <div class="flex flex-col">
              <span class="text-sm font-medium">{{ option.firstName }} {{ option.lasttName }}</span>
            </div>
          </div>
        </slot>
      </template>


      <template #noResult>
        <div class="text-sm text-gray-500 p-2">
          No results found
        </div>
      </template>


      <template #loading>
        <div class="text-sm text-gray-500 p-2">
          Loading...
        </div>
      </template>
    </VueMultiselect>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import VueMultiselect from 'vue-multiselect'
import { watchDebounced } from '@vueuse/core'
import 'vue-multiselect/dist/vue-multiselect.css'

interface Item {
  id: string | number
  name: string
  description?: string
  image?: string
  [key: string]: any
}

interface Props {
  modelValue: Item[]
  items: Item[]
  label?: string
  placeholder?: string
  searchable?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select Items',
  placeholder: 'Search items',
  searchable: true,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [items: Item[]]
  'search': [query: string]
  'select': [item: Item]
  'remove': [item: Item]
  'change': [items: Item[]]
}>()

const selectedItems = ref<Item[]>(props.modelValue)
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const loading = ref(props.loading)

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  selectedItems.value = newValue
}, { deep: true })

// Watch for selected items changes
watch(selectedItems, (newValue) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
}, { deep: true })

// Watch for loading prop changes
watch(() => props.loading, (newValue) => {
  loading.value = newValue
})

const handleSearch = (query: string) => {
  searchQuery.value = query
  emit('search', query)
}

const handleSelect = (item: Item) => {
  emit('select', item)
}

const handleRemove = (item: Item) => {
  emit('remove', item)
}

// Expose some methods and values for parent component
defineExpose({
  clearSelection: () => {
    selectedItems.value = []
  },
  getSelected: () => selectedItems.value,
  isOpen: () => isDropdownOpen.value
})
</script>

<style>
/* Base multiselect styles */
.multiselect-custom {
  min-height: 42px !important;
  border: 1px solid rgb(209 213 219) !important;
  border-radius: 0.5rem !important;
}

.multiselect-custom .multiselect__tags {
  min-height: 42px !important;
  border-radius: 0.5rem !important;
  border: none !important;
  padding: 0.25rem 0.75rem !important;
}

.multiselect-custom .multiselect__input {
  border: none !important;
  padding: 0 !important;
  font-size: 0.875rem !important;
}

.multiselect-custom .multiselect__placeholder {
  color: rgb(156 163 175) !important;
  font-size: 0.875rem !important;
  margin: 0 !important;
  padding: 0 !important;
}

.multiselect-custom .multiselect__content-wrapper {
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
}

.multiselect-custom .multiselect__option--highlight {
  background-color: rgb(243 244 246) !important;
  color: rgb(17 24 39) !important;
}

.multiselect-custom .multiselect__option--selected {
  background-color: rgb(239 246 255) !important;
  color: rgb(37 99 235) !important;
  font-weight: 500 !important;
}
</style> -->

<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm text-[#6E717C] font-medium">{{ label }}</label>
    <VueMultiselect
      v-model="selectedItems"
      :placeholder="placeholder"
      :searchable="true"
      :internal-search="false"
      :options="items"
      :multiple="true"
      :taggable="false"
      :close-on-select="false"
      track-by="id"
      :loading="loading"
      :hide-selected="false"
      :custom-label="nameLabel"
      class="multiselect-custom"
      @search-change="handleSearch"
      @select="handleSelect"
      @remove="handleRemove"
      @open="isDropdownOpen = true"
      @close="isDropdownOpen = false"
    >
      <!-- Selected Items Template -->
      <template #tag="{ option, remove }">
        <slot 
          name="selected-item" 
          :item="option" 
          :remove="remove"
          v-if="!isDropdownOpen"
        >
          <div class="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 mr-1 mb-1 max-w-full">
            <!-- <img 
              v-if="option.image" 
              :src="option.image" 
              class="w-6 h-6 rounded-full object-cover flex-shrink-0"
              :alt="nameLabel(option)"
            > -->
            <span class="text-sm truncate">{{ nameLabel(option) }}</span>
            <button 
              type="button"
              @click.stop="remove(option)"
              class="text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </slot>
      </template>

      <!-- Dropdown Option Template -->
      <template #option="{ option }">
        <slot name="option" :item="option">
          <div class="flex items-center gap-2 p-2 hover:bg-gray-50">
            <img 
              v-if="option.image" 
              :src="option.image" 
              class="w-8 h-8 rounded-full object-cover border flex-shrink-0"
              :alt="nameLabel(option)"
            >
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-medium truncate">{{ nameLabel(option) }}</span>
            </div>
          </div>
        </slot>
      </template>

      <!-- No Results Template -->
      <template #noResult>
        <div class="text-sm text-gray-500 p-2">
          No results found
        </div>
      </template>

      <!-- Loading Template -->
      <!-- <template #loading>
        <div class="text-sm text-gray-500 p-2">
          Loading...
        </div>
      </template> -->
    </VueMultiselect>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import VueMultiselect from 'vue-multiselect'
import { watchDebounced } from '@vueuse/core'
import 'vue-multiselect/dist/vue-multiselect.css'

interface Item {
  id: string | number
  firstName: string
  lastName: string
  description?: string
  image?: string
  [key: string]: any
}

interface Props {
  modelValue: Item[]
  items: Item[]
  label?: string
  placeholder?: string
  searchable?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Select Items',
  placeholder: 'Search items',
  searchable: true,
  loading: false
})

const emit = defineEmits<{
  'update:modelValue': [items: Item[]]
  'search': [query: string]
  'select': [item: Item]
  'remove': [item: Item]
  'change': [items: Item[]]
}>()

const selectedItems = ref<Item[]>(props.modelValue)
const isDropdownOpen = ref(false)
const searchQuery = ref('')
const loading = ref(props.loading)

// Function to compute full name
const nameLabel = (item: Item): string => {
  return `${item.firstName} ${item.lastName}`.trim()
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  selectedItems.value = newValue
}, { deep: true })

// Watch for selected items changes
watch(selectedItems, (newValue) => {
  emit('update:modelValue', newValue)
  emit('change', newValue)
}, { deep: true })

// Watch for loading prop changes
watch(() => props.loading, (newValue) => {
  loading.value = newValue
})

const handleSearch = (query: string) => {
  searchQuery.value = query
  emit('search', query)
}

const handleSelect = (item: Item) => {
  emit('select', item)
}

const handleRemove = (item: Item) => {
  emit('remove', item)
}

// Expose some methods and values for parent component
defineExpose({
  clearSelection: () => {
    selectedItems.value = []
  },
  getSelected: () => selectedItems.value,
  isOpen: () => isDropdownOpen.value
})
</script>

<style>
/* Base multiselect styles */
.multiselect-custom {
  min-height: 42px !important;
  border: 1px solid rgb(209 213 219) !important;
  border-radius: 0.5rem !important;
}

.multiselect-custom .multiselect__tags {
  min-height: 42px !important;
  border-radius: 0.5rem !important;
  border: none !important;
  padding: 0.25rem 0.75rem !important;
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 0.25rem !important;
}

.multiselect-custom .multiselect__tag {
  margin: 0 !important;
}

.multiselect-custom .multiselect__input {
  border: none !important;
  padding: 0 !important;
  font-size: 0.875rem !important;
}

.multiselect-custom .multiselect__placeholder {
  color: rgb(156 163 175) !important;
  font-size: 0.875rem !important;
  margin: 0 !important;
  padding: 0 !important;
}

.multiselect-custom .multiselect__content-wrapper {
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
}

.multiselect-custom .multiselect__option--highlight {
  background-color: rgb(243 244 246) !important;
  color: rgb(17 24 39) !important;
}

.multiselect-custom .multiselect__option--selected {
  background-color: rgb(239 246 255) !important;
  color: rgb(37 99 235) !important;
  font-weight: 500 !important;
}
</style>