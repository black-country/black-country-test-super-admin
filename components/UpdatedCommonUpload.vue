<template>
  <div class="">
    <div class="text-lg text-gray-600 mb-4">
      Click to add as many pictures as you want to for each common area or space.
    </div>
    <p class="text-sm text-gray-500">Accepts jpg & png | 2MB size max/each</p>

    <!-- Check if there are common areas -->
    <div v-if="commonAreas.length" class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      <div v-for="area in commonAreas" :key="area.id" class="relative rounded-lg overflow-hidden border border-gray-300">
        
        <!-- Image preview carousel -->
        <div class="relative h-64 w-full">
          <!-- Show uploaded images -->
          <img 
            v-if="area.images && area.images.length" 
            :src="area.images[currentImage[area.id]]" 
            alt="Common Area Image" 
            class="object-cover w-full h-full">
          
          <!-- Show a placeholder when no image -->
          <div v-else class="flex items-center justify-center h-full w-full bg-gray-100">
            <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-16 h-16">
          </div>
          
          <!-- Loading spinner -->
          <div v-if="isLoading[area.id]" class="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <span class="loader"></span>
          </div>

          <!-- Delete icon (top-right corner) -->
          <button 
            @click="deleteMostRecentImage(area.id)" 
            class="absolute top-2 right-2 text-white  bg-opacity-50"
          >
          <svg width="34" height="34" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="14" fill="black" fill-opacity="0.5"/>
            <path d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Previous and Next buttons -->
          <button 
            v-if="area.images && area.images.length > 1 && !isLoading[area.id]" 
            @click="prevImage(area.id)" 
            class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-opacity-50 "
          >
          <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
            <path d="M11.5 7C11.5 7 8.50001 9.20945 8.5 10C8.5 10.7906 11.5 13 11.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button 
            v-if="area.images && area.images.length > 1 && !isLoading[area.id]" 
            @click="nextImage(area.id)" 
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-opacity-50 "
          >
          <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
            <path d="M8.50002 7C8.50002 7 11.5 9.20945 11.5 10C11.5 10.7906 8.5 13 8.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Common area label and image count (bottom-left corner) -->
          <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white flex justify-between items-center px-4 py-2">
            <span class="text-sm">{{ area.name }} | {{ area.images ? area.images.length : 0 }} images</span>
            <label class="cursor-pointer inline-flex items-center space-x-2 bg-black rounded-lg py-2.5 px-2">
              <input type="file" class="hidden" accept="image/*" multiple @change="handleFileUpload($event, area.id)">
              <span class="text-white text-xs">+ Add photo</span>
            </label>
          </div>
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

const props = defineProps({
  payload: {
    type: Object,
    required: true
  }
});

// Dynamically loaded common areas from props.payload and localStorage
const commonAreas = ref(props.payload.commonAreas.value ?? []);

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

    // Initialize currentImage, isLoading, and uploadProgress for each common area
    parsedAreas.forEach((area: any) => {
      currentImage.value[area.id] = 0;
      isLoading.value[area.id] = false;
      uploadProgress.value[area.id] = 0; // Initial progress
      if (!area.images) area.images = [];
    });
  }
};

// Watch for changes in props.payload.commonAreas and sync it with local commonAreas
watch(
  () => props.payload.commonAreas.value,
  (newVal) => {
    if (newVal) {
      commonAreas.value = newVal;
    }
  },
  { deep: true }
);

// Debounced localStorage writes to optimize performance
const persistToLocalStorage = debounce(() => {
  requestIdleCallbackFallback(() => {
    localStorage.setItem('property_commonAreas', JSON.stringify(commonAreas.value));
  });

  // Sync commonAreas with props.payload.commonAreas
  props.payload.commonAreas.value = commonAreas.value;
}, 1000); // Increase debounce interval to optimize performance

// Watch for changes to commonAreas and persist to localStorage
watch(commonAreas, persistToLocalStorage, { deep: true });

// Handle multiple file upload for each common area
// const handleFileUpload = async (event: Event, areaId: string) => {
//   const files = (event.target as HTMLInputElement).files;
//   if (!files) return;

