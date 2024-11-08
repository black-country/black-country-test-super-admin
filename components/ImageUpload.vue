<template>
  <div class="w-full h-full bg-[#EBE5E0] border rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
    <!-- Progress bar for image upload -->
    <div v-if="loading" class="w-full h-4 rounded-lg bg-gray-200 mb-6">
      <div :class="{'bg-red-500': uploadFailed, 'bg-green-500': uploadSuccess, 'bg-[#292929]': !uploadFailed && !uploadSuccess}"
        :style="{ width: `${progress}%` }"
        class="h-full transition-all duration-300 ease-in-out rounded-lg">
      </div>
    </div>

    <!-- Image Upload Placeholder or Image Display -->
    <div v-if="images.length === 0" class="relative flex flex-col h-64 bg-[#EBE5E0] rounded-lg p-3 w-full">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
        <div class="loader"></div>
      </div>
      <div v-if="!loading" class="flex justify-center items-center flex-grow">
        <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- Uploaded Image Display -->
    <div v-else class="relative w-full h-64">
      <!-- Image navigation -->
      <div v-if="images.length > 1" class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button @click="prevImage" class="bg-gray-300 p-1 rounded-full">&larr;</button>
      </div>
      <img :src="images[currentImageIndex]" alt="Uploaded Image" class="w-full h-full object-cover" />
      <div v-if="images.length > 1" class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button @click="nextImage" class="bg-gray-300 p-1 rounded-full">&rarr;</button>
      </div>

      <!-- Remove image button -->
      <div class="absolute top-2 right-2">
        <button @click="removeImage" class="p-1 rounded-full">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="14" fill="black" fill-opacity="0.5"/>
            <path d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Text Overlay and "Add Photo" Button -->
    <div class="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/50 to-transparent">
      <div class="text-white text-sm">{{ label }} | {{ images.length }} {{ images.length === 1 ? 'image' : 'images' }}</div>
      <div class="flex justify-end">
        <button @click="triggerFileUpload" :disabled="loading" class="bg-gray-700 text-white py-1 px-3 rounded-md text-sm">
          + Add photo
        </button>
      </div>
    </div>

    <!-- Hidden File Input -->
    <input type="file" accept="image/png, image/jpeg" multiple ref="fileInput" @change="handleFileUpload" class="hidden" />
  </div>
</template>

<script setup lang="ts">
// import { debounce } from 'lodash-es';
import debounce from 'lodash-es/debounce';
import { useBatchUploadFile } from '@/composables/core/batchUpload'
const { uploadFiles, uploadResponse, loading } = useBatchUploadFile()
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

const progress = ref(1);  // Initial progress set to 1%
  const uploadFailed = ref(false);
  const uploadSuccess = ref(false);

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  roomName: {
    type: String,
    required: false
  },
  payload: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['update:images'])

const fileInput = ref<HTMLInputElement | null>(null)
const images = reactive<string[]>([])
const currentImageIndex = ref(0)

// Emit the images array whenever it is updated
// watch(images, (newImages) => {
//   emit('update:images', newImages)
// })

watch(images, debounce((newImages) => {
  emit('update:images', newImages);
}, 300));  // 300ms debounce

// Populate images if the location is "common-areas" and the label matches
onMounted(() => {
  if (props.location === 'common-areas') {
    const propertyData = props.payload
    if (propertyData) {
      const commonArea = propertyData.commonAreas.value?.find((area: any) => area.name === props.label)
      if (commonArea && commonArea.images) {
        images.push(...commonArea.images) // Populate the images with existing images for the common area
      }
    }
  }
})

