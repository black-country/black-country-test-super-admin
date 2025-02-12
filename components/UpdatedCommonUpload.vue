<template>
  <div class="">
    <div class="text-lg text-gray-600 mb-4">
      Click to add as many pictures as you want to for each common area or space.
    </div>
    <p class="text-sm text-gray-500">Accepts jpg & png | 2MB size max/each</p>

    <!-- Check if there are common areas -->
    <div v-if="commonAreas.length" class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      <div v-for="area in commonAreas" :key="area.id" class="relative rounded-lg overflow-hidden border border-gray-300">
        
        <!-- Image preview carousel -->
        <div class="relative h-64 w-full">
          <!-- Show uploaded images -->
          <img 
            v-if="area.images && area.images.length" 
            :src="area.images[currentImage[area.id]]" 
            alt="Common Area Image" 
            class="object-cover w-full h-full">
          
          <!-- Show a placeholder when no image -->
          <div v-else class="flex items-center justify-center h-full w-full bg-gray-100">
            <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-16 h-16">
          </div>
          
          <!-- Loading spinner -->
          <div v-if="isLoading[area.id]" class="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <span class="loader"></span>
          </div>

          <!-- Delete icon (top-right corner) -->
          <button 
            @click="deleteAllImages(area.id)" 
            class="absolute top-2 right-2 text-white  bg-opacity-50"
          >
          <svg width="34" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="14" fill="black" fill-opacity="0.5"/>
            <path d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Previous and Next buttons -->
          <button 
            v-if="area.images && area.images.length > 1 && !isLoading[area.id]" 
            @click="prevImage(area.id)" 
            class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-opacity-50 "
          >
          <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
            <path d="M11.5 7C11.5 7 8.50001 9.20945 8.5 10C8.5 10.7906 11.5 13 11.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button 
            v-if="area.images && area.images.length > 1 && !isLoading[area.id]" 
            @click="nextImage(area.id)" 
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-opacity-50 "
          >
          <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
            <path d="M8.50002 7C8.50002 7 11.5 9.20945 11.5 10C11.5 10.7906 8.5 13 8.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Common area label and image count (bottom-left corner) -->
          <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white flex justify-between items-center px-4 py-2">
            <span class="text-sm">{{ area.name }} | {{ area.images ? area.images.length : 0 }} images</span>
            <label class="cursor-pointer inline-flex items-center space-x-2 bg-black rounded-lg py-2.5 px-2">
              <input type="file" class="hidden" accept="image/*" multiple @change="handleFileUpload($event, area.id)">
              <span class="text-white text-xs">+ Add photo</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Show message if no common areas are available -->
    <div v-else class="text-center mt-6">
      No common areas found. Please ensure 'property_commonAreas' is stored in localStorage.
    </div>
  </div>
</template>

<!-- <script setup lang="ts">
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // batch upload composable

const { uploadFiles, uploadResponse } = useBatchUploadFile();

const props = defineProps({
    payload: {
      type: Object
    }
  });

// Dynamically loaded common areas from localStorage
const commonAreas = ref([]);

// Track current image being displayed for each area (for carousel functionality)
const currentImage = ref<Record<string, number>>({});

// Loading state for uploads
const isLoading = ref<Record<string, boolean>>({});

// Progress state for each image upload
const uploadProgress = ref<Record<string, number>>({});

// File size limit (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Graceful fallback for requestIdleCallback (for browsers that don't support it)
const requestIdleCallbackFallback = (cb: Function) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 1); // Minimal delay fallback
  }
};

// Load common areas from localStorage (property_commonAreas)
const loadFromLocalStorage = () => {
  const storedAreas = localStorage.getItem('property_commonAreas');
  if (storedAreas) {
    const parsedAreas = JSON.parse(storedAreas);
    commonAreas.value = parsedAreas;

    // Initialize currentImage and isLoading for each common area
    parsedAreas.forEach((area: any) => {
      currentImage.value[area.id] = 0;
      isLoading.value[area.id] = false;
      uploadProgress.value[area.id] = 0; // Initial progress
      if (!area.images) area.images = [];
    });
  }
};

// Debounce localStorage writes to optimize performance
const persistToLocalStorage = debounce(() => {
  requestIdleCallbackFallback(() => {
    localStorage.setItem('property_commonAreas', JSON.stringify(commonAreas.value));
  });
}, 500);

// Watch for changes to commonAreas and persist to localStorage
watch(commonAreas, persistToLocalStorage, { deep: true });

// Handle multiple file upload for each common area
const handleFileUpload = async (event: Event, areaId: string) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const formData = new FormData();

  // Check each file size and append valid files to the FormData object
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_FILE_SIZE) {
      alert(`File ${file.name} exceeds 2MB limit. Please choose a smaller file.`);
      continue; // Skip files that exceed the size limit
    }
    formData.append('images', file); // Add each image to FormData
  }

  // Only proceed if there are valid files
  if (formData.has('images')) {
    isLoading.value[areaId] = true;

    try {
      // Use the batch upload composable to upload the files
      await uploadFiles(formData, (progressEvent) => {
        // Track upload progress for the current common area
        const total = progressEvent.total ?? 1;
        uploadProgress.value[areaId] = Math.round((progressEvent.loaded / total) * 100);
      });

      // Extract secure URLs from the response and add them to the area images
      const areaIndex = commonAreas.value.findIndex((area: any) => area.id === areaId);
      if (areaIndex !== -1) {
        const uploadedImages = uploadResponse.value.map((response: { url: string }) => response.url);
        const updatedImages = [...commonAreas.value[areaIndex].images, ...uploadedImages];
        
        // Replace the images array with the updated one (ensures reactivity)
        commonAreas.value[areaIndex].images = updatedImages;
      }
    } catch (error) {
      console.error("Failed to upload images", error);
    } finally {
      isLoading.value[areaId] = false;
      uploadProgress.value[areaId] = 0; // Reset progress after completion
    }
  }
};

