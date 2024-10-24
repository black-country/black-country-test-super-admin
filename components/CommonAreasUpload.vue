<template>
  <div>
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="(commonArea, featureIndex) in commonAreas"
        :key="commonArea.name"
        class="relative border border-gray-25 rounded-lg bg-[#F7F6F3]"
      >
        <div class="relative w-full h-56 rounded-lg overflow-hidden bg-gray-25">
          <template v-if="loadingStateCommonAreas[featureIndex]">
            <div class="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-300">
              <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-500"></div>
            </div>
          </template>
          <template v-else>
            <img
              v-if="commonArea.images?.length"
              :src="commonArea.images[activeImageIndexCommonAreas[featureIndex]]"
              alt="Image"
              class="w-full h-full object-cover rounded-lg"
            />
            <div class="flex justify-center items-center h-full" v-else>
              <img
                src="@/assets/img/image-02.png"
                alt="Placeholder Image"
                class="w-20 h-20 object-cover"
              />
            </div>
          </template>
          <button
            v-if="commonArea.images?.length > 1"
            @click="prevImage(featureIndex)"
            class="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
          >
          <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
            <path d="M11.5 7C11.5 7 8.50001 9.20945 8.5 10C8.5 10.7906 11.5 13 11.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
          </button>
          <button
            v-if="commonArea.images?.length > 1"
            @click="nextImage(featureIndex)"
            class="absolute right-2 top-1/2 transform -translate-y-1/2  z-10"
          >
            <!-- Next icon -->
            <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
              <path d="M8.50002 7C8.50002 7 11.5 9.20945 11.5 10C11.5 10.7906 8.5 13 8.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              
          </button>
          <button
            @click="deleteImage(featureIndex)"
            class="absolute top-2 right-2"
          >
            <!-- Delete icon -->
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="14" fill="black" fill-opacity="0.5"/>
              <path d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              
          </button>
          <div class="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/50 to-transparent">
            <!-- Common Area Info -->
            <div class="text-gray-800 text-sm font-semibold">
              <span>{{ commonArea.name }}</span>
              <span class="text-gray-900"> | {{ commonArea.images?.length }} images</span>
            </div>

            <!-- Add Photo Button -->
            <div class="flex justify-end">
              <button
                @click="triggerFileInputCommonArea(featureIndex)"
                class="px-4 py-2 flex items-center bg-gray-600 text-white text-sm rounded-md hover:bg-gray-500"
              >
                + Add photo
              </button>
            </div>
          </div>
        </div>

        <!-- Hidden file input for uploading images -->
        <input
          type="file"
          accept="image/png, image/jpeg"
          multiple
          @change="uploadImagesCommonArea($event, featureIndex)"
          class="hidden"
          ref="fileInputCommonAreas"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // Import composable for uploading files
import { useCustomToast } from '@/composables/core/useCustomToast';
import { use_create_property } from '@/composables/modules/property/create';
const { payload } = use_create_property();
const { showToast } = useCustomToast();

// Use composable for batch uploading files
const { uploadFiles, uploadResponse, loading } = useBatchUploadFile();

// State for common areas
const commonAreas = ref<any[]>([]);
const loadingStateCommonAreas = ref<boolean[]>([]);
const activeImageIndexCommonAreas = ref<number[]>([]);
const activeCommonAreaIndex = ref(0);
const currentCommonArea = computed(() => commonAreas.value[activeCommonAreaIndex.value]);

// Maximum file size limit (e.g., 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// On mounted, load common areas from local storage
onMounted(() => {
  const savedCommonAreas = localStorage.getItem('property_commonAreas');
  if (savedCommonAreas) {
    const parsedCommonAreas = JSON.parse(savedCommonAreas);

    // Check if the parsedCommonAreas is an array of arrays and flatten it if necessary
    if (Array.isArray(parsedCommonAreas[0])) {
      commonAreas.value = parsedCommonAreas.flat();
    } else {
      commonAreas.value = parsedCommonAreas;
    }

    // Initialize activeImageIndexCommonAreas for each common area
    commonAreas.value.forEach((commonArea) => {
      activeImageIndexCommonAreas.value.push(0); // Initialize active image index for each common area
      loadingStateCommonAreas.value.push(false); // Initialize loading state for each common area
    });
  }
});

// Watch common areas and persist them to local storage when changes occur
watch(commonAreas, (newCommonAreas) => {
  localStorage.setItem('property_commonAreas', JSON.stringify(newCommonAreas));
}, { deep: true });

