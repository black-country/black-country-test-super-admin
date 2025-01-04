<template>
    <div class="w-full h-full bg-[#EBE5E0] border rounded-lg p-4 flex flex-col items-center justify-center">
      <div v-if="images.length === 0" class="flex flex-col h-64 bg-[#EBE5E0] rounded-lg p-4 w-full relative">
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">

          <div class="loader"></div>
        </div>
        <div v-if="!loading" class="flex justify-center items-center flex-grow">
          <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-16 h-16" />
        </div>
        <div id="cardLabel" class="flex justify-between items-center mt-4 w-full">
          <div class="text-sm text-gray-600">{{ label }} | {{ images.length }} image</div>
          <button @click="triggerFileUpload" :disabled="loading" class="bg-[#7D7D7D] text-white py-1 px-3 rounded-md text-sm">
            + Add photo
          </button>
        </div>
      </div>
  
      <div v-else class="relative w-full">
        <div v-if="images.length > 1" class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <button @click="prevImage" class="bg-gray-300 p-1 rounded-full">&larr;</button>
        </div>
        <img :src="images[currentImageIndex]" alt="Uploaded Image" class="w-full h-44 object-cover rounded-md" />
        <div v-if="images.length > 1" class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
          <button @click="nextImage" class="bg-gray-300 p-1 rounded-full">&rarr;</button>
        </div>
        <div class="absolute top-2 right-2">
          <button @click="removeImage" class="p-1 rounded-full">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="14" fill="black" fill-opacity="0.5"/>
              <path d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
  
      <div v-if="images.length > 0" class="flex items-center justify-between w-full mt-2">
        <div class="text-sm text-gray-600">{{ label }} | {{ images.length }} {{ images.length === 1 ? 'image' : 'images' }}</div>
        <button @click="triggerFileUpload" :disabled="loading" class="bg-gray-200 text-gray-800 py-1 px-3 rounded-md">+ Add photo</button>
      </div>
  
      <input type="file" accept="image/png, image/jpeg" multiple ref="fileInput" @change="handleFileUpload" class="hidden" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useBatchUploadFile } from '@/composables/core/batchUpload';
  const { uploadFiles, uploadResponse, loading } = useBatchUploadFile();
  
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true // Make sure location is passed as 'rooms'
    },
    roomName: {
      type: String,
      required: true // Ensure roomName is passed
    },
    payload: {
      type: Object,
      default: () => ({})
    },
    existingImages: {
      type: Array,
      default: () => []
    }
  });
  
  const emit = defineEmits(['update:images']);
  
  const fileInput = ref<HTMLInputElement | null>(null);
  const images = reactive<string[]>([]);
  const currentImageIndex = ref(0);
  
  // Populate the images array with existing images on mount
  onMounted(() => {
    if (props.existingImages && props.existingImages.length > 0) {
      images.push(...props.existingImages); // Pre-fill images with existing ones
    }
  });
  
  // Emit the images array whenever it is updated
  watch(images, (newImages) => {
    emit('update:images', { images: newImages, roomName: props.roomName, featureName: props.label });
  });
  
  function triggerFileUpload() {
    if (fileInput.value) {
      fileInput.value.click();
    }
  }
  
  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      try {
        const files = Array.from(target.files); // Get all files
        await uploadFiles(files); // Use the batch upload composable
        
        if (uploadResponse.value.length > 0) {
          // Extract secure URLs from the response and add them to the images array
          const uploadedUrls = uploadResponse.value.map(response => response.url);
          images.push(...uploadedUrls); // Add the URLs to the images array to display in the UI
          
          // Ensure we update the specific room feature images in the payload
          const propertyData = props.payload;
          if (propertyData && propertyData.rooms.value) {
            const room = propertyData.rooms.value.find((r: any) => r.name === props.roomName);
            if (room) {
              const feature = room.features.find((f: any) => f.name === props.label);
              if (feature) {
                feature.images = [...(feature.images || []), ...uploadedUrls];
              }
            }
          }
        }
      } catch (error) {
        console.error('Error uploading files:', error);
      }
    } else {
      console.error('No files selected for upload');
    }
  }
  
  function prevImage() {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--;
    }
  }
  
  function nextImage() {
    if (currentImageIndex.value < images.length - 1) {
      currentImageIndex.value++;
    }
  }
  
  function removeImage() {
    images.splice(currentImageIndex.value, 1);
    if (currentImageIndex.value >= images.length) {
      currentImageIndex.value = images.length - 1;
    }
  }
  </script>
  
  <style scoped>
  /* Add styles for the loading spinner */
  .loader {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #333;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  