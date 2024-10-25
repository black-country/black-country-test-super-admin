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
          {{ room.label }}
        </button>
      </div>
  
      <div class="text-lg font-semibold mb-4">
        Click to add as many pictures as you want for each room feature.
      </div>
      <p class="text-sm text-gray-500">Accepts jpg & png | 2MB size max/each</p>
  
      <!-- Loop through features in the active room -->
      <div class="grid grid-cols-2 gap-4 mt-6">
        <div v-for="feature in rooms[activeRoom].features" :key="feature.key" class="border rounded-lg p-4 relative">
          <div class="flex justify-center items-center h-32 bg-gray-100 rounded">
            <!-- Image preview carousel -->
            <div v-if="feature.images.length">
              <img :src="feature.images[currentImage[feature.key]]" alt="Feature Image" class="w-24 h-24 object-cover">
              <!-- Next and previous buttons -->
              <div v-if="feature.images.length > 1">
                <button @click="prevImage(feature.key)" class="absolute left-0 px-2 py-1 text-gray-600">
                  Prev
                </button>
                <button @click="nextImage(feature.key)" class="absolute right-0 px-2 py-1 text-gray-600">
                  Next
                </button>
              </div>
            </div>
            <!-- Placeholder icon for no image -->
            <div v-else>
              <img src="path_to_placeholder_image.png" alt="Placeholder" class="w-24 h-24">
            </div>
          </div>
          <!-- Feature Label -->
          <div class="text-center mt-2 text-gray-700">{{ feature.label }} | {{ feature.images.length }} image</div>
          <!-- Add photo button -->
          <div class="mt-4">
            <label class="cursor-pointer inline-flex items-center space-x-2">
              <input type="file" class="hidden" accept="image/*" @change="handleFileUpload($event, feature.key)">
              <span class="text-blue-500 underline">+ Add photo</span>
            </label>
          </div>
          <!-- Delete all images button -->
          <button @click="deleteAllImages(feature.key)" class="absolute top-2 right-2 text-red-500 text-sm">Delete</button>
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

// Rooms and features with image arrays
const rooms = ref([
  {
    label: 'Room 1',
    features: [
      { key: 'bedroom1', label: 'Bedroom', images: [] },
      { key: 'bathroom1', label: 'Bathroom', images: [] }
    ]
  },
  {
    label: 'Room 2',
    features: [
      { key: 'bedroom2', label: 'Bedroom', images: [] },
      { key: 'bathroom2', label: 'Bathroom', images: [] }
    ]
  },
  // Add more rooms and features as needed
]);

const activeRoom = ref(0);  // Keeps track of the currently active room
const currentImage = ref<Record<string, number>>({
  bedroom1: 0,
  bathroom1: 0,
  bedroom2: 0,
  bathroom2: 0
});  // Tracks the current image for each feature
const isLoading = ref(false);  // Loading state for uploads

// Load room data from localStorage on mount
const loadFromLocalStorage = () => {
  const storedRooms = localStorage.getItem('room_images');
  if (storedRooms) {
    rooms.value = JSON.parse(storedRooms);
  }
};

// Fallback for requestIdleCallback (in case it's not supported)
const requestIdleCallbackFallback = (cb: Function) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(cb, 1);  // Minimal delay fallback
  }
};

// Debounced localStorage persistence for room data
const persistToLocalStorage = debounce(() => {
  requestIdleCallbackFallback(() => {
    localStorage.setItem('room_images', JSON.stringify(rooms.value));
  });
}, 500);

// Watch for changes in room data and persist to localStorage
watch(rooms, persistToLocalStorage, { deep: true });

// Handle file upload for room features
const handleFileUpload = async (event: Event, featureKey: string) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert('File size exceeds 2MB. Please upload a smaller file.');
    return;
  }

  isLoading.value = true;

  try {
    const imageUrl = await readFileAsDataURL(file);
    const feature = findFeature(featureKey);
    if (feature) {
      feature.images.push(imageUrl);
    }
  } catch (error) {
    console.error('File upload failed:', error);
  } finally {
    isLoading.value = false;
  }
};

// Read file as DataURL asynchronously
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
};

// Delete all images in a feature
const deleteAllImages = (featureKey: string) => {
  const feature = findFeature(featureKey);
  if (feature) {
    feature.images = [];
  }
};

// Navigate to the next image in the carousel
const nextImage = (featureKey: string) => {
  const feature = findFeature(featureKey);
  if (feature && feature.images.length) {
    currentImage.value[featureKey] = (currentImage.value[featureKey] + 1) % feature.images.length;
  }
};

// Navigate to the previous image in the carousel
const prevImage = (featureKey: string) => {
  const feature = findFeature(featureKey);
  if (feature && feature.images.length) {
    currentImage.value[featureKey] = (currentImage.value[featureKey] - 1 + feature.images.length) % feature.images.length;
  }
};

// Find feature by key
const findFeature = (featureKey: string) => {
  for (const room of rooms.value) {
    const feature = room.features.find(f => f.key === featureKey);
    if (feature) return feature;
  }
  return null;
};

// Set the active room based on the tab selected
const setActiveRoom = (index: number) => {
  activeRoom.value = index;
};

// Load room data from localStorage on component mount
onMounted(() => {
  loadFromLocalStorage();
});
</script>
