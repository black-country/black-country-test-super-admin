<template>
  <div class="space-y-6">
    <!-- Gallery Section -->
    <div @click="previewCommonAreaImages"
      class="flex cursor-pointer items-center border-[0.5px] border-gray-50 space-x-4 bg-white p-4 rounded-lg">
      <!-- <img :src="dynamicImage('placeholder.png')" alt="Gallery" class="w-12 h-12 rounded-full"> -->
      <img v-if="!property?.images?.length" :src="dynamicImage('placeholder.png')" alt="Gallery"
        class="w-12 h-12 rounded-full">
      <img v-else :src="property?.images[0]" class="w-12 h-12 rounded-full" />
      <div class="flex-1">
        <h3 class="text-lg font-medium">Gallery</h3>
        <p class="text-gray-500 text-sm">Click to view photos of all common areas</p>
      </div>
      <button class="text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Interior Features Section -->
    <h2 class="text- pl-4 font-medium bg-white border-[0.5px] py-4 border-gray-50">Interior Features</h2>
    <div class="bg-white p-6 rounded-lg border-[0.5px] space-y-4 border-gray-50">
      <div class="space-y-2">
        <p class="font-medium text-sm text-[#667185]">
          Furnished: <span class="font-medium text-gray-900">{{ property.isFurnishedCommonArea ? 'Yes' : 'No' }}</span>
        </p>

        <div class="space-y-2">
          <p class="text-sm font- text-[#667185]">Amenities</p>

          <!-- Amenities -->
          <div class="grid grid-cols-3 gap-3">
            <div v-for="item in interiorCommonAreas" :key="item.id"
              class="flex items-center space-x-2 p-2 bg-white border-[0.5px] border-gray-100 rounded-md">
              <img :src="dynamicImage('roomBg.png')" alt="Living room" class="w-7 h-7">
              <p class="text-[#1D2739] text-sm">{{ item.name }}</p>
            </div>
          </div>
          <!-- <button class="mt-2 font-medium text-[#1D2739]">View less</button>  -->
        </div>
      </div>
    </div>

    <!-- Exterior Features Section -->
    <h2 class="text- pl-4 font-medium bg-white border-[0.5px] py-4 border-gray-50">Exterior Feature</h2>
    <div class="bg-white p-6 rounded-lg space-y-4">
      <div class="space-y-2">
        <p class="text-sm font- text-[#667185]">Amenities</p>

        <!-- Exterior Amenities -->
        <div class="grid grid-cols-3 gap-3">
          <div v-for="item in exteriorCommonAreas" :key="item.id"
            class="flex items-center space-x-2 p-2 bg-white border-[0.5px] border-gray-100 rounded-md">
            <img :src="dynamicImage('roomBg.png')" alt="Parking space" class="w-7 h-7">
            <p class="text-[#1D2739] text-sm">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dynamicImage, dynamicIcons } from "@/utils/assets";

const props = defineProps({
  property: {
    type: Object,
    default: () => { }
  }
})

// Function to extract all images from an array of objects that contain 'images' arrays
const extractCommonAreaImages = (commonAreas: any[]): string[] => {
  const allImages: string[] = [];

  commonAreas.forEach((area) => {
    if (area?.images && Array.isArray(area.images)) {
      // allImages.push(...area.images);
      area.images.forEach((image: string) => {
        if (!allImages.includes(image)) {
          allImages.push(image);
        }
      });
    }
  });

  return allImages;
};

const previewCommonAreaImages = () => {
  const allCommonAreaImages = extractCommonAreaImages(props.property.commonAreas);
  localStorage.setItem('selectedImages', JSON.stringify(allCommonAreaImages));
  router.push(`/dashboard/property/${props.property.id}/room-interior-images`);
  console.log(allCommonAreaImages); // This will log an array of all images from the common areas
}

const router = useRouter()

const exteriorCommonAreas = computed(() => {
  return props.property.commonAreas.filter((item: any) => item.type === 'exterior')
})

const interiorCommonAreas = computed(() => {
  return props.property.commonAreas.filter((item: any) => item.type === 'interior')
})
// No additional logic required for this layout.
</script>

<style scoped>
/* Tailwind CSS manages the layout and styling, no custom styles needed */
</style>