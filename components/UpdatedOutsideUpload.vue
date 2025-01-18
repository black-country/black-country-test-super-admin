<template>
  <div class="">
    <div class="flex flex-col flex-start items-start">
      <p class="text-gray-800 mb-1">
        Please upload images of the building's exterior and the surrounding street. This will help potential tenants understand the environment.
      </p>
      <p class="text-gray-500 text-sm mb-6">
        Accepts jpg & png | 2MB size max/each
      </p>
    </div>
    <!-- {{ payload }} -->
<!-- {{ props.payload }} -->
<!-- {{props.payload.value.images}} -->
    <div 
      v-if="!images.length && !isLoading" 
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
    <div v-if="images.length || isLoading" class="relative mt-6 border-2 -mt-2  border-gray-300 rounded-lg overflow-hidden">
      <div class="relative h-[300px] w-full">
        <img v-if="!isLoading && images.length" :src="images[currentImage]" alt="Uploaded Image" class="object-cover w-full h-[500px]">
        <div v-if="isLoading" class="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <span class="loader"></span> 
        </div>
        <button 
          v-if="images.length" 
          @click="deleteImage(currentImage)" 
          class="absolute top-2 right-2 text-white  bg-opacity-50"
        >
        <svg width="34" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="14" fill="black" fill-opacity="0.5"/>
          <path d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
        </button>
        <button 
          v-if="images.length > 1 && !isLoading" 
          @click="prevImage" 
          class="absolute left-3 top-1/2 transform -translate-y-1/2  bg-opacity-50 "
        >
        <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
          <path d="M11.5 7C11.5 7 8.50001 9.20945 8.5 10C8.5 10.7906 11.5 13 11.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
        </button>
        <button 
          v-if="images.length > 1 && !isLoading" 
          @click="nextImage" 
          class="absolute  right-3 top-1/2 transform -translate-y-1/2 bg-opacity-50 t"
        >
        <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
          <path d="M8.50002 7C8.50002 7 11.5 9.20945 11.5 10C11.5 10.7906 8.5 13 8.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
        </button>
      </div>
      <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white flex justify-between items-center px-4 py-2">
        <span class="" v-if="images.length">{{ images.length }} {{ images.length > 1 ? 'images' : 'image' }}</span>
        <label class="cursor-pointer bg-black inline-flex items-center px-3 py-2.5 rounded-lg space-x-2">
          <input type="file" class="hidden" accept="image/*" multiple @change="handleFileUpload($event)">
          <span class="text-white text-sm">+ Add photo</span>
        </label>
      </div>
    </div>
  </div>
</template>

<!-- <script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // batch upload composable
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
import { debounce } from 'lodash-es'; // Use lodash debounce for optimization

// Using batchUpload composable
const { uploadFiles, uploadResponse, loading } = useBatchUploadFile();

// Props to receive payload from parent
const props = defineProps({
  payload: {
    type: Object,
    required: true
  }
});

// State variables
const images = ref<string[]>(props.payload.images.value ?? []); // Load initial images from payload
const currentImage = ref(0);
const isLoading = ref(false);

// File size limit (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// **Optimized LocalStorage Loading and Saving**
// Load images from localStorage when the component is mounted
const loadFromLocalStorage = () => {
  const storedImages = localStorage.getItem('property_images');
  if (storedImages) {
    try {
      images.value = JSON.parse(storedImages);
    } catch (error) {
      console.warn('Failed to parse images from localStorage', error);
    }
  }
};

// **Debounce localStorage writes** to avoid frequent writes
const persistToLocalStorage = debounce(() => {
  // Offload the work to the browser's idle time
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      localStorage.setItem('property_images', JSON.stringify(images.value));
    });
  } else {
    setTimeout(() => {                                 
      localStorage.setItem('property_images', JSON.stringify(images.value));
    }, 500);
  }
}, 500);

