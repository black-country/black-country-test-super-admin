<template>
  <div class="p-6">
    <!-- Tabbed navigation for rooms -->
    <div class="flex space-x-2 mb-6">
      <button
        v-for="(room, index) in rooms"
        :key="index"
        @click="setActiveRoom(index)"
        :class="['px-4 py-2 rounded', { 'bg-gray-200': activeRoom === index, 'bg-white': activeRoom !== index }]"
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
      <div v-for="feature in rooms[activeRoom].features" :key="feature.name" class="border rounded-lg p-4 relative">
        <div class="flex justify-center items-center h-32 bg-gray-100 rounded">
          <!-- Image preview carousel -->
          <div v-if="feature.images.length">
            <img :src="feature.images[currentImage[feature.name]]" alt="Feature Image" class="w-24 h-24 object-cover">
            <!-- Next and previous buttons -->
            <div v-if="feature.images.length > 1">
              <button @click="prevImage(feature.name)" class="absolute left-0 px-2 py-1 text-gray-600">
                Prev
              </button>
              <button @click="nextImage(feature.name)" class="absolute right-0 px-2 py-1 text-gray-600">
                Next
              </button>
            </div>
          </div>
          <!-- Placeholder icon for no image -->
          <div v-else>
            <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-24 h-24">
          </div>
        </div>
        <!-- Feature Label -->
        <div class="text-center mt-2 text-gray-700">{{ feature.name }} | {{ feature.images.length }} image</div>
        <!-- Add photo button -->
        <div class="mt-4">
          <label class="cursor-pointer inline-flex items-center space-x-2">
            <input type="file" class="hidden" accept="image/*" multiple @change="handleFileUpload($event, feature.name)">
            <span class="text-blue-500 underline">+ Add photo</span>
          </label>
        </div>
        <!-- Delete all images button -->
        <button @click="deleteAllImages(feature.name)" class="absolute top-2 right-2 text-red-500 text-sm">Delete</button>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading" class="flex justify-center items-center mt-4">
      <span class="loader"></span> <!-- Add a simple CSS spinner here -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { debounce } from 'lodash-es';
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // batch upload composable

const { uploadFiles, uploadResponse } = useBatchUploadFile();

// Initialize room data and set up reactive states
const rooms = ref([]);  // Loaded from localStorage on mount
const activeRoom = ref(0);  // Tracks the currently active room tab
const currentImage = ref<Record<string, number>>({});  // Tracks the current image index for each feature
const isLoading = ref(false);  // Global loading state for uploads

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
    isLoading.value = true;

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
      isLoading.value = false;
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
