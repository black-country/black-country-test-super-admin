<template>
  <div>
    <div class="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
      <button
        v-for="(room, index) in rooms"
        :key="room.name"
        @click="activeRoomIndex = index"
        :class="{
          'bg-[#EBE5E0]': activeRoomIndex === index,
          'bg-white': activeRoomIndex !== index
        }"
        class="px-4 py-2 border-[0.5px] text-[#1D2739] text-sm rounded-lg flex-shrink-0"
      >
        {{ room.name }}
      </button>
    </div>

    <div v-if="currentRoom">
      <div class="mb-4">
        <h2 class="text-[#1D2739] font-light">
          Click to add as many pictures as you want for each feature of the room.
        </h2>
        <p class="text-sm text-gray-500">
          Accepts jpg & png, 2MB size max/each
        </p>
      </div>

      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="(feature, featureIndex) in currentRoom.features"
          :key="feature.name"
          class="relative border border-gray-25 rounded-lg"
        >
          <!-- Drag-and-Drop area for file uploads -->
          <div
            class="relative w-full h-72 rounded-lg overflow-hidden bg-gray-25 border-[0.5px] border-gray-25 flex items-center justify-center"
            @dragenter.prevent
            @dragover.prevent
            @drop="handleDrop($event, featureIndex)"
          >
            <!-- Spinner and image carousel preview -->
            <div class="absolute inset-0">
              <!-- Spinner for loading -->
              <div
                v-if="loadingState[featureIndex]"
                class="absolute inset-0 flex items-center justify-center z-10 bg-gray-100 bg-opacity-70"
              >
                <div
                  class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-gray-500"
                ></div>
              </div>

              <!-- Carousel or Single Image Display -->
              <template v-else>
                <img
                  v-if="feature.images.length > 1"
                  :src="feature.images[activeImageIndex[featureIndex]]"
                  class="w-full h-full object-cover rounded-md"
                />
                <img
                  v-else-if="feature.images.length === 1"
                  :src="feature.images[0]"
                  alt=""
                  class="w-full h-full object-coverrounded-md"
                />
                <div class="flex justify-center items-center h-full" v-else>
                  <img
                    src="@/assets/img/image-02.png"
                    alt=""
                    class="w-44 h-44 object-cover"
                  />
                </div>
              </template>
            </div>

            <!-- Carousel navigation buttons -->
            <button
              v-if="feature.images.length > 1"
              @click="prevImage(featureIndex)"
              class="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-700 p-2 z-10"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="20"
                  height="20"
                  rx="10"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M11.5 7C11.5 7 8.50001 9.20945 8.5 10C8.5 10.7906 11.5 13 11.5 13"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              v-if="feature.images.length > 1"
              @click="nextImage(featureIndex)"
              class="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-700 p-2 z-10"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="20"
                  height="20"
                  rx="10"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M8.50002 7C8.50002 7 11.5 9.20945 11.5 10C11.5 10.7906 8.5 13 8.5 13"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            <!-- Remove button (top-right corner) -->
            <button
              v-if="feature.images.length"
              @click="deleteImage(featureIndex)"
              class="absolute top-2 right-2 text-white p-2 z-10"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="28"
                  height="28"
                  rx="14"
                  fill="black"
                  fill-opacity="0.5"
                />
                <path
                  d="M17.5 10.5L10.5 17.5M10.5 10.5L17.5 17.5"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <!-- Feature label and add photo button -->
          <div class="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div class="text-white text-sm font-medium">{{ feature.name }}</div>
            <div class="flex justify-end">
              <button
                @click="triggerFileInput(featureIndex)"
                class="px-4 py-2 flex gap-x-2 items-center bg-gray-700 text-white text-sm rounded-md hover:bg-gray-600"
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 1.3335V6.66683"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1.33398 4H6.66732"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Add photo
              </button>
            </div>
          </div>

          <!-- Hidden file input (with multiple attribute for batch upload) -->
          <input
            type="file"
            accept="image/png, image/jpeg"
            multiple
            @change="uploadImages($event, featureIndex)"
            class="hidden"
            ref="fileInput"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useBatchUploadFile } from '@/composables/core/batchUpload'; // Import composable for uploading files
import { useCustomToast } from '@/composables/core/useCustomToast'
import { use_create_property } from '@/composables/modules/property/create'
const { payload } = use_create_property()
const { showToast } = useCustomToast();

// Use composable for batch uploading files
const { uploadFiles, uploadResponse, loading } = useBatchUploadFile();

// State for rooms, loading, and active image index for carousel
const rooms = ref<any[]>([]);
const loadingState = ref<boolean[]>([]);
const activeImageIndex = ref<number[]>([]); // Keeps track of the active image in the carousel for each feature

// State for active room index
const activeRoomIndex = ref(0);
const currentRoom = computed(() => rooms.value[activeRoomIndex.value]);
// Load rooms from local storage on mount
// onMounted(() => {
//   const savedRooms = localStorage.getItem('property_rooms');
//   if (savedRooms) {
//     rooms.value = JSON.parse(savedRooms);
//   } else {
//     // Fallback if local storage is empty (or you can handle this otherwise)
//     rooms.value = [];
//   }
// });

// onMounted(() => {
//   const savedRooms = localStorage.getItem('property_rooms');
//   if (savedRooms) {
//     rooms.value = JSON.parse(savedRooms);
//     // Initialize activeImageIndex for each feature
//     rooms.value.forEach((room) => {
//       room.features.forEach((_, featureIndex) => {
//         activeImageIndex.value[featureIndex] = 0;
//       });
//     });
//   } else {
//     rooms.value = [];
//   }
// });