// **Watchers**
// Watch for changes to the images array and sync with localStorage
watch(images, persistToLocalStorage, { deep: true });

// Sync with parent payload
watch(
  () => props.payload.images.value,
  (newVal) => {
    if (newVal && newVal.length !== images.value.length) {
      images.value = [...newVal]; // Sync payload changes to local images
    }
  },
  { deep: true }
);

// **File Upload Handling**
// Optimized file handling for multiple uploads
const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const formData = new FormData();

  // Validate file size before appending
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_FILE_SIZE) {
      showToast({
            title: "Error",
            message: `File ${file.name} exceeds 2MB limit. Please choose a smaller file.`,
            toastType: "error",
            duration: 3000
          });
      continue; // Skip files that exceed the size limit
    }
    formData.append('images', file); // Add each image to FormData
  }

  // Proceed only if there are valid files
  if (formData.has('images')) {
    isLoading.value = true;
    try {
      // Use batchUpload composable to upload files
      await uploadFiles(formData);

      // Add the uploaded images' secure URLs to the `images` array
      uploadResponse.value.forEach((response: { url: string }) => {
        images.value.unshift(response.url);
        props.payload.images.value.unshift(response.url)
      });
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      isLoading.value = false;
    }
  }
};

// Handle drag-and-drop upload functionality
const handleDrop = async (event: DragEvent) => {
  event.preventDefault(); // Prevent default browser handling

  const files = event.dataTransfer?.files;
  if (!files) return;

  const formData = new FormData();

  // Validate file size before appending
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_FILE_SIZE) {
      showToast({
            title: "Error",
            message: `File ${file.name} exceeds 2MB limit. Please choose a smaller file.`,
            toastType: "error",
            duration: 3000
          });
      continue; // Skip files that exceed the size limit
    }
    formData.append('images', file);
  }

  // Proceed only if there are valid files
  if (formData.has('images')) {
    isLoading.value = true;
    try {
      await uploadFiles(formData);

      // Add uploaded images to the local state
      uploadResponse.value.forEach((response: { url: string }) => {
        images.value.unshift(response.url);
        props.payload.images.value.unshift(response.url)
      });
    } catch (error) {
      console.error("Drag-and-drop upload failed", error);
    } finally {
      isLoading.value = false;
    }
  }
};

// Delete the current image from the array
const deleteImage = (index: number) => {
  images.value.splice(index, 1); // Remove image from array
  if (currentImage.value >= images.value.length) {
    currentImage.value = images.value.length - 1; // Adjust current index
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

// On component mount, load images from localStorage
onMounted(() => {
  loadFromLocalStorage();
});
</script>   -->
   
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // batch upload composable
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
import { debounce } from 'lodash-es'; // Use lodash debounce for optimization

// Using batchUpload composable
const { uploadFiles, uploadResponse, loading } = useBatchUploadFile();

// Props to receive payload from parent
const props = defineProps({
  payload: {
    type: Object,
    required: true
  }
});

// State variables
const images = ref<string[]>(props.payload.images.value ?? []); // Load initial images from payload
const currentImage = ref(0);
const isLoading = ref(false);

// File size limit (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// **Optimized LocalStorage Loading and Saving**
// Load images from localStorage when the component is mounted
const loadFromLocalStorage = () => {
  const storedImages = localStorage.getItem('property_images');
  if (storedImages) {
    try {
      images.value = JSON.parse(storedImages);
    } catch (error) {
      console.warn('Failed to parse images from localStorage', error);
    }
  }
};

// **Debounce localStorage writes** to avoid frequent writes
const persistToLocalStorage = debounce(() => {
  // Offload the work to the browser's idle time
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      localStorage.setItem('property_images', JSON.stringify(images.value));
    });
  } else {
    setTimeout(() => {                                 
      localStorage.setItem('property_images', JSON.stringify(images.value));
    }, 500);
  }
}, 500);

