<!-- <template>
    <div class="flex flex-col gap-2">
      <label class="text-sm text-[#6E717C] font-medium">{{ label }}</label>
      <VueMultiselect
        v-model="selectedOption"
        placeholder="Search options"
        :searchable="true"
        :internal-search="false"
        :options="options"
        :multiple="false"
        :taggable="false"
        :track-by="trackBy"
        :loading="loading"
        :allow-empty="false"
        :hide-selected="true"
        select-label=""
        :label="labelKey"
        @search-change="searching"
        @select="handleSelection"
        @open="is_droped_down = true"
        @close="is_droped_down = false"
      >

        <template v-if="selectedOption?.[trackBy] && !is_droped_down" #selection="">
          <div class="flex gap-2 w-full overflow-hidden max-w-[300px]">
            <img v-if="selectedOption.images?.length" :src="selectedOption.images[0]" class="w-10 h-10 rounded-full object-cover border" alt="option image">
            <img v-else src="@/assets/img/gallery2.png" class="w-10 h-10 rounded-full object-cover border" alt="default image">
            <div class="flex flex-col gap-1">
              <p class="text-sm">{{ selectedOption[labelKey] }} {{ selectedOption['lastName'] }}</p>
              <p class="text-xs">{{ selectedOption.email }}</p>
            </div>
          </div>
        </template>
  

        <template #option="{ option }">
          <div class="flex gap-2 w-full overflow-hidden max-w-[300px]">
            <img v-if="option.images?.length" :src="option.images[0]" class="w-10 h-10 rounded-full object-cover border" alt="option image">
            <img v-else src="@/assets/img/gallery2.png" class="w-10 h-10 rounded-full object-cover border" alt="default image">
            <div class="flex flex-col gap-1">
              <p class="text-sm">{{ option[labelKey] }} {{ option['lastName'] }}</p>
              <p class="text-xs">{{ option.email }}</p>
            </div>
          </div>
        </template>
      </VueMultiselect>
    </div>
  </template>
  
  <script setup lang="ts">
  import VueMultiselect from 'vue-multiselect'
  import { watchDebounced } from '@vueuse/core'
  import 'vue-multiselect/dist/vue-multiselect.css'
  
  const emit = defineEmits(['update:modelValue', 'option-selected'])
  const props = defineProps({
    label: { type: String, default: 'Select Option' },
    modelValue: { type: Object, required: true },
    options: { type: Array, required: true },
    loading: { type: Boolean, default: false },
    trackBy: { type: String, default: 'id' }, // Used to track unique fields
    labelKey: { type: String, default: 'name' } // Label to display in the dropdown
  })
  
  const is_droped_down = ref(false)
  const search = ref('')
  
  const searching = (val: string) => {
    search.value = val
    emit('search-change', val) // Emit search-change so parent can handle the search logic
  }
  
  const selectedOption = ref(props.modelValue)
  
  const handleSelection = (val: any) => {
    selectedOption.value = val
    emit('update:modelValue', val) // Emit the selected value to update v-model
    emit('option-selected', val) // Emit the selected option
  }
  
  // Watch for modelValue prop change to keep selectedOption in sync
  watch(() => props.modelValue, (newValue) => {
    selectedOption.value = newValue
  })
  </script>
   -->
   <template>
    <div class="flex flex-col gap-2">
      <label class="text-sm text-[#6E717C] font-medium">{{ label }}</label>
      <VueMultiselect
        v-model="selectedOption"
        placeholder="Search options"
        :searchable="true"
        :internal-search="false"
        :options="filteredOptions"
        :multiple="false"
        :taggable="false"
        :track-by="trackBy"
        :label="labelKey"
        :loading="loading"
        :allow-empty="false"
        :hide-selected="true"
        select-label=""
        @search-change="searching"
        @select="handleSelection"
        @open="is_droped_down = true"
        @close="is_droped_down = false"
      >
        <!-- Display when something is selected -->
        <template v-if="selectedOption && selectedOption[trackBy] && !is_droped_down" #selection="">
          <div class="flex gap-2 w-full overflow-hidden max-w-[300px]">
            <img v-if="selectedOption.images?.length" :src="selectedOption.images[0]" class="w-10 h-10 rounded-full object-cover border" alt="option image">
            <img v-else src="@/assets/img/gallery2.png" class="w-10 h-10 rounded-full object-cover border" alt="default image">
            <div class="flex flex-col gap-1">
              <p class="text-sm">{{ selectedOption[labelKey] ?? "--" }} {{ selectedOption['lastName'] ?? "--" }}</p>
              <p class="text-xs">{{ selectedOption.email ?? "N/A" }}</p>
            </div>
          </div>
        </template>
  
        <!-- Display for each option in the dropdown -->
        <template #option="{ option }">
          <div v-if="option && option[trackBy]" class="flex gap-2 w-full overflow-hidden max-w-[300px]">
            <img v-if="option.images?.length" :src="option.images[0]" class="w-10 h-10 rounded-full object-cover border" alt="option image">
            <img v-else src="@/assets/img/gallery2.png" class="w-10 h-10 rounded-full object-cover border" alt="default image">
            <div class="flex flex-col gap-1">
              <p class="text-sm">{{ option[labelKey] ?? "--" }} {{ option['lastName'] ?? "--" }}</p>
              <p class="text-xs">{{ option.email ?? "N/A" }}</p>
            </div>
          </div>
        </template>
      </VueMultiselect>
    </div>
  </template>
  
  <!-- <script setup lang="ts">
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
  
  // **Use reduce to remove null or undefined options**
  const filteredOptions = computed(() => {
    return props.options.reduce((acc, item) => {
      if (item && item[props.trackBy]) acc.push(item) // Ensure item is not null & has the tracking property
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
  })
  </script>
   -->

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
})
</script>