// // Watch rooms and payload.rooms.value and persist to local storage when changes occur
// watch([rooms, payload.rooms], ([newRooms]) => {
//   localStorage.setItem('property_rooms', JSON.stringify(newRooms));
//   payload.rooms.value = newRooms; // Sync payload.rooms.value with rooms
// }, { deep: true });

onMounted(() => {
  const savedRooms = localStorage.getItem('property_rooms');
  if (savedRooms) {
    const parsedRooms = JSON.parse(savedRooms);

    // Check if the parsedRooms is an array of arrays and flatten it if necessary
    if (Array.isArray(parsedRooms[0])) {
      rooms.value = parsedRooms.flat();
    } else {
      rooms.value = parsedRooms;
    }

    // Initialize activeImageIndex for each feature
    rooms.value.forEach((room) => {
      room.features.forEach((_, featureIndex) => {
        activeImageIndex.value[featureIndex] = 0;
      });
    });
  } else {
    rooms.value = [];
  }
});

// Watch rooms and payload.rooms.value and persist to local storage when changes occur
watch([rooms, payload.rooms], ([newRooms]) => {
  // Ensure we store the rooms array as a flat array
  localStorage.setItem('property_rooms', JSON.stringify(newRooms.flat ? newRooms.flat() : newRooms));
  payload.rooms.value = newRooms.flat ? newRooms.flat() : newRooms; // Sync payload.rooms.value with rooms
}, { deep: true });



const isImageLoaded = (imageUrl: string) => {
  const img = new Image();
  img.src = imageUrl;
  return img.complete && img.naturalHeight !== 0;
};

// Handle batch file input and upload for features
const uploadImages = async (event: Event, featureIndex: number) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    loadingState.value[featureIndex] = true;

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files[]', file);
      }

      // Upload files
      const response = await uploadFiles(formData);

      // Handle the upload response and add the images to the feature's images array
      if (uploadResponse.value && uploadResponse.value.length) {
        uploadResponse.value.forEach((uploadedFile: any) => {
          currentRoom.value.features[featureIndex].images.push(uploadedFile.url);
          currentRoom.value.images.push(uploadedFile.url);
        });
        activeImageIndex.value[featureIndex] = currentRoom.value.features[featureIndex].images.length - 1; // Set carousel to the last added image
        showToast({
          title: "Success",
          message: 'Batch upload successful!',
          toastType: "success",
          duration: 3000
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: 'Batch upload failed. Please try again.',
        toastType: "error",
        duration: 3000
      });
    } finally {
      loadingState.value[featureIndex] = false;
    }
  }
};

// Handle drag-and-drop upload for features
const handleDrop = async (event: DragEvent, featureIndex: number) => {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    loadingState.value[featureIndex] = true;

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files[]', file);
      }

      // Upload files
      const response = await uploadFiles(formData);

      // Handle the upload response and add the images to the feature's images array
      if (uploadResponse.value && uploadResponse.value.length) {
        uploadResponse.value.forEach((uploadedFile: any) => {
          currentRoom.value.features[featureIndex].images.push(uploadedFile.url);
        });
        activeImageIndex.value[featureIndex] = currentRoom.value.features[featureIndex].images.length - 1; // Set carousel to the last added image
        showToast({
          title: "Success",
          message: 'Batch upload successful via drag-and-drop!',
          toastType: "success",
          duration: 3000
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: 'Drag-and-drop upload failed. Please try again.',
        toastType: "error",
        duration: 3000
      });
    } finally {
      loadingState.value[featureIndex] = false;
    }
  }
};

// Delete image
const deleteImage = (featureIndex: number) => {
  const featureImages = currentRoom.value.features[featureIndex].images;
  if (featureImages.length > 0) {
    // Remove the current image based on the activeImageIndex
    featureImages.splice(activeImageIndex.value[featureIndex], 1);

    // If there are images left, set the activeImageIndex accordingly
    if (featureImages.length > 0) {
      activeImageIndex.value[featureIndex] = Math.min(activeImageIndex.value[featureIndex], featureImages.length - 1);
    } else {
      // If no images are left, reset the index
      activeImageIndex.value[featureIndex] = 0;
    }

    showToast({
      title: "Deleted",
      message: "Image removed successfully!",
      toastType: "success",
      duration: 3000
    });
  }
};

// Handle next/previous image in the carousel
const nextImage = (featureIndex: number) => {
  const featureImages = currentRoom.value.features[featureIndex].images;
  if (activeImageIndex.value[featureIndex] < featureImages.length - 1) {
    activeImageIndex.value[featureIndex]++;
  } else {
    // Optionally, loop back to the first image
    activeImageIndex.value[featureIndex] = 0;
  }
};

const prevImage = (featureIndex: number) => {
  const featureImages = currentRoom.value.features[featureIndex].images;
  if (activeImageIndex.value[featureIndex] > 0) {
    activeImageIndex.value[featureIndex]--;
  } else {
    // Optionally, loop to the last image
    activeImageIndex.value[featureIndex] = featureImages.length - 1;
  }
};

// Trigger file input
const fileInput = ref<HTMLInputElement | null>(null);
const triggerFileInput = (featureIndex: number) => {
  const fileInputs = document.querySelectorAll('input[type="file"]');
  if (fileInputs[featureIndex]) fileInputs[featureIndex].click();
};
</script>


<style scoped>
/* Spinner Animation */
.spinner-border {
  border-color: transparent transparent gray transparent;
}

/* Drag-and-drop area */
.drag-active {
  border-color: blue;
  background-color: rgba(0, 0, 255, 0.1);
}

/* Carousel navigation buttons */
</style>

