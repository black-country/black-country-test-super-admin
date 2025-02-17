<template>
    <div class="w-full">
      <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
      </label>
  
      <div class="relative">
        <Multiselect
          v-model="selectedValue"
          :options="formattedOptions"
          :multiple="multiple"
          :close-on-select="!multiple"
          :clear-on-select="false"
          :preserve-search="true"
          :placeholder="placeholder"
          :track-by="'id'"
          :label="'name'"
          :searchable="searchable"
          :loading="loadingProperties"
          :disabled="disabled"
          @select="handleSelect"
          @remove="handleRemove"
          @search-change="handleSearchChange"
          class="multiselect-tailwind"
        >
          <template v-slot:option="{ option }">
            <div class="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100">
              <div class="flex items-center space-x-2">
                <img
                  v-if="option.image"
                  :src="option.image"
                  alt="Property image"
                  class="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p class="text-gray-900 font-medium">{{ option.name }}</p>
                  <p class="text-gray-500 text-xs">
                    {{ option.houseType }} • {{ option.bedrooms }} Beds • {{ option.bathrooms }} Baths • {{ option.size }}
                  </p>
                </div>
              </div>
            </div>
          </template>
  
          <template v-slot:noResult>
            <div class="text-center py-2 px-3 text-gray-500 text-sm">No results found</div>
          </template>
  
          <template v-slot:noOptions>
            <div class="text-center py-2 px-3 text-gray-500 text-sm">No properties available</div>
          </template>
        </Multiselect>
      </div>
  
      <span v-if="error" class="text-red-500 text-sm mt-1 block">
        {{ error }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import Multiselect from "vue-multiselect";
  import { useGetProperties } from "@/composables/modules/property/fetchProperties";
  
  // Importing composables
  const {
    loadingProperties,
    propertiesList,
    // searchQuery,
    filters,
    metadata,
    getProperties
  } = useGetProperties();
  
  // Props definition
  defineProps({
    modelValue: {
      type: [Array, Object, String, Number],
      default: null
    },
    label: {
      type: String,
      default: "Select a Property"
    },
    placeholder: {
      type: String,
      default: "Search properties..."
    },
    multiple: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: () => `multiselect-${Math.random().toString(36).substr(2, 9)}`
    }
  });
  
  // Emits definition
  const emit = defineEmits(["update:modelValue", "select", "remove", "search-change"]);
  
  // Selected value reactive variable
  const selectedValue = computed({
    get: () => propertiesList.value.find(p => p.id === propertiesList.value.id) || null,
    set: (value) => emit("update:modelValue", value)
  });
  
  // Automatically load all properties on mount
  onMounted(() => {
    metadata.value.perPage = 10000000; // Load all properties
    getProperties();
  });
  
  // Format the properties list to match the expected structure
  const formattedOptions = computed(() =>
    propertiesList.value.map(item => ({
      id: item.id,
      name: item.name,
      houseType: item.houseType?.name || "Unknown",
      bedrooms: item.bedroomCount || 0,
      bathrooms: item.bathroomCount || 0,
      size: `${item.size} ${item.sizeUnit || ""}`,
      image: item.images?.[0] || "" // Use the first image if available
    }))
  );
  
  // Search functionality integration
  const handleSearchChange = (query: string) => {
    filters.value.searchQuery = query;
    // getProperties(); // Fetch filtered properties
    // emit("search-change", query);
  };
  
  // Selection handlers
  const handleSelect = (option: any) => emit("select", option);
  const handleRemove = (option: any) => emit("remove", option);
  </script>
