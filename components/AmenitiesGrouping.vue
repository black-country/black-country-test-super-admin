<template>
    <section>
        <div class="">
            <!-- Render buttons for each type -->
            <div class="mb-4 flex space-x-2">
              <button
                v-for="type in amenityTypes"
                :key="type"
                @click="toggleVisibility(type)"
                :class="[
                  'px-4 py-2 rounded text-sm',
                  visibleType === type
                    ? 'bg-gray-300 text-[#344054]'
                    : 'bg-gray-200',
                ]"
              >
                {{ type }}
              </button>
            </div>
    
            <!-- Render amenities based on selected type -->
            <div
              v-for="type in amenityTypes"
              :key="type"
              v-show="visibleType === type"
            >
              <div
                v-for="amenity in groupedAmenities[type]"
                :key="amenity.id"
                class="p-4 mb-2 border-[0.5px] rounded-lg flex items-center gap-x-2"
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
                  <h3 class="font-xs text-[#1D2739] font-medium">
                    {{ amenity.description }}
                  </h3>
                  <p class="text-sm text-[#667185]">{{ amenity.address }}</p>
                </div>
              </div>
            </div>
          </div>
    </section>
</template>

<script setup lang="ts">
const propertyManagerImage = ref("shape.png");
const activeTab = ref("property-overview");
const props = defineProps({
  propertyObj: {
    type: Object,
    default: () => {},
  },
});

const selectedRoomObj = ref('')

const handleSelectedTab = (item: any, itemType: any) => {
  activeTab.value = item

  if(itemType === 'dynamic'){
    activeTab.value = item.name
    selectedRoomObj.value = item
  }
}

// Computed property to group amenities by type
const groupedAmenities = computed(() => {
  if (props?.propertyObj) {
    return props?.propertyObj?.neighbouringLandmarks?.value.reduce((acc, amenity) => {
      const { type } = amenity;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(amenity);
      return acc;
    }, {});
  }
});


// Sample list of amenities (replace or modify this as needed)

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
</style>