function triggerFileUpload() {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target && target.files && target.files.length > 0) {
    const files = Array.from(target.files);
    
    // Filter out files larger than 2MB
    const validFiles = files.filter(file => file.size <= 2 * 1024 * 1024);

    if (validFiles.length === 0) {
      showToast({
          title: "Error",
          message: "All selected files exceed the 2MB size limit",
          toastType: "error",
          duration: 3000
        });
      // useNuxtApp().$toast.error('All selected files exceed the 2MB size limit');
      return;
    }
    try {
      progress.value = 1;  // Reset progress
      uploadFailed.value = false;
      uploadSuccess.value = false;
      const files = Array.from(target.files) // Get all files

       // Simulate upload progress
       const interval = setInterval(() => {
        if (progress.value < 100) {
          progress.value += 10;
        }
      }, 300);
      await uploadFiles(files) // Use the batch upload composable

      clearInterval(interval);
      progress.value = 100;
      uploadSuccess.value = true;
      
      if (uploadResponse.value.length > 0) {
        // Extract secure URLs from the response and add them to the images array
        const uploadedUrls = uploadResponse.value.map(response => response.secure_url)
        images.push(...uploadedUrls) // Add the URLs to the images array to display in the UI
        
        // Update session storage for common areas if necessary
        updateSessionStorage();
        // if (props.location === 'common-areas') {
        //   const propertyData = props.payload
        //   if (propertyData) {
        //     // Ensure commonAreas exists and find the specific commonArea
        //     if (propertyData.commonAreas.value) {
        //       const commonArea = propertyData.commonAreas.value.find((area: any) => area.name === props.label)
              
        //       if (commonArea) {
        //         commonArea.images = [...(commonArea.images || []), ...uploadedUrls]
        //         // sessionStorage.setItem('property', JSON.stringify(property)) // Save back to session storage
        //       } else {
        //         console.warn('Common area not found')
        //       }
        //     } else {
        //       console.warn('No common areas in property')
        //     }
        //   } else {
        //     console.warn('No property data in sessionStorage')
        //   }
        // }

        // if (props.location === 'rooms') {
        //     const propertyData = props.payload
        //     if (propertyData) {              
        //       // Ensure rooms exist and find the specific room
        //       if (propertyData.rooms.value) {
        //         const room = propertyData.rooms.value.find((r: any) => r.name === props.roomName) // Find the room by name
        //         if (room) {
        //           // Find the specific feature within the room by matching the feature name
        //           const feature = room.features.find((f: any) => f.name === props.label) // Find the feature by name
                  
        //           if (feature) {
        //             // Add the uploaded images to the feature's images array
        //             feature.images = [...(feature.images || []), ...uploadedUrls]
                    
        //             // Update the session storage with the updated property data
        //             // sessionStorage.setItem('property', JSON.stringify(property))
        //           } else {
        //             console.warn('Feature not found in room')
        //           }
        //         } else {
        //           console.warn('Room not found')
        //         }
        //       } else {
        //         console.warn('No rooms in property')
        //       }
        //     } else {
        //       console.warn('No property data in sessionStorage')
        //     }
        //   }
      }
    } catch (error) {
      progress.value = 100;
      uploadFailed.value = true;
      useNuxtApp().$toast.error('Error uploading files', {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
      console.error('Error uploading files:', error)
    }
  } else {
    useNuxtApp().$toast.error('No files selected for upload', {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
    // console.error('No files selected for upload')
  }
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

function nextImage() {
  if (currentImageIndex.value < images.length - 1) {
    currentImageIndex.value++
  }
}

function removeImage() {
  if (images.length > 0 && currentImageIndex.value >= 0) {
    images.splice(currentImageIndex.value, 1); // Remove from the array
    
    // Adjust the index if the last image was removed
    if (currentImageIndex.value >= images.length) {
      currentImageIndex.value = images.length - 1;
    }
    
    // Also ensure that session storage or props are updated if necessary
    if (props.location === 'common-areas') {
      const propertyData = props.payload;
      const commonArea = propertyData?.commonAreas?.value?.find((area: any) => area.name === props.label);
      if (commonArea) {
        commonArea.images = images; // Update the common area images
      }
    } else if (props.location === 'rooms') {
      const propertyData = props.payload;
      const room = propertyData?.rooms?.value?.find((r: any) => r.name === props.roomName);
      const feature = room?.features?.find((f: any) => f.name === props.label);
      if (feature) {
        feature.images = images; // Update the feature images
      }
    }
  }
}


function updateSessionStorage() {
  if (props.location === 'common-areas') {
    const propertyData = props.payload;
    const commonArea = propertyData?.commonAreas?.value?.find((area: any) => area.name === props.label);
    if (commonArea) {
      commonArea.images = images;  // Only update once the images array is fully populated
      sessionStorage.setItem('property', JSON.stringify(propertyData));
    }
  } else if (props.location === 'rooms') {
    const propertyData = props.payload;
    const room = propertyData?.rooms?.value?.find((r: any) => r.name === props.roomName);
    const feature = room?.features?.find((f: any) => f.name === props.label);
    if (feature) {
      feature.images = images;
      sessionStorage.setItem('property', JSON.stringify(propertyData));
    }
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
