<template>
  <div class="p-6">
    <!-- Tabbed navigation for rooms -->
    <div class="flex space-x-4 mb-6">
      <button
        v-for="(room, index) in rooms"
        :key="index"
        @click="setActiveRoom(index)"
        :class="[
          'px-6 py-2 rounded-full border', 
          { 'bg-gray-100 text-gray-700': activeRoom === index, 'bg-white text-gray-600 border-gray-300': activeRoom !== index }
        ]"
      >
        {{ room.name }}
      </button>
    </div>

    <div class="text-lg font-semibold mb-4">
      Click to add as many pictures as you want for each room feature.
    </div>
    <p class="text-sm text-gray-500">Accepts jpg & png | 2MB size max/each</p>

    <!-- Render features only if activeRoom exists -->
    <div v-if="rooms[activeRoom]" class="grid grid-cols-2 gap-4 mt-6">
      <div
        v-for="feature in rooms[activeRoom].features"
        :key="feature.name"
        class="relative rounded-lg overflow-hidden border border-gray-300 shadow-lg"
      >
        <!-- Image preview or loading spinner -->
        <div class="relative h-56 w-full">
          <!-- Show loading spinner if images are uploading -->
          <div v-if="loading[feature.name]" class="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50">
            <span class="loader"></span>
          </div>

          <!-- Show uploaded images -->
          <img
            v-if="feature.images.length && !loading[feature.name]"
            :src="feature.images[currentImage[feature.name]]"
            alt="Feature Image"
            class="object-cover w-full h-full"
          />

          <!-- Show a placeholder when no image -->
          <div v-else-if="!loading[feature.name]" class="flex items-center justify-center h-full w-full bg-gray-100">
            <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-16 h-16" />
          </div>

          <!-- Delete icon (top-right corner) -->
          <button
            @click="deleteAllImages(feature.name)"
            class="absolute top-2 right-2 text-white bg-black bg-opacity-50 p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Previous and Next buttons -->
          <button
            v-if="feature.images.length > 1 && !loading[feature.name]"
            @click="prevImage(feature.name)"
            class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded"
          >
            Prev
          </button>
          <button
            v-if="feature.images.length > 1 && !loading[feature.name]"
            @click="nextImage(feature.name)"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded"
          >
            Next
          </button>

          <!-- Feature Label and Image Count (bottom-left corner) -->
          <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white flex justify-between items-center px-4 py-2">
            <span>{{ feature.name }} | {{ feature.images.length }} {{ feature.images.length > 1 ? 'images' : 'image' }}</span>
            <label class="cursor-pointer inline-flex items-center space-x-2">
              <input type="file" class="hidden" accept="image/*" multiple @change="handleFileUpload($event, feature.name)" />
              <span class="text-blue-500 underline">+ Add photo</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { debounce } from 'lodash-es';
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // batch upload composable

const { uploadFiles, uploadResponse, loading } = useBatchUploadFile();

// Initialize room data and set up reactive states
const rooms = ref([]);  // Loaded from localStorage on mount
const activeRoom = ref(0);  // Tracks the currently active room tab
const currentImage = ref<Record<string, number>>({});  // Tracks the current image index for each features

// Load room data from localStorage on mount
const loadFromLocalStorage = () => {
  const storedRooms = localStorage.getItem('property_rooms');
  if (storedRooms) {
    rooms.value = JSON.parse(storedRooms);

    // Initialize currentImage for each feature in each room
    rooms.value.forEach((room: any) => {
      room.features.forEach((feature: any) => {
        currentImage.value[feature.name] = 0;
      });
    });
  }
};

// Debounced localStorage persistence for room data
const persistToLocalStorage = debounce(() => {
  // Use requestIdleCallback to schedule when browser is idle
  (window.requestIdleCallback || setTimeout)(() => {
    localStorage.setItem('property_rooms', JSON.stringify(rooms.value));
  });
}, 500);

// Watch for changes in room data and persist to localStorage
watch(rooms, persistToLocalStorage, { deep: true });

// Handle multiple file uploads for a feature
const handleFileUpload = async (event: Event, featureName: string) => {
  if (!rooms.value[activeRoom.value]) return;  // Ensure activeRoom exists

  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const formData = new FormData();

  // Validate each file and add to FormData if valid
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB. Please upload a smaller file.');
      continue;
    }
    formData.append('images', file);
  }

  // Proceed with upload if FormData has files
  if (formData.has('images')) {
    loading.value = true;

    try {
      await uploadFiles(formData);  // Batch upload files
      const room = rooms.value[activeRoom.value];
      const feature = room.features.find((f: any) => f.name === featureName);

      if (feature) {
        // Add uploaded image URLs to both feature and room
        const uploadedImages = uploadResponse.value.map((res: { secure_url: string }) => res.secure_url);
        feature.images.push(...uploadedImages);  // Update feature images
        room.images.push(...uploadedImages);  // Consolidate in room's images
      }
    } catch (error) {
      console.error('Failed to upload images:', error);
    } finally {
      loading.value = false;
    }
  }
};

// Delete all images in a feature
const deleteAllImages = (featureName: string) => {
  const room = rooms.value[activeRoom.value];
  if (!room) return;

  const feature = room.features.find((f: any) => f.name === featureName);
  if (feature) {
    feature.images = [];  // Clear feature images
    room.images = room.images.filter((img: string) => !feature.images.includes(img));  // Remove from room
  }
};

// Navigate to the next image in the carousel for a feature
const nextImage = (featureName: string) => {
  if (!rooms.value[activeRoom.value]) return;
  const feature = findFeature(featureName);
  if (feature && feature.images.length) {
    currentImage.value[featureName] = (currentImage.value[featureName] + 1) % feature.images.length;
  }
};

// Navigate to the previous image in the carousel for a feature
const prevImage = (featureName: string) => {
  if (!rooms.value[activeRoom.value]) return;
  const feature = findFeature(featureName);
  if (feature && feature.images.length) {
    currentImage.value[featureName] = (currentImage.value[featureName] - 1 + feature.images.length) % feature.images.length;
  }
};

// Find a feature by name in the current active room
const findFeature = (featureName: string) => {
  const room = rooms.value[activeRoom.value];
  return room.features.find((f: any) => f.name === featureName);
};

// Set the active room based on the selected tab
const setActiveRoom = (index: number) => {
  activeRoom.value = index;
};

// Load room data from localStorage when the component mounts
onMounted(() => {
  loadFromLocalStorage();
});
</script>

<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>