<template>
  <div class="flex flex-col gap-2">
    <label class="text-sm text-[#6E717C] font-medium">{{ label }}</label>
    <VueMultiselect v-model="selectedOption" placeholder="Search options" :searchable="true" :internal-search="false"
      :options="filteredOptions" :multiple="false" :taggable="false" :track-by="trackBy" :label="labelKey"
      :loading="loading" :allow-empty="false" :hide-selected="true" select-label="" @search-change="searching"
      @select="handleSelection" @open="is_droped_down = true" @close="is_droped_down = false">
      <!-- Display when something is selected -->
      <template v-if="selectedOption && selectedOption[trackBy] && !is_droped_down" #selection="">
        <div class="flex gap-2 w-full overflow-hidden max-w-[300px]">
          <img v-if="selectedOption.images?.length" :src="selectedOption.images[0]"
            class="w-10 h-10 rounded-full object-cover border" alt="option image">
            <svg v-else class="w-10 h-10 rounded-full border object-cover" viewBox="0 0 50 50"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M38.9271 39.7854C40.9459 37.8885 42.5541 35.5977 43.6524 33.0546C44.7507 30.5115 45.3157 27.7701 45.3125 25C45.3125 13.7812 36.2188 4.6875 25 4.6875C13.7813 4.6875 4.68751 13.7812 4.68751 25C4.68431 27.7701 5.24932 30.5115 6.34762 33.0546C7.44592 35.5977 9.05416 37.8885 11.0729 39.7854C14.8374 43.3414 19.8216 45.3195 25 45.3125C30.1785 45.3195 35.1626 43.3414 38.9271 39.7854ZM12.8021 37.1083C14.2648 35.2784 16.1209 33.8015 18.2326 32.7873C20.3443 31.7731 22.6574 31.2477 25 31.25C27.3427 31.2477 29.6557 31.7731 31.7674 32.7873C33.8792 33.8015 35.7353 35.2784 37.1979 37.1083C35.6021 38.7202 33.7022 39.9992 31.6083 40.8711C29.5144 41.743 27.2682 42.1904 25 42.1875C22.7318 42.1904 20.4856 41.743 18.3917 40.8711C16.2978 39.9992 14.3979 38.7202 12.8021 37.1083ZM32.8125 18.75C32.8125 20.822 31.9894 22.8091 30.5243 24.2743C29.0592 25.7394 27.072 26.5625 25 26.5625C22.928 26.5625 20.9409 25.7394 19.4757 24.2743C18.0106 22.8091 17.1875 20.822 17.1875 18.75C17.1875 16.678 18.0106 14.6909 19.4757 13.2257C20.9409 11.7606 22.928 10.9375 25 10.9375C27.072 10.9375 29.0592 11.7606 30.5243 13.2257C31.9894 14.6909 32.8125 16.678 32.8125 18.75Z"
              fill="#D6D0CC" />
          </svg>
          <div class="flex flex-col gap-1">
            <p class="text-sm">{{ selectedOption[labelKey] ?? "--" }} {{ selectedOption['lastName'] ?? "--" }}</p>
            <p class="text-xs">{{ selectedOption.email ?? "N/A" }}</p>
          </div>
        </div>
      </template>

      <!-- Display for each option in the dropdown -->
      <template #option="{ option }">
        <div v-if="option && option[trackBy]" class="flex gap-2 w-full overflow-hidden max-w-[300px]">
          <img v-if="option.images?.length" :src="option.images[0]" class="w-10 h-10 rounded-full object-cover border"
            alt="option image">
          <svg v-else class="w-10 h-10 rounded-full border object-cover" viewBox="0 0 50 50"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M38.9271 39.7854C40.9459 37.8885 42.5541 35.5977 43.6524 33.0546C44.7507 30.5115 45.3157 27.7701 45.3125 25C45.3125 13.7812 36.2188 4.6875 25 4.6875C13.7813 4.6875 4.68751 13.7812 4.68751 25C4.68431 27.7701 5.24932 30.5115 6.34762 33.0546C7.44592 35.5977 9.05416 37.8885 11.0729 39.7854C14.8374 43.3414 19.8216 45.3195 25 45.3125C30.1785 45.3195 35.1626 43.3414 38.9271 39.7854ZM12.8021 37.1083C14.2648 35.2784 16.1209 33.8015 18.2326 32.7873C20.3443 31.7731 22.6574 31.2477 25 31.25C27.3427 31.2477 29.6557 31.7731 31.7674 32.7873C33.8792 33.8015 35.7353 35.2784 37.1979 37.1083C35.6021 38.7202 33.7022 39.9992 31.6083 40.8711C29.5144 41.743 27.2682 42.1904 25 42.1875C22.7318 42.1904 20.4856 41.743 18.3917 40.8711C16.2978 39.9992 14.3979 38.7202 12.8021 37.1083ZM32.8125 18.75C32.8125 20.822 31.9894 22.8091 30.5243 24.2743C29.0592 25.7394 27.072 26.5625 25 26.5625C22.928 26.5625 20.9409 25.7394 19.4757 24.2743C18.0106 22.8091 17.1875 20.822 17.1875 18.75C17.1875 16.678 18.0106 14.6909 19.4757 13.2257C20.9409 11.7606 22.928 10.9375 25 10.9375C27.072 10.9375 29.0592 11.7606 30.5243 13.2257C31.9894 14.6909 32.8125 16.678 32.8125 18.75Z"
              fill="#D6D0CC" />
          </svg>
          <!-- <img v-else src="@/assets/img/gallery2.png" class="w-10 h-10 rounded-full object-cover border"
            alt="default image"> -->
          <div class="flex flex-col gap-1">
            <p class="text-sm">{{ option[labelKey] ?? "--" }} {{ option['lastName'] ?? "--" }}</p>
            <p class="text-xs">{{ option.email ?? "N/A" }}</p>
          </div>
        </div>
      </template>
    </VueMultiselect>
  </div>
</template>

<script setup lang="ts">
import VueMultiselect from 'vue-multiselect'
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['update:modelValue', 'option-selected'])
const props = defineProps({
  label: { type: String, default: 'Select Option' },
  modelValue: { type: Object, default: () => ({}) },
  options: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  trackBy: { type: String, default: 'id' },
  labelKey: { type: String, default: 'firstName' }
})

const is_droped_down = ref(false)
const search = ref('')
const selectedOption = ref(props.modelValue ?? {})

// **Use reduce to remove null, undefined, or invalid options**
const filteredOptions = computed(() => {
  return props.options.reduce((acc, item) => {
    if (item && typeof item === 'object' && item[props.trackBy]) {
      acc.push(item)
    }
    return acc
  }, [])
})


const searching = (val: string) => {
  search.value = val
  emit('search-change', val)
}

const handleSelection = (val: any) => {
  selectedOption.value = val || {} // Ensure it's never null
  emit('update:modelValue', val)
  emit('option-selected', val)
}

// Keep selectedOption in sync with modelValue
watch(() => props.modelValue, (newValue) => {
  selectedOption.value = newValue || {}
  console.log(props.modelValue)

})
</script>
