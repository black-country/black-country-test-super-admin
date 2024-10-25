<template>
  <div class="p-6">
    <div class="text-lg font-semibold mb-4">
      Click to add as many pictures as you want to for each common area or space.
    </div>
    <p class="text-sm text-gray-500">Accepts jpg & png | 2MB size max/each</p>

    <!-- Check if there are common areas -->
    <div v-if="commonAreas.length" class="grid grid-cols-2 gap-4 mt-6">
      <div v-for="area in commonAreas" :key="area.id" class="border rounded-lg p-4 relative">
        <div class="flex justify-center items-center h-32 bg-gray-100 rounded">
          <!-- Image preview carousel -->
          <div v-if="area.images && area.images.length">
            <img :src="area.images[currentImage[area.id]]" alt="Common Area Image" class="w-24 h-24 object-cover">
            <!-- Next and previous buttons -->
            <div v-if="area.images.length > 1">
              <button @click="prevImage(area.id)" class="absolute left-0 px-2 py-1 text-gray-600">
                Prev
              </button>
              <button @click="nextImage(area.id)" class="absolute right-0 px-2 py-1 text-gray-600">
                Next
              </button>
            </div>
          </div>
          <!-- Placeholder icon for no image -->
          <div v-else>
            <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-24 h-24">
          </div>
        </div>
        <!-- Common Area Label -->
        <div class="text-center mt-2 text-gray-700">{{ area.name }} | {{ area.images ? area.images.length : 0 }} image</div>
        <!-- Add photo button -->
        <div class="mt-4">
          <label class="cursor-pointer inline-flex items-center space-x-2">
            <input type="file" class="hidden" accept="image/*" multiple @change="handleFileUpload($event, area.id)">
            <span class="text-blue-500 underline">+ Add photo</span>
          </label>
        </div>
        <!-- Delete all images button -->
        <button @click="deleteAllImages(area.id)" class="absolute top-2 right-2 text-red-500 text-sm">Delete</button>
        <!-- Loading spinner -->
        <div v-if="isLoading[area.id]" class="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50">
          <span class="loader"></span> <!-- Add a spinner component or a simple CSS spinner -->
        </div>
      </div>
    </div>

    <!-- Show message if no common areas are available -->
    <div v-else class="text-center mt-6">
      No common areas found. Please ensure 'property_commonAreas' is stored in localStorage.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // batch upload composable

const { uploadFiles, uploadResponse } = useBatchUploadFile();

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
        const uploadedImages = uploadResponse.value.map((response: { secure_url: string }) => response.secure_url);
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


  
<!-- <script setup lang="ts">
import { ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // batch upload composable

const { uploadFiles, uploadResponse } = useBatchUploadFile();

// Dynamically loaded common areas from localStorage
const commonAreas = ref([]);

// Track current image being displayed for each area (for carousel functionality)
const currentImage = ref<Record<string, number>>({});

// Loading state for uploads
const isLoading = ref<Record<string, boolean>>({});

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
      await uploadFiles(formData);

      // Extract secure URLs from the response and add them to the area images
      const area = commonAreas.value.find((area: any) => area.id === areaId);
      if (area) {
        uploadResponse.value.forEach((response: { secure_url: string }) => {
          area.images.push(response.secure_url);
        });
      }
    } catch (error) {
      console.error("Failed to upload images", error);
    } finally {
      isLoading.value[areaId] = false;
    }
  }
};

// Handle image deletion
const deleteAllImages = (areaId: string) => {
  const area = commonAreas.value.find((area: any) => area.id === areaId);
  if (area) {
    area.images = [];
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