//   const formData = new FormData();

//   // Check each file size and append valid files to the FormData object
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     if (file.size > MAX_FILE_SIZE) {
//       alert(`File ${file.name} exceeds 2MB limit. Please choose a smaller file.`);
//       continue; // Skip files that exceed the size limit
//     }
//     formData.append('images', file); // Add each image to FormData
//   }

//   // Only proceed if there are valid files
//   if (formData.has('images')) {
//     isLoading.value[areaId] = true;

//     try {
//       // Use the batch upload composable to upload the files
//       await uploadFiles(formData, (progressEvent) => {
//         // Track upload progress for the current common area
//         const total = progressEvent.total ?? 1;
//         uploadProgress.value[areaId] = Math.round((progressEvent.loaded / total) * 100);
//       });

//       // Extract secure URLs from the response and add them to the area images
//       const areaIndex = commonAreas.value.findIndex((area: any) => area.id === areaId);
//       if (areaIndex !== -1) {
//         const uploadedImages = uploadResponse.value.map((response: { url: string }) => response.url);
//         const updatedImages = [...commonAreas.value[areaIndex].images, ...uploadedImages];

//         // Replace the images array with the updated one (ensures reactivity)
//         commonAreas.value[areaIndex].images = updatedImages;
//       }
//     } catch (error) {
//       console.error("Failed to upload images", error);
//     } finally {
//       isLoading.value[areaId] = false;
//       uploadProgress.value[areaId] = 0; // Reset progress after completion
//     }
//   }
// };

const handleFileUpload = async (event: Event, areaId: string) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const formData = new FormData();
  
  // Target file size in bytes (100KB)
  const TARGET_SIZE_KB = 100;
  const TARGET_SIZE = TARGET_SIZE_KB * 1024;

  // Function to compress image with iterative quality reduction
  const compressImage = async (file: File, maxSizeBytes: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          // Calculate scaled dimensions - more aggressive reduction
          let width = img.width;
          let height = img.height;
          
          // Maximum dimensions - reduced for smaller file sizes
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          
          // Scale down dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          
          // Further reduce dimensions for larger images
          if (file.size > 1024 * 1024) { // If original is > 1MB
            width = Math.round(width * 0.8);
            height = Math.round(height * 0.8);
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compression strategy with iterative quality reduction
          // const compressWithQuality = (quality: number) => {
          //   canvas.toBlob(
          //     (blob) => {
          //       if (!blob) {
          //         reject(new Error('Canvas to Blob conversion failed'));
          //         return;
          //       }
                
          //       // If blob is still too large and quality can be reduced further
          //       if (blob.size > maxSizeBytes && quality > 0.1) {
          //         // Reduce quality and try again
          //         compressWithQuality(quality - 0.1);
          //       } else {
          //         // Create new file from the compressed blob
          //         const compressedFile = new File(
          //           [blob], 
          //           file.name.replace(/\.[^/.]+$/, "") + ".jpg", // Force .jpg extension
          //           { type: 'image/jpeg', lastModified: Date.now() }
          //         );
                  
          //         console.log(`Compressed ${file.name} from ${(file.size/1024).toFixed(2)}KB to ${(compressedFile.size/1024).toFixed(2)}KB`);
          //         resolve(compressedFile);
          //       }
          //     },
          //     'image/jpeg',
          //     quality
          //   );
          // };

          const compressWithQuality = (quality: number) => {
  // Get file extension to determine format
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  let mimeType = 'image/jpeg'; // Default MIME type

  // Set MIME type based on file extension
  if (fileExtension === 'png') {
    mimeType = 'image/png';
  } else if (fileExtension === 'jpeg' || fileExtension === 'jpg') {
    mimeType = 'image/jpeg';
  } else if (fileExtension === 'webp') {
    mimeType = 'image/webp';
  } else {
    reject(new Error('Unsupported file format'));
    return;
  }

  // Convert canvas to blob and compress image
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        reject(new Error('Canvas to Blob conversion failed'));
        return;
      }

      // If blob is still too large and quality can be reduced further
      if (blob.size > maxSizeBytes && quality > 0.1) {
        // Reduce quality and try again
        compressWithQuality(quality - 0.1);
      } else {
        // Create new file from the compressed blob
        const compressedFile = new File(
          [blob],
          file.name.replace(/\.[^/.]+$/, "") + `.${fileExtension}`, // Preserve original file extension
          { type: mimeType, lastModified: Date.now() }
        );

        console.log(`Compressed ${file.name} from ${(file.size / 1024).toFixed(2)}KB to ${(compressedFile.size / 1024).toFixed(2)}KB`);
        resolve(compressedFile);
      }
    },
    mimeType, // Use the correct MIME type based on the format
    quality
  );
};

          
          // Start with middle quality (0.5 = 50%)
          compressWithQuality(0.5);
        };
        img.onerror = () => {
          reject(new Error('Image loading failed'));
        };
      };
      reader.onerror = () => {
        reject(new Error('File reading failed'));
      };
    });
  };

  // Show progress indicator for the area
  uploadProgress.value[areaId] = 1; // Set to 1% to show it's starting
  
  // Process and compress each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Only compress images
      if (file.type.startsWith('image/')) {
        // Update progress to show compression is happening
        uploadProgress.value[areaId] = Math.round((i / files.length) * 10); // Use first 10% for compression process
        
        const compressedFile = await compressImage(file, TARGET_SIZE);
        
        // Check if still too large after compression
        if (compressedFile.size > MAX_FILE_SIZE) {
          alert(`File ${file.name} still exceeds 2MB limit after compression. Please choose a smaller file.`);
          continue;
        }
        
        formData.append('images', compressedFile);
      } else {
        // For non-image files, add original if within size limit
        if (file.size > MAX_FILE_SIZE) {
          alert(`File ${file.name} exceeds 2MB limit and cannot be compressed. Please choose a smaller file.`);
          continue;
        }
        formData.append('images', file);
      }
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      alert(`Failed to process file ${file.name}. Please try again.`);
    }
  }

  // Only proceed if there are valid files
  if (formData.has('images')) {
    isLoading.value[areaId] = true;

    try {
      const startTime = performance.now();
      
      // Use the batch upload composable to upload the files with progress tracking
      await uploadFiles(formData, (progressEvent) => {
        // Track upload progress for the current common area (scale from 10% to 100%)
        const total = progressEvent.total ?? 1;
        const uploadPercentage = Math.round((progressEvent.loaded / total) * 90);
        uploadProgress.value[areaId] = 10 + uploadPercentage; // Start from 10% (after compression)
      });
      
      const uploadTime = performance.now() - startTime;
      console.log(`Upload completed in ${uploadTime.toFixed(2)}ms`);

      // Extract secure URLs from the response and add them to the area images
      const areaIndex = commonAreas.value.findIndex((area: any) => area.id === areaId);
      if (areaIndex !== -1) {
        const uploadedImages = uploadResponse.value.map((response: { url: string }) => response.url);
        const updatedImages = [...commonAreas.value[areaIndex].images, ...uploadedImages];

        // Replace the images array with the updated one (ensures reactivity)
        commonAreas.value[areaIndex].images = updatedImages;
      }
    } catch (error) {
      console.error("Failed to upload images", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      isLoading.value[areaId] = false;
      uploadProgress.value[areaId] = 0; // Reset progress after completion
    }
  } else {
    // Reset progress if no files were valid
    uploadProgress.value[areaId] = 0;
  }
};

// Handle image deletion
// const deleteMostRecentImage = (areaId: string) => {
//   const areaIndex = commonAreas.value.findIndex((area: any) => area.id === areaId);
//   if (areaIndex !== -1) {
//     commonAreas.value[areaIndex].images = [];
//   }
// };

const deleteMostRecentImage = (areaId: string) => {
  const areaIndex = commonAreas.value.findIndex((area: any) => area.id === areaId);
  if (areaIndex !== -1 && commonAreas.value[areaIndex].images.length > 0) {
    commonAreas.value[areaIndex].images.pop(); // Removes the last image
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


<style scoped>
.loader {
  @apply animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500;
}
</style>


  
