<template>
  <div class="flex flex-col lg:flex-row gap-6 p-6">
    <!-- Left Section -->
    <div class="lg:w-1/2 space-y-6">
      <!-- Property Title and Overview -->
      <div>
        <h1 class="text-2xl font-medium">{{ propertyObj?.name ?? "Ni" }}</h1>
        <p class="text-sm gap-x-2 text-gray-500 flex items-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.07847 14.2443C8.7894 14.515 8.40293 14.6663 8.00073 14.6663C7.59853 14.6663 7.21213 14.515 6.923 14.2443C4.27535 11.7503 0.727174 8.96427 2.45751 4.91945C3.39309 2.73245 5.63889 1.33301 8.00073 1.33301C10.3626 1.33301 12.6084 2.73245 13.544 4.91945C15.2721 8.95921 11.7327 11.7589 9.07847 14.2443Z"
              fill="#5B8469"
              stroke="#5B8469"
            />
            <path
              d="M10.3337 7.33333C10.3337 8.622 9.28899 9.66667 8.00033 9.66667C6.71166 9.66667 5.66699 8.622 5.66699 7.33333C5.66699 6.04467 6.71166 5 8.00033 5C9.28899 5 10.3337 6.04467 10.3337 7.33333Z"
              fill="white"
              stroke="#5B8469"
            />
          </svg>
          {{ propertyObj?.address ?? "Nil" }}
        </p>

        <div class="mt-4 flex space-x-2 overflow-x-auto hide-scrollbar">
          <button
            :class="[activeTab === 'property-overview' ? 'bg-[#EBE5E0]' : 'bg-[#F0F2F5]']"
            @click="handleSelectedTab('property-overview')"
            class="text-[#292929] text-sm py-2 px-4  rounded-md flex-shrink-0 whitespace-nowrap w-auto"
          >
            Property Overview
          </button>
          <button
            :class="[activeTab === 'common-areas' ? 'bg-[#EBE5E0]' : 'bg-[#F0F2F5]']"
            @click="handleSelectedTab('common-areas')"
            class="text-[#292929] text-sm py-2 px-4 rounded-md flex-shrink-0 whitespace-nowrap w-auto"
          >
            Common areas
          </button>
          <button
            :class="[activeTab === item.name ? 'bg-[#EBE5E0]' : 'bg-[#F0F2F5]']"
            v-for="item in propertyObj.rooms"
            :key="item.id"
            @click="handleSelectedTab(item, 'dynamic')"
            class="text-[#292929] text-sm py-2 px-4 rounded-md flex-shrink-0 whitespace-nowrap w-auto"
          >
            {{ item?.name }}
          </button>
        </div>
      </div>
      <InfoOverview
        :property="propertyObj"
        v-if="activeTab === 'property-overview'"
      />
      <InteriorExteriorFeatures
        :property="propertyObj"
        v-if="activeTab === 'common-areas'"
      />
      <div v-if="activeTab !== 'property-overview' && activeTab !== 'common-areas'" class=" max-w-3xl mx-auto">
        <button :disabled="!selectedRoomObj?.images?.length" @click="previewRoomImages(activeTab)" class="flex justify-between disabled:cursor-not-allowed disabled:opacity-25 w-full cursor-pointer mb-3 items-center border-[0.5px] border-gray-50 space-x-4 bg-white p-4 rounded-lg">
          <div class="flex">
            <img v-if="!selectedRoomObj?.images?.length" :src="dynamicImage('placeholder.png')" alt="Gallery" class="w-12 h-12 rounded-full">
            <img v-else :src="selectedRoomObj?.images[0]" class="w-12 h-12 rounded-full" />
            <div class="pl-2">
              <h3 class="text-lg font-medium text-start">Gallery</h3>
              <p class="text-gray-500 text-sm text-start">Click to view photos of {{selectedRoomObj.name}}</p>
            </div>
          </div>
        <div>
          <button class="text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        </button>
        <!-- Availability and Rent Details -->
        <div class="flex flex-col space-y-1 mb-6 bg-white rounded-lg border-gray-50 p-3 border-[0.5px] text-sm">
          <p class="text-[#1D2739] text-sm font-medium">Available <span class="text-[#326543]">{{selectedRoomObj?.availability === 'available_now' ? 'Now' : selectedRoomObj?.availability === 'unavailable' ? 'Unavailable' : selectedRoomObj?.availability === 'available_from_date' ? 'Not Available For Now' : ''}}</span></p>
          <p class="text-gray-900 font-medium text-lg">{{ formatCurrency(selectedRoomObj?.rentAmount)}} <span class="text-[#667185] text-sm font-normal">{{selectedRoomObj?.rentFrequency}}</span></p>
        </div>

