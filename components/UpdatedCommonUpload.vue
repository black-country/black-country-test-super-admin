<template>
    <div class="p-6">
      <div class="text-lg font-semibold mb-4">
        Click to add as many pictures as you want to for each common area or space.
      </div>
      <p class="text-sm text-gray-500">Accepts jpg & png | 2MB size max/each</p>
  
      <!-- Loop through each common area -->
      <div class="grid grid-cols-2 gap-4 mt-6">
        <div v-for="area in commonAreas" :key="area.key" class="border rounded-lg p-4 relative">
          <div class="flex justify-center items-center h-32 bg-gray-100 rounded">
            <!-- Image preview carousel -->
            <div v-if="area.images.length">
              <img :src="area.images[currentImage[area.key]]" alt="Common Area Image" class="w-24 h-24 object-cover">
              <!-- Next and previous buttons -->
              <div v-if="area.images.length > 1">
                <button @click="prevImage(area.key)" class="absolute left-0 px-2 py-1 text-gray-600">
                  Prev
                </button>
                <button @click="nextImage(area.key)" class="absolute right-0 px-2 py-1 text-gray-600">
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
          <div class="text-center mt-2 text-gray-700">{{ area.label }} | {{ area.images.length }} image</div>
          <!-- Add photo button -->
          <div class="mt-4">
            <label class="cursor-pointer inline-flex items-center space-x-2">
              <input type="file" class="hidden" accept="image/*" @change="handleFileUpload($event, area.key)">
              <span class="text-blue-500 underline">+ Add photo</span>
            </label>
          </div>
          <!-- Delete all images button -->
          <button @click="deleteAllImages(area.key)" class="absolute top-2 right-2 text-red-500 text-sm">Delete</button>
          <!-- Loading spinner -->
          <div v-if="isLoading[area.key]" class="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50">
            <span class="loader"></span> <!-- Add a spinner component or a simple CSS spinner -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { debounce } from 'lodash-es';
  
  // Define common areas with labels and keys
  const commonAreas = ref([
    { key: 'living_room', label: 'Living room', images: [] },
    { key: 'dining_room', label: 'Dining room', images: [] },
    { key: 'laundry_area', label: 'Laundry area', images: [] },
    { key: 'kitchen', label: 'Kitchen', images: [] }
  ]);
  
  // Track current image being displayed for each area (for carousel functionality)
  const currentImage = ref<Record<string, number>>({
    living_room: 0,
    dining_room: 0,
    laundry_area: 0,
    kitchen: 0
  });
  
  // Loading state for uploads
  const isLoading = ref<Record<string, boolean>>({
    living_room: false,
    dining_room: false,
    laundry_area: false,
    kitchen: false
  });
  
  // File size limit (2MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  
  // Load common areas from localStorage
  const loadFromLocalStorage = () => {
    const storedAreas = localStorage.getItem('common_areas');
    if (storedAreas) {
      commonAreas.value = JSON.parse(storedAreas);
    }
  };
  
  // Persist common areas to localStorage with debouncing
  const persistToLocalStorage = debounce(() => {
    localStorage.setItem('common_areas', JSON.stringify(commonAreas.value));
  }, 500);
  
  // Watch for changes to commonAreas and persist to localStorage
  watch(commonAreas, persistToLocalStorage, { deep: true });
  
  // Handle file upload with async/await and size validation
  const handleFileUpload = async (event: Event, areaKey: string) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
  
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 2MB limit. Please choose a smaller file.");
      return;
    }
  
    isLoading.value[areaKey] = true;
  
    try {
      const imageUrl = await readFileAsDataURL(file);
      const area = commonAreas.value.find(area => area.key === areaKey);
      if (area) {
        area.images.push(imageUrl);
      }
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      isLoading.value[areaKey] = false;
    }
  };
  
  // Read file as DataURL asynchronously
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsDataURL(file);
    });
  };
  
  // Handle image deletion
  const deleteAllImages = (areaKey: string) => {
    const area = commonAreas.value.find(area => area.key === areaKey);
    if (area) {
      area.images = [];
    }
  };
  
  // Carousel next image
  const nextImage = (areaKey: string) => {
    const area = commonAreas.value.find(area => area.key === areaKey);
    if (area && area.images.length) {
      currentImage.value[areaKey] = (currentImage.value[areaKey] + 1) % area.images.length;
    }
  };
  
  // Carousel previous image
  const prevImage = (areaKey: string) => {
    const area = commonAreas.value.find(area => area.key === areaKey);
    if (area && area.images.length) {
      currentImage.value[areaKey] =
        (currentImage.value[areaKey] - 1 + area.images.length) % area.images.length;
    }
  };
  
  // Load common areas from localStorage on mount
  loadFromLocalStorage();
  </script>
  