// Validate file size before uploading
const validateFileSize = (files: FileList): boolean => {
  for (let i = 0; i < files?.length; i++) {
    if (files[i].size > MAX_FILE_SIZE) {
      showToast({
        title: 'File too large',
        message: `Each file must be smaller than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
        toastType: 'error',
        duration: 3000,
      });
      return false;
    }
  }
  return true;
};

// Handle batch file input and upload for common areas
// const uploadImagesCommonArea = async (event: Event, featureIndex: number) => {
//   const files = (event.target as HTMLInputElement).files;
//   if (files && files?.length > 0) {
//     if (!validateFileSize(files)) {
//       return; // Stop if file validation fails
//     }

//     loadingStateCommonAreas.value[featureIndex] = true; // Show loading spinner

//     try {
//       const formData = new FormData();
//       for (const file of files) {
//         formData.append('files[]', file);
//       }

//       // Upload files and ensure await is used to properly wait for the upload to finish
//       await uploadFiles(formData);

//       // Handle the upload response and add the images to the appropriate common area's images array
//       if (uploadResponse.value && uploadResponse.value?.length) {
//         uploadResponse.value.forEach((uploadedFile: any) => {
//           commonAreas.value[featureIndex].images.push(uploadedFile.secure_url); // Group images by commonArea
//         });
//         activeImageIndexCommonAreas.value[featureIndex] =
//           commonAreas.value[featureIndex].images?.length - 1;
//         showToast({
//           title: 'Success',
//           message: 'Batch upload successful!',
//           toastType: 'success',
//           duration: 3000,
//         });
//       }
//     } catch (error) {
//       console.log(error, 'error here')
//       showToast({
//         title: 'Error',
//         message: 'Batch upload failed. Please try again.',
//         toastType: 'error',
//         duration: 3000,
//       });
//     } finally {
//       loadingStateCommonAreas.value[featureIndex] = false; // Hide loading spinner
//     }
//   }
// };

const uploadImagesCommonArea = async (event: Event, featureIndex: number) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files?.length > 0) {
    if (!validateFileSize(files)) {
      return; // Stop if file validation fails
    }

    loadingStateCommonAreas.value[featureIndex] = true; // Show loading spinner

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files[]', file);
      }

      // Upload files and ensure await is used to properly wait for the upload to finish
      await uploadFiles(formData);

      // Check if uploadResponse contains files
      if (uploadResponse.value && uploadResponse.value?.length) {
        // Ensure the commonArea has an `images` array initialized
        if (!commonAreas.value[featureIndex].images) {
          commonAreas.value[featureIndex].images = []; // Initialize the images array if it doesn't exist
        }

        // Add the uploaded images to the appropriate commonArea's images array
        uploadResponse.value.forEach((uploadedFile: any) => {
          commonAreas.value[featureIndex].images.push(uploadedFile.secure_url); // Group images by commonArea
        });

        // Update the active image index to the last uploaded image
        activeImageIndexCommonAreas.value[featureIndex] =
          commonAreas.value[featureIndex].images?.length - 1;

        showToast({
          title: 'Success',
          message: 'Batch upload successful!',
          toastType: 'success',
          duration: 3000,
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Batch upload failed. Please try again.',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      loadingStateCommonAreas.value[featureIndex] = false; // Hide loading spinner
    }
  }
};


// Trigger file input for common areas
const triggerFileInputCommonArea = (featureIndex: number) => {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  if (fileInputs[featureIndex]) fileInputs[featureIndex].click();
};

// Handle deleting an image from the common area
const deleteImage = (featureIndex: number) => {
  const commonArea = commonAreas.value[featureIndex];
  const activeIndex = activeImageIndexCommonAreas.value[featureIndex];

  if (commonArea.images.length > 0) {
    // Remove the image from the array
    commonArea.images.splice(activeIndex, 1);

    // Reset the active index if necessary
    if (activeIndex >= commonArea.images.length) {
      activeImageIndexCommonAreas.value[featureIndex] = commonArea.images.length - 1;
    }

    showToast({
      title: 'Deleted',
      message: 'Image removed successfully!',
      toastType: 'success',
      duration: 3000,
    });
  }
};

// Handle navigating to the next image
const nextImage = (featureIndex: number) => {
  const commonArea = commonAreas.value[featureIndex];
  if (activeImageIndexCommonAreas.value[featureIndex] < commonArea.images.length - 1) {
    activeImageIndexCommonAreas.value[featureIndex]++;
  }
};

// Handle navigating to the previous image
const prevImage = (featureIndex: number) => {
  if (activeImageIndexCommonAreas.value[featureIndex] > 0) {
    activeImageIndexCommonAreas.value[featureIndex]--;
  }
};
</script>


<style scoped>
/* Styling for the spinner */
.spinner-border {
  border-color: transparent transparent gray transparent;
}

/* Full-width layout */
.grid-cols-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 1024px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