<!-- {{ selectedRoomObj.additionalCharges }} -->
        <CoreHousingFees v-if="selectedRoomObj?.additionalCharges?.length" :additionalChargesList="selectedRoomObj?.additionalCharges" class="mb-8" />
    
        <!-- Interior Features Section -->
        <div class="mb-6 space-y-3">
          <h3 class="text- pl-4 font-medium text-[#1D2739] bg-white border-[0.5px] py-4 rounded-md border-gray-50">Interior Features</h3>
          
   <section class="font-medium bg-white border-[0.5px] py-4 border-gray-50 rounded-md">
           <!-- Furnished Status -->
           <p class="text-gray-700 mb-2 pl-4"><span class="font-medium">Furnished:</span> {{selectedRoomObj?.isFurnished ? 'Yes' : 'No'}}</p>
    
           <!-- Amenities -->
           <h4 class="text-gray-500 mb-3 text- pl-4">Amenities</h4>
           <div class="grid grid-cols-3 gap-3 text- p-3">
             <div v-for="(amenity, index) in selectedRoomObj?.features" :key="index" class="flex items-center p-2 border-[0.5px] rounded-lg space-x-2 bg-white hover:shadow transition-shadow duration-150">
               <div class="w-8 h-8 flex items-center justify-center rounded-md">
                 <!-- Replace this with actual icon/image if available -->
                 <img src="@/assets/img/roomBg.png" alt="icon" class="w-6 h-6 object-cover" />
               </div>
               <p class="text-[#1D2739] text-sm font-medium">{{ amenity.name }}</p>
             </div>
           </div>
   </section>
          
          <!-- View More Link -->
          <div v-if="selectedRoomObj?.features?.length > 10" class="mt-4">
            <button @click="viewMore" class="text-blue-500 text-sm font-medium hover:underline">View more</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="lg:w-1/2 space-y-6">
      <!-- Property Manager -->
      <div class="bg-[#F0F2F5] p-6 rounded-md">
        <div class="flex items-center justify-between space-x-4">
          <div class="flex items-center space-x-4">
            <img
              :src="dynamicImage(propertyManagerImage)"
              alt="Property Manager"
              class="w-10 h-10 rounded-full"
            />
            <div>
              <h3 class="font-bold text-[#1D2739]">
                <span v-if="propertyObj.agent">
                  {{ propertyObj.agent.firstName }}
                  {{ propertyObj.agent.lastName }}
                </span>
                <span v-else>Nil</span>
              </h3>
              <p class="text-xs text-[#1D2739]">Property Manager</p>
            </div>
          </div>
          <div class="ml-auto flex space-x-2">
            <button @click="makeCall" class="p-2 rounded-full">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="22" fill="#EBE5E0" />
                <path
                  d="M15.1483 21.9523C14.3583 20.5747 13.9769 19.4499 13.7469 18.3097C13.4067 16.6233 14.1852 14.976 15.4748 13.9249C16.0199 13.4806 16.6447 13.6324 16.967 14.2107L17.6946 15.5161C18.2714 16.5508 18.5598 17.0682 18.5026 17.6167C18.4454 18.1652 18.0565 18.6119 17.2786 19.5053L15.1483 21.9523ZM15.1483 21.9523C16.7474 24.7406 19.2569 27.2514 22.0483 28.8523M22.0483 28.8523C23.4259 29.6423 24.5507 30.0238 25.691 30.2538C27.3773 30.594 29.0247 29.8155 30.0757 28.5258C30.52 27.9808 30.3682 27.356 29.79 27.0337L28.4846 26.306C27.4498 25.7292 26.9325 25.4409 26.384 25.4981C25.8355 25.5552 25.3887 25.9442 24.4953 26.722L22.0483 28.8523Z"
                  stroke="#1D2739"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <path
                  d="M26.1663 14.5V21.1667M29.4997 17.8333H22.833"
                  stroke="#1D2739"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
            <button @click="sendSms" class="p-2 rounded-full">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="22" fill="#5B8469" />
                <path
                  d="M22.417 14.5031C21.6711 14.492 20.9209 14.5107 20.1915 14.5592C16.7056 14.7909 13.929 17.607 13.7005 21.1422C13.6558 21.8341 13.6558 22.5506 13.7005 23.2424C13.7837 24.53 14.3532 25.7222 15.0236 26.7288C15.4128 27.4336 15.1559 28.3132 14.7505 29.0815C14.4582 29.6355 14.312 29.9125 14.4294 30.1126C14.5467 30.3127 14.8089 30.3191 15.3332 30.3318C16.37 30.3571 17.0692 30.0631 17.6242 29.6538C17.939 29.4217 18.0964 29.3057 18.2049 29.2923C18.3133 29.279 18.5268 29.3669 18.9537 29.5427C19.3373 29.7007 19.7828 29.7982 20.1915 29.8254C21.3783 29.9043 22.6199 29.9045 23.8092 29.8254C27.295 29.5937 30.0717 26.7777 30.3002 23.2424C30.3354 22.6967 30.3428 22.1356 30.3225 21.5833"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24.5 16.5837H30.3333M27.4167 13.667V19.5003"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21.9956 22.417H22.003M25.3252 22.417H25.3327M18.666 22.417H18.6735"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <!-- <div class="mt-6">
          <button
            class="mt-4 w-full bg-[#292929] text-white py-3 text-sm rounded-md"
          >
            Send application
          </button>
        </div> -->
      </div>

      <h3
        class="text-sm text-[#1D2739] font-medium bg-white border-[0.5px] px-3 py-3 rounded-sm border-gray-100"
      >
        Neighborhood Amenities
      </h3>
      <!-- <div class="mb-4 overflow-x-auto scrollbar-hidden">
        <div class="flex space-x-2">
          <button
            v-for="type in amenityTypes"
            :key="type"
            @click="toggleVisibility(type)"
            :class="[
              'px-4 rounded text-sm',
              visibleType === type
                ? 'bg-[#EBE5E0] text-[#344054]'
                : 'bg-[#F0F2F5]',
            ]"
          >
            {{ type }}
          </button>
        </div>
      </div> -->

      <!-- <div class="overflow-x-auto scrollbar-hidden">
        <div class="mb-4 flex space-x-2 w-max">
          <button
            v-for="type in amenityTypes"
            :key="type"
            @click="toggleVisibility(type)"
            :class="[
              'px-4 py-2 rounded text-sm',
              visibleType === type
                ? 'bg-[#EBE5E0] text-[#344054]'
                : 'bg-[#F0F2F5]',
            ]"
          >
            {{ type }}
          </button>
        </div>
      </div> -->
      <div class="relative">
        <!-- Left Arrow -->
        <button
          v-if="isScrollable && showLeftArrow"
          @click="scrollLeft"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10"
        >
          &#9664;
        </button>
    
        <div class="overflow-x-auto scrollbar-hidden" ref="scrollContainer" @scroll="checkScrollPosition">
          <div class="mb-4 flex space-x-2 w-max relative">
            <button
              v-for="type in amenityTypes"
              :key="type"
              @click="toggleVisibility(type)"
              :class="[
                'px-4 py-2 rounded text-sm',
                visibleType === type ? 'bg-[#EBE5E0] text-[#344054]' : 'bg-[#F0F2F5]',
              ]"
            >
              {{ type }}
            </button>
          </div>
        </div>
    
        <!-- Right Arrow -->
        <button
          v-if="isScrollable && showRightArrow"
          @click="scrollRight"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10"
        >
          &#9654;
        </button>
      </div>

      <!-- <div
      v-for="type in amenityTypes"
      :key="type"
      v-show="visibleType === type"
    >
      <div
        v-for="amenity in groupedAmenities[type]"
        :key="amenity.id"
        class="px-4 py-2 mb-2 border-[0.5px] rounded-lg flex items-center gap-x-2"
      >
        <div class="flex items-center">
          <svg
            width="50"
            height="49"
            viewBox="0 0 50 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="0.5"
              width="48"
              height="48"
              rx="24"
              fill="white"
            />
            <rect
              x="1"
              y="0.5"
              width="48"
              height="48"
              rx="24"
              stroke="#F9FAFB"
            />
            <rect
              x="3"
              y="2.5"
              width="44"
              height="44"
              rx="22"
              fill="#F4F4F4"
            />
            <path
              d="M22.917 27C22.1549 27.1715 21.667 27.4351 21.667 27.7307C21.667 28.2476 23.1594 28.6667 25.0003 28.6667C26.8413 28.6667 28.3337 28.2476 28.3337 27.7307C28.3337 27.4351 27.8457 27.1715 27.0837 27"
              stroke="#1D2739"
              stroke-linecap="round"
            />
            <path
              d="M26.0413 23.2497C26.0413 23.825 25.575 24.2913 24.9997 24.2913C24.4244 24.2913 23.958 23.825 23.958 23.2497C23.958 22.6744 24.4244 22.208 24.9997 22.208C25.575 22.208 26.0413 22.6744 26.0413 23.2497Z"
              fill="white"
              stroke="#1D2739"
            />
            <path
              d="M25.5236 26.7887C25.383 26.924 25.1952 26.9997 24.9998 26.9997C24.8043 26.9997 24.6164 26.924 24.4759 26.7887C23.189 25.5417 21.4643 24.1486 22.3054 22.1262C22.7601 21.0327 23.8517 20.333 24.9998 20.333C26.1478 20.333 27.2393 21.0327 27.6941 22.1262C28.5341 24.1461 26.8137 25.546 25.5236 26.7887Z"
              stroke="#1D2739"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-sm text-[#1D2739]">
            {{ amenity.description }}
          </h3>
          <p class="text-sm text-[#667185]">{{ amenity.name }}</p>
        </div>
      </div>
    </div> -->
    <div
    v-for="type in amenityTypes"
    :key="type"
    v-show="visibleType === type"
    class="h-[300px] overflow-y-auto custom-scrollbar"
  >
    <div
      v-for="amenity in groupedAmenities[type]"
      :key="amenity.id"
      class="px-4 py-2 mb-2 border-[0.5px] rounded-lg flex items-center gap-x-2"
    >
      <div class="flex items-center">
        <svg
          width="50"
          height="49"
          viewBox="0 0 50 49"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="0.5" width="48" height="48" rx="24" fill="white" />
          <rect x="1" y="0.5" width="48" height="48" rx="24" stroke="#F9FAFB" />
          <rect x="3" y="2.5" width="44" height="44" rx="22" fill="#F4F4F4" />
          <path
            d="M22.917 27C22.1549 27.1715 21.667 27.4351 21.667 27.7307C21.667 28.2476 23.1594 28.6667 25.0003 28.6667C26.8413 28.6667 28.3337 28.2476 28.3337 27.7307C28.3337 27.4351 27.8457 27.1715 27.0837 27"
            stroke="#1D2739"
            stroke-linecap="round"
          />
          <path
            d="M26.0413 23.2497C26.0413 23.825 25.575 24.2913 24.9997 24.2913C24.4244 24.2913 23.958 23.825 23.958 23.2497C23.958 22.6744 24.4244 22.208 24.9997 22.208C25.575 22.208 26.0413 22.6744 26.0413 23.2497Z"
            fill="white"
            stroke="#1D2739"
          />
          <path
            d="M25.5236 26.7887C25.383 26.924 25.1952 26.9997 24.9998 26.9997C24.8043 26.9997 24.6164 26.924 24.4759 26.7887C23.189 25.5417 21.4643 24.1486 22.3054 22.1262C22.7601 21.0327 23.8517 20.333 24.9998 20.333C26.1478 20.333 27.2393 21.0327 27.6941 22.1262C28.5341 24.1461 26.8137 25.546 25.5236 26.7887Z"
            stroke="#1D2739"
          />
        </svg>
      </div>
      <div>
        <h3 class="text-sm text-[#1D2739]">
          {{ amenity.name }}
        </h3>
        <p class="text-sm text-[#667185]">{{ amenity.description }}</p>
      </div>
    </div>
  </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const propertyManagerImage = ref("shape.png");
const activeTab = ref("property-overview");
import { useCurrencyFormatter } from '@/composables/core/useCurrencyFormatter';
const router = useRouter()

const { formatCurrency } = useCurrencyFormatter('en-NG', 'NGN');
const props = defineProps({
  propertyObj: {
    type: Object,
    default: () => {},
  },
});

const selectedRoomObj = ref('')

// Function to extract images from a room object
const extractRoomImages = (room: any): string[] => {
  const allImages: string[] = [];

  // Check if the room itself has images
  if (room?.images && Array.isArray(room.images)) {
    allImages.push(...room.images);
  }

  // Extract images from features array
  if (room?.features && Array.isArray(room.features)) {
    room.features.forEach((feature: any) => {
      if (feature?.images && Array.isArray(feature.images)) {
        allImages.push(...feature.images);
      }
    });
  }

  return allImages;
};

// Function to extract all images from an array of objects that contain 'images' arrays
// const extractCommonAreaImages = (commonAreas: any[]): string[] => {
//   const allImages: string[] = [];

//   commonAreas.forEach((area) => {
//     if (area?.images && Array.isArray(area.images)) {
//       allImages.push(...area.images);
//     }
//   });

//   return allImages;
// };

const handleSelectedTab = (item: any, itemType: any) => {
  console.log(itemType, 'here op')
  activeTab.value = item

  if(itemType === 'dynamic'){
    console.log( item.name, 'here ppppp')
    activeTab.value = item.name
    selectedRoomObj.value = item
    console.log(selectedRoomObj.value, 'ghjkljhgf')
  }
}

const previewRoomImages = (itemTab: any) => {
  const selectedRoom = props.propertyObj.rooms.find((room: any) => room?.name === itemTab)
    const allImages = extractRoomImages(selectedRoom);
     console.log(allImages); // This will print all the images in the room and its features.
    // const selectedImages = images.value[tabName];
    localStorage.setItem('selectedImages', JSON.stringify(allImages));
    router.push(`/dashboard/property/${props.propertyObj.id}/room-interior-images`);
}

// Computed property to group amenities by type
const groupedAmenities = computed(() => {
  if (props?.propertyObj) {
    return props?.propertyObj?.neighbouringLandmarks?.reduce((acc, amenity) => {
      const { type } = amenity;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(amenity);
      return acc;
    }, {});
  }
});

// Method to handle 'View more' click
const viewMore = () => {
  alert('Displaying more amenities...');
};

const phoneNumber = "+1234567890"; // Replace with a dynamic number if needed

const makeCall = () => {
  window.location.href = `tel:${phoneNumber}`;
};

const sendSms = () => {
  window.location.href = `sms:${phoneNumber}`;
};

// Get all unique amenity types
const amenityTypes = computed(() => {
  if (groupedAmenities.value) {
    return Object.keys(groupedAmenities?.value);
  }
});

// State to keep track of the currently visible type
const visibleType = ref(null) as any;

// Set the first type as the default visible type
onMounted(() => {
  if (amenityTypes?.value?.length > 0) {
    visibleType.value = amenityTypes.value[0];
  }
});

// Method to toggle visibility of amenity lists
const toggleVisibility = (type: any) => {
  visibleType.value = visibleType.value === type ? null : type;
};


// const visibleType = ref<string>(''); // Visible type tracking
  const scrollContainer = ref<HTMLElement | null>(null);

const isScrollable = ref(false); // To track if the content is scrollable
const showLeftArrow = ref(false); // To track visibility of the left arrow
const showRightArrow = ref(false); // To track visibility of the right arrow

// const toggleVisibility = (type: string) => {
//   visibleType.value = type;
// };

const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -100, behavior: 'smooth' });
  }
};

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 100, behavior: 'smooth' });
  }
};

