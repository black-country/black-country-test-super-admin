<template>
  <div class="">
    <!-- Tabbed navigation for rooms -->
    <!-- <div class="flex space-x-4 mb-6 overflow-x-auto whitespace-nowrap"> -->
    <div class="grid md:grid-cols-5 grid-cols-3 gap-2 mb-6">
      <button
        v-for="(room, index) in rooms"
        :key="index"
        @click="setActiveRoom(index)"
        :class="[
      'px-6 py-3 min-w-[120px] rounded-md border font-medium text-center',
      { 'bg-[#EBE5E0] text-[#1D2739]': activeRoom === index, 
        'bg-white text-[#1D2739] border-gray-100': activeRoom !== index }
    ]"
      >
        {{ room.name }}
      </button>
    </div>

    <div class="text-lg mb-4">
      Click to add as many pictures as you want for each room feature.
    </div>
    <p class="text-sm text-gray-500">Accepts jpg & png | 2MB size max/each</p>

    <!-- Render features only if activeRoom exists -->
    <div v-if="rooms[activeRoom]" class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      <div
        v-for="feature in rooms[activeRoom].features"
        :key="feature.name"
        class="relative rounded-lg overflow-hidden border border-gray-300 shadow-lg"
      >
        <!-- Image preview or loading spinner -->
        <div class="relative h-56 w-full">
          <!-- Show loading spinner if images are uploading -->
          <div v-if="loading[feature.name]" class="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50">
            <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
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
            @click="deleteMostRecentImage(feature.name)"
            class="absolute top-2 right-2 text-white bg-opacity-50 p-2 rounded-full"
          >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="14" fill="black" fill-opacity="0.5"/>
            <path d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
          </button>

          <!-- Previous and Next buttons -->
          <button
            v-if="feature.images.length > 1 && !loading[feature.name]"
            @click="prevImage(feature.name)"
            class="absolute left-2 top-1/2 transform -translate-y-1/2  bg-opacity-50 text-white rounded"
          >
          <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
            <path d="M11.5 7C11.5 7 8.50001 9.20945 8.5 10C8.5 10.7906 11.5 13 11.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
          </button>
          <button
            v-if="feature.images.length > 1 && !loading[feature.name]"
            @click="nextImage(feature.name)"
            class="absolute right-2 top-1/2 transform -translate-y-1/2  bg-opacity-50 text-white  rounded"
          >
          <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5"/>
            <path d="M8.50002 7C8.50002 7 11.5 9.20945 11.5 10C11.5 10.7906 8.5 13 8.5 13" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
          </button>

          <!-- Feature Label and Image Count (bottom-left corner) -->
          <div class="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white flex justify-between items-center px-4 py-2">
            <span class="text-sm">{{ feature.name }} | {{ feature.images.length }} {{ feature.images.length > 1 ? 'images' : 'image' }}</span>
            <label class="cursor-pointer inline-flex items-center space-x-2 bg-black rounded-lg py-2.5 px-2">
              <input type="file" class="hidden" accept="image/*" multiple @change="handleFileUpload($event, feature.name)" />
              <span class="text-white text-xs">+ Add photo</span>
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
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

const { uploadFiles, uploadResponse } = useBatchUploadFile();
const props = defineProps({
  payload: {
    type: Object,
    required: true,
  },
});

// Initialize room data and set up reactive states
const rooms = ref([]); // Local state for rooms
const activeRoom = ref(0); // Tracks the currently active room tab
const currentImage = ref<Record<string, number>>({}); // Tracks the current image index for each feature
const loading = ref<Record<string, boolean>>({}); // Tracks the loading state per feature

// **Synchronizing props.payload.rooms.value with local rooms**
// Watch for changes in the prop and update the local rooms value
watch(
  () => props.payload.rooms.value,
  (newRooms) => {
    if (newRooms) {
      rooms.value = [...newRooms];
      // Initialize currentImage and loading state for each feature in each room
      rooms.value.forEach((room: any) => {
        room.features.forEach((feature: any) => {
          currentImage.value[feature.name] = 0;
          loading.value[feature.name] = false; // Initialize loading state
        });
      });
    }
  },
  { deep: true, immediate: true } // Ensure it syncs immediately and deeply
);

