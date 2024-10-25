<template>
    <div class="">
      <div class="text-lg mb-4">
        Please upload images of the building's exterior and the surrounding street. This will help potential tenants understand the environment.
      </div>
      <p class="text-sm text-gray-500">Accepts jpg & png | 2MB size max/each</p>
  
      <!-- Drag-and-drop area and upload button -->
      <div 
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer"
        @drop.prevent="handleDrop($event)"
        @dragover.prevent
      >
        <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-16 h-16 mb-4">
        <p class="text-gray-600">Drag and drop photos here</p>
        <p class="text-gray-600 my-2">or</p>
        <label class="bg-black text-white text-sm py-2.5 px-4 rounded cursor-pointer">
          <input type="file" class="hidden" accept="image/*" multiple @change="handleFileUpload($event)">
          Upload from computer
        </label>
      </div>
  
      <!-- Uploaded images carousel -->
      <div v-if="images.length" class="mt-6">
        <div class="relative">
          <img :src="images[currentImage]" alt="Uploaded Image" class="w-full h-64 object-cover rounded-lg">
          
          <!-- Next and Previous buttons -->
          <button 
            v-if="images.length > 1" 
            @click="prevImage" 
            class="absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-2 py-1"
          >
            Prev
          </button>
          <button 
            v-if="images.length > 1" 
            @click="nextImage" 
            class="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-2 py-1"
          >
            Next
          </button>
        </div>
  
        <!-- Delete image button -->
        <div class="text-center mt-4">
          <button @click="deleteImage(currentImage)" class="text-red-500 underline">Delete Image</button>
        </div>
      </div>
  
      <!-- Loading spinner inside the card -->
      <div v-if="isLoading" class="mt-6 flex justify-center">
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full h-64 flex justify-center items-center relative">
          <span class="loader"></span> <!-- Spinner is displayed here -->
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref, onMounted, watch } from 'vue';
  import { useBatchUploadFile } from '@/composables/core/batchUpload'; // batch upload composable
  import { debounce } from 'lodash-es'; // Use lodash debounce for optimization
  
  const { uploadFiles, uploadResponse, loading } = useBatchUploadFile(); // Using batchUpload composable
  
  // State variables
  const images = ref<string[]>([]);
  const currentImage = ref(0);
  const isLoading = ref(false);
  
  // File size limit (2MB)
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  
  // Load images from localStorage when the component is mounted
  const loadFromLocalStorage = () => {
    const storedImages = localStorage.getItem('property_images');
    if (storedImages) {
      images.value = JSON.parse(storedImages);
    }
  };
  
  // Debounce localStorage writes to optimize performance
  const persistToLocalStorage = debounce(() => {
    // Use requestIdleCallback to avoid blocking main thread during interactions
    window.requestIdleCallback(() => {
      localStorage.setItem('property_images', JSON.stringify(images.value));
    });
  }, 500);
  
  // Watch for changes to images and persist them to localStorage
  watch(images, persistToLocalStorage, { deep: true });
  
  // Handle file upload for multiple images asynchronously
  const handleFileUpload = async (event: Event) => {
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
      isLoading.value = true;
      try {
        // Use the batch upload composable to upload the files
        await uploadFiles(formData);
  
        // Extract secure URLs from the response and add them to the images array
        uploadResponse.value.forEach((response: { secure_url: string }) => {
          images.value.push(response.secure_url);
        });
      } catch (error) {
        console.error("Failed to upload images", error);
      } finally {
        isLoading.value = false;
      }
    }
  };
  
  // Handle drag and drop uploads asynchronously
  const handleDrop = async (event: DragEvent) => {
    const files = event.dataTransfer?.files;
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
      isLoading.value = true;
      try {
        // Use the batch upload composable to upload the files
        await uploadFiles(formData);
  
        // Extract secure URLs from the response and add them to the images array
        uploadResponse.value.forEach((response: { secure_url: string }) => {
          images.value.push(response.secure_url);
        });
      } catch (error) {
        console.error("Failed to upload images", error);
      } finally {
        isLoading.value = false;
      }
    }
  };
  
  // Delete the current image
  const deleteImage = (index: number) => {
    images.value.splice(index, 1);
    if (currentImage.value >= images.value.length) {
      currentImage.value = images.value.length - 1;
    }
  };
  
  // Navigate to the next image
  const nextImage = () => {
    currentImage.value = (currentImage.value + 1) % images.value.length;
  };
  
  // Navigate to the previous image
  const prevImage = () => {
    currentImage.value = (currentImage.value - 1 + images.value.length) % images.value.length;
  };
  
  // Load the images on component mount
  onMounted(() => {
    loadFromLocalStorage();
  });
  </script>
  

  <style scoped>
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #000;
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
  