// Handle image deletion
const deleteAllImages = (areaId: string) => {
  const areaIndex = commonAreas.value.findIndex((area: any) => area.id === areaId);
  if (areaIndex !== -1) {
    commonAreas.value[areaIndex].images = [];
  }
};

// Carousel next image
const nextImage = (areaId: string) => {
  const area = commonAreas.value.find((area: any) => area.id === areaId);
  if (area && area.images.length) {
    currentImage.value[areaId] = (currentImage.value[areaId] + 1) % area.images.length;
  }
};

// Carousel previous image
const prevImage = (areaId: string) => {
  const area = commonAreas.value.find((area: any) => area.id === areaId);
  if (area && area.images.length) {
    currentImage.value[areaId] =
      (currentImage.value[areaId] - 1 + area.images.length) % area.images.length;
  }
};

// Load common areas from localStorage on mount
loadFromLocalStorage();
</script> -->

<script setup lang="ts">
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // batch upload composable

const { uploadFiles, uploadResponse } = useBatchUploadFile();

const props = defineProps({
  payload: {
    type: Object,
    required: true
  }
});

// Dynamically loaded common areas from props.payload and localStorage
const commonAreas = ref(props.payload.commonAreas.value ?? []);

// Track current image being displayed for each area (for carousel functionality)
const currentImage = ref<Record<string, number>>({});

// Loading state for uploads
const isLoading = ref<Record<string, boolean>>({});

// Progress state for each image upload
const uploadProgress = ref<Record<string, number>>({});

// File size limit (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Graceful fallback for requestIdleCallback (for browsers that don't support it)
const requestIdleCallbackFallback = (cb: Function) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 1); // Minimal delay fallback
  }
};

// Load common areas from localStorage (property_commonAreas)
const loadFromLocalStorage = () => {
  const storedAreas = localStorage.getItem('property_commonAreas');
  if (storedAreas) {
    const parsedAreas = JSON.parse(storedAreas);
    commonAreas.value = parsedAreas;

    // Initialize currentImage, isLoading, and uploadProgress for each common area
    parsedAreas.forEach((area: any) => {
      currentImage.value[area.id] = 0;
      isLoading.value[area.id] = false;
      uploadProgress.value[area.id] = 0; // Initial progress
      if (!area.images) area.images = [];
    });
  }
};

// Watch for changes in props.payload.commonAreas and sync it with local commonAreas
watch(
  () => props.payload.commonAreas.value,
  (newVal) => {
    if (newVal) {
      commonAreas.value = newVal;
    }
  },
  { deep: true }
);

// Debounced localStorage writes to optimize performance
const persistToLocalStorage = debounce(() => {
  requestIdleCallbackFallback(() => {
    localStorage.setItem('property_commonAreas', JSON.stringify(commonAreas.value));
  });

  // Sync commonAreas with props.payload.commonAreas
  props.payload.commonAreas.value = commonAreas.value;
}, 1000); // Increase debounce interval to optimize performance

// Watch for changes to commonAreas and persist to localStorage
watch(commonAreas, persistToLocalStorage, { deep: true });

// Handle multiple file upload for each common area
const handleFileUpload = async (event: Event, areaId: string) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const formData = new FormData();

  // Check each file size and append valid files to the FormData object
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_FILE_SIZE) {
      alert(`File ${file.name} exceeds 2MB limit. Please choose a smaller file.`);
      continue; // Skip files that exceed the size limit
    }
    formData.append('images', file); // Add each image to FormData
  }

  // Only proceed if there are valid files
  if (formData.has('images')) {
    isLoading.value[areaId] = true;

    try {
      // Use the batch upload composable to upload the files
      await uploadFiles(formData, (progressEvent) => {
        // Track upload progress for the current common area
        const total = progressEvent.total ?? 1;
        uploadProgress.value[areaId] = Math.round((progressEvent.loaded / total) * 100);
      });

      // Extract secure URLs from the response and add them to the area images
      const areaIndex = commonAreas.value.findIndex((area: any) => area.id === areaId);
      if (areaIndex !== -1) {
        const uploadedImages = uploadResponse.value.map((response: { url: string }) => response.url);
        const updatedImages = [...commonAreas.value[areaIndex].images, ...uploadedImages];

        // Replace the images array with the updated one (ensures reactivity)
        commonAreas.value[areaIndex].images = updatedImages;
      }
    } catch (error) {
      console.error("Failed to upload images", error);
    } finally {
      isLoading.value[areaId] = false;
      uploadProgress.value[areaId] = 0; // Reset progress after completion
    }
  }
};

// Handle image deletion
const deleteAllImages = (areaId: string) => {
  const areaIndex = commonAreas.value.findIndex((area: any) => area.id === areaId);
  if (areaIndex !== -1) {
    commonAreas.value[areaIndex].images = [];
  }
};

// Carousel next image
const nextImage = (areaId: string) => {
  const area = commonAreas.value.find((area: any) => area.id === areaId);
  if (area && area.images.length) {
    currentImage.value[areaId] = (currentImage.value[areaId] + 1) % area.images.length;
  }
};

// Carousel previous image
const prevImage = (areaId: string) => {
  const area = commonAreas.value.find((area: any) => area.id === areaId);
  if (area && area.images.length) {
    currentImage.value[areaId] =
      (currentImage.value[areaId] - 1 + area.images.length) % area.images.length;
  }
};

// Load common areas from localStorage on mount
loadFromLocalStorage();
</script>


<style scoped>
.loader {
  @apply animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500;
}
</style>


  