const checkScrollPosition = () => {
  if (scrollContainer.value) {
    const scrollLeft = scrollContainer.value.scrollLeft;
    const scrollWidth = scrollContainer.value.scrollWidth;
    const clientWidth = scrollContainer.value.clientWidth;

    showLeftArrow.value = scrollLeft > 0;
    showRightArrow.value = scrollLeft + clientWidth < scrollWidth;
  }
};

onMounted(() => {
  // Check if the scroll is necessary (if content overflows)
  if (scrollContainer.value) {
    const clientWidth = scrollContainer.value.clientWidth;
    const scrollWidth = scrollContainer.value.scrollWidth;

    isScrollable.value = scrollWidth > clientWidth;
    checkScrollPosition();
  }
});
</script>

<!-- Custom CSS to hide scrollbar -->
<style>
.hide-scrollbar {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

  /* Custom scrollbar styling */
  .scrollbar-hidden::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .scrollbar-hidden::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 10px;
  }
  
  .scrollbar-hidden::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-hidden {
    scrollbar-color: #ccc transparent;
    scrollbar-width: thin;
  }

  /* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px; /* Adjust the width of the scrollbar */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #ccc; /* Custom color for the scrollbar thumb */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent; /* Track color */
}

.custom-scrollbar {
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: #ccc transparent; /* For Firefox */
}
</style>