// **Watchers**
// Watch for changes to the images array and sync with localStorage
watch(images, persistToLocalStorage, { deep: true });

// Sync with parent payload
watch(
  () => props.payload.images.value,
  (newVal) => {
    if (newVal && newVal.length !== images.value.length) {
      images.value = [...newVal]; // Sync payload changes to local images
    }
  },
  { deep: true }
);

// **File Upload Handling**
// Optimized file handling for multiple uploads
const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const formData = new FormData();

  // Validate file size before appending
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_FILE_SIZE) {
      showToast({
            title: "Error",
            message: `File ${file.name} exceeds 2MB limit. Please choose a smaller file.`,
            toastType: "error",
            duration: 3000
          });
      continue; // Skip files that exceed the size limit
    }
    formData.append('images', file); // Add each image to FormData
  }

  // Proceed only if there are valid files
  if (formData.has('images')) {
    isLoading.value = true;
    try {
      // Use batchUpload composable to upload files
      await uploadFiles(formData);

      // Add the uploaded images' secure URLs to the `images` array
      uploadResponse.value.forEach((response: { url: string }) => {
        images.value.unshift(response.url);
        props.payload.images.value.unshift(response.url)
      });
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      isLoading.value = false;
    }
  }
};

// Handle drag-and-drop upload functionality
const handleDrop = async (event: DragEvent) => {
  event.preventDefault(); // Prevent default browser handling

  const files = event.dataTransfer?.files;
  if (!files) return;

  const formData = new FormData();

  // Validate file size before appending
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_FILE_SIZE) {
      showToast({
            title: "Error",
            message: `File ${file.name} exceeds 2MB limit. Please choose a smaller file.`,
            toastType: "error",
            duration: 3000
          });
      continue; // Skip files that exceed the size limit
    }
    formData.append('images', file);
  }

  // Proceed only if there are valid files
  if (formData.has('images')) {
    isLoading.value = true;
    try {
      await uploadFiles(formData);

      // Add uploaded images to the local state
      uploadResponse.value.forEach((response: { url: string }) => {
        images.value.unshift(response.url);
        props.payload.images.value.unshift(response.url)
      });
    } catch (error) {
      console.error("Drag-and-drop upload failed", error);
    } finally {
      isLoading.value = false;
    }
  }
};

// // Delete the current image from the array and localStorage
// const deleteImage = (index: number) => {
//   images.value.splice(index, 1); // Remove image from array
//   if (currentImage.value >= images.value.length) {
//     currentImage.value = images.value.length - 1; // Adjust current index
//   }

//   // If all images are deleted, clear localStorage as well
//   if (images.value.length === 0) {
//     localStorage.removeItem('property_images'); // Clear localStorage if no images left
//   } else {
//     // Update localStorage after deleting an image
//     localStorage.setItem('property_images', JSON.stringify(images.value)); // Sync with localStorage
//   }
// };

// Helper function to update localStorage after images are modified
const updateLocalStorage = () => {
  // If there are no images left, remove the item from localStorage
  if (images.value.length === 0) {
    localStorage.removeItem('property_images');
  } else {
    // Otherwise, update localStorage with the current images array
    localStorage.setItem('property_images', JSON.stringify(images.value));
  }
};


// Delete the current image from the array and localStorage
const deleteImage = (index: number) => {
  // Remove image from the local images array
  images.value.splice(index, 1);

  // Also remove the image from the payload images array
  props.payload.images.value.splice(index, 1);

  // Adjust the current index if needed
  if (currentImage.value >= images.value.length) {
    currentImage.value = images.value.length - 1; // Adjust current index if it goes out of bounds
  }

  // Sync with localStorage
  updateLocalStorage();
};



// Navigate to the next image
const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % images.value.length;
};

// Navigate to the previous image
const prevImage = () => {
  currentImage.value = (currentImage.value - 1 + images.value.length) % images.value.length;
};

// On component mount, load images from localStorage
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
  