// Debounced localStorage persistence for room data
const persistToLocalStorage = debounce(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      localStorage.setItem('property_rooms', JSON.stringify(rooms.value));
    });
  } else {
    setTimeout(() => {
      localStorage.setItem('property_rooms', JSON.stringify(rooms.value));
    }, 500);
  }
}, 500);

// Watch for changes in local room data and persist to localStorage
watch(rooms, persistToLocalStorage, { deep: true });

// Handle multiple file uploads for a feature
// const handleFileUpload = async (event: Event, featureName: string) => {
//   if (!rooms.value[activeRoom.value]) return; // Ensure activeRoom exists

//   const files = (event.target as HTMLInputElement).files;
//   if (!files) return;

//   const formData = new FormData();

//   // Validate each file and add to FormData if valid
//   for (let i = 0; i < files.length; i++) {
//     const file = files[i];
//     if (file.size > 2 * 1024 * 1024) {
//       showToast({
//           title: "Error",
//           message: "File size exceeds 2MB. Please upload a smaller file.",
//           toastType: "error",
//           duration: 3000
//         });
//       // alert('File size exceeds 2MB. Please upload a smaller file.');
//       continue;
//     }
//     formData.append('images', file);
//   }

//   // Proceed with upload if FormData has files
//   if (formData.has('images')) {
//     loading.value[featureName] = true; // Set loading state for the feature

//     try {
//       await uploadFiles(formData); // Batch upload files
//       const room = rooms.value[activeRoom.value];
//       const feature = room.features.find((f: any) => f.name === featureName);

//       if (feature) {
//         // Add uploaded image URLs to both feature and room
//         const uploadedImages = uploadResponse.value.map((res: { url: string }) => res.url);
//         feature.images.push(...uploadedImages); // Update feature images
//         room.images.push(...uploadedImages); // Consolidate in room's images
//       }

//       // Sync the payload with the updated local rooms value
//       props.payload.rooms.value = [...rooms.value]; // Sync back to payload
//     } catch (error) {
//       console.error('Failed to upload images:', error);
//     } finally {
//       loading.value[featureName] = false; // Reset loading state for the feature
//     }
//   }
// };

const handleFileUpload = async (event: Event, featureName: string) => {
  if (!rooms.value[activeRoom.value]) return; // Ensure activeRoom exists

  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const formData = new FormData();
  
  // Target file size in bytes (100KB)
  const TARGET_SIZE_KB = 100;
  const TARGET_SIZE = TARGET_SIZE_KB * 1024;
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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

  // Set loading state for compression process
  loading.value[featureName] = true;
  
  // Array to collect valid files (original or compressed)
  let validFiles = [];
  let compressedCount = 0;
  
  // Process each file with compression
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      // Check if it's an image file
      if (file.type.startsWith('image/')) {
        // Show compression status
        showToast({
          title: "Processing",
          message: `Optimizing image ${i+1}/${files.length}...`,
          toastType: "info",
          duration: 1500
        });
        
        // Compress the image
        const compressedFile = await compressImage(file, TARGET_SIZE);
        
        // Validate size after compression
        if (compressedFile.size > MAX_FILE_SIZE) {
          showToast({
            title: "Error",
            message: `File ${file.name} still exceeds 2MB after compression.`,
            toastType: "error",
            duration: 3000
          });
          continue;
        }
        
        formData.append('images', compressedFile);
        validFiles.push(compressedFile);
        compressedCount++;
      } else {
        // For non-image files, check size and add without compression
        if (file.size > MAX_FILE_SIZE) {
          showToast({
            title: "Error",
            message: "File size exceeds 2MB. Please upload a smaller file.",
            toastType: "error",
            duration: 3000
          });
          continue;
        }
        formData.append('images', file);
        validFiles.push(file);
      }
    } catch (error) {
      console.error(`Error processing file ${file.name}:`, error);
      showToast({
        title: "Error",
        message: `Failed to process ${file.name}`,
        toastType: "error",
        duration: 3000
      });
    }
  }

  // Proceed with upload if FormData has files
  if (formData.has('images')) {
    try {
      const startTime = performance.now();
      
      await uploadFiles(formData); // Batch upload files
      
      const uploadTime = performance.now() - startTime;
      console.log(`Upload completed in ${uploadTime.toFixed(2)}ms`);
      
      const room = rooms.value[activeRoom.value];
      const feature = room.features.find((f: any) => f.name === featureName);

      if (feature) {
        // Add uploaded image URLs to both feature and room
        const uploadedImages = uploadResponse.value.map((res: { url: string }) => res.url);
        feature.images.push(...uploadedImages); // Update feature images
        room.images.push(...uploadedImages); // Consolidate in room's images
      }

      // Sync the payload with the updated local rooms value
      props.payload.rooms.value = [...rooms.value]; // Sync back to payload
      
      // Show success message with compression stats
      if (compressedCount > 0) {
        showToast({
          title: "Success",
          message: `Uploaded ${validFiles.length} images (${compressedCount} compressed)`,
          toastType: "success",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Failed to upload images:', error);
      showToast({
        title: "Error",
        message: "Failed to upload images. Please try again.",
        toastType: "error",
        duration: 3000
      });
    } finally {
      loading.value[featureName] = false; // Reset loading state for the feature
    }
  } else {
    loading.value[featureName] = false; // Reset loading state if no valid files
    showToast({
      title: "Info",
      message: "No valid files to upload",
      toastType: "info",
      duration: 2000
    });
  }
};

// // Delete all images in a feature
// const deleteMostRecentImage = (featureName: string) => {
//   const room = rooms.value[activeRoom.value];
//   if (!room) return;

//   const feature = room.features.find((f: any) => f.name === featureName);
//   if (feature) {
//     feature.images = []; // Clear feature images
//     room.images = [];
//     room.images = room.images.filter((img: string) => !feature.images.includes(img)); // Remove from room

//     // Sync the payload with the updated local rooms value
//     props.payload.rooms.value = [...rooms.value]; // Sync back to payload
//   }
// };

// const deleteMostRecentImage = (featureName: string) => {
//   const room = rooms.value[activeRoom.value];
//   if (!room) return;

//   const feature = room.features.find((f: any) => f.name === featureName);
//   if (feature) {
//     // Preserve the feature's images before clearing them
//     const featureImages = [...feature.images];

//     // Clear feature images
//     feature.images = []; 

//     // Remove feature images from the room's images array
//     room.images = room.images.filter((img: string) => !featureImages.includes(img));

//     // Sync the payload with the updated local rooms value
//     props.payload.rooms.value = [...rooms.value]; // Sync back to payload
//   }
// };

const deleteMostRecentImage = (featureName: string) => {
  const room = rooms.value[activeRoom.value];
  if (!room) return;

  const feature = room.features.find((f: any) => f.name === featureName);
  if (feature && feature.images.length > 0) {
    // Get the last added image (most recent)
    const lastImage = feature.images.pop(); // Removes the last image from feature.images

    if (lastImage) {
      // Remove the last image from the room's images array
      room.images = room.images.filter((img: string) => img !== lastImage);
    }

    // Sync the payload with the updated local rooms value
    props.payload.rooms.value = [...rooms.value]; // Sync back to payload
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
  const storedRooms = localStorage.getItem('property_rooms');
  if (storedRooms) {
    rooms.value = JSON.parse(storedRooms);

    rooms.value.forEach((room: any) => {
      // Check if room.features exists and is an array
      if (room.features && Array.isArray(room.features)) {
        room.features.forEach((feature: any) => {
          currentImage.value[feature.name] = 0;
          loading.value[feature.name] = false; // Initialize loading state
        });
      }
    });
  }
});

</script>

<style scoped>
.loader {
  @apply animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500;
}
</style>
