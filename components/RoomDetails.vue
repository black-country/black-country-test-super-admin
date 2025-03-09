<template>
  <main>
    <div class="container mx-auto p-4">
      <div class="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
        <button v-for="room in rooms" :key="room.id" @click="setActiveRoom(room.name)"
          :class="{ 'bg-[#EBE5E0]': activeRoom === room.name, 'bg-white': activeRoom !== room.name }"
          class="px-4 py-2 border-[0.5px] text-[#1D2739] text-sm rounded-lg flex-shrink-0">
          {{ room.name }}
        </button>
      </div>
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-sm">Is the room furnished?</h3>
        <div class="flex space-x-2">
          <button @click="setFurnishedStatus(true)"
            :class="{ 'bg-gray-700 text-white': isRoomFurnished, 'bg-white border-gray-300': !isRoomFurnished }"
            class="px-6 py-2 text-sm rounded-md">
            Yes
          </button>
          <button @click="setFurnishedStatus(false)"
            :class="{ 'bg-gray-700 text-white': !isRoomFurnished, 'bg-white border-gray-300': isRoomFurnished }"
            class="px-6 py-2 text-sm rounded-md">
            No
          </button>
        </div>
      </div>
      <div class="mb-4">
        <h3 class="mb-2">Interior area</h3>
        <!-- {{ filteredRoomFeatures }} -->
          <!-- {{ furnishedFeatures }} -->
            <!-- {{ unfurnishedFeatures }} -->
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <label v-for="item in filteredRoomFeatures" :key="item" :for="item"
            class="flex text-sm block cursor-pointer pl-3 py-3.5 items-start gap-4 rounded-lg border transition" :class="{
              'bg-white border-2 border-[#5B8469]': isSelected(item, 'interior'),
              'border-gray-200': !isSelected(item, 'interior')
            }">
            <input type="checkbox" class="hidden rounded border-gray-300" :id="item"
              :checked="isSelected(item, 'interior')" @change="toggleSelection(item, 'interior')" />
            <div class="flex items-center gap-x-2">
              <img src="@/assets/img/roomBg.png" alt="Icon" class="w-6 h-6" />
              <span class="text-sm">{{ item }}</span>
            </div>
          </label>
        </div>
      </div>
      <div v-if="showManualInput" class="mt-4">
        <input v-model="manualInput" @keyup.enter="addManualItem" type="text" placeholder="e.g Basement"
          class="mt-1 block w-full bg-[#E4E7EC] text-sm px-3 py-3.5 border-[0.5px] outline-none border-gray-50 rounded-md" />
        <button @click="addManualItem" class="px-4 py-2 flex gap-x-2 items-center justify-center">
          Add manually
        </button>
      </div>
      <div class="mb-4">
        <h3 class="text-sm">When is the room available?</h3>
        <div class="flex space-x-2 pt-3">
          <button v-for="option in availabilityOptions" :key="option.value" @click="setAvailability(option.value)"
            :class="{ 'border-[#5B8469] text-[#5B8469] border-2 bg-white': availability === option.value, 'border-gray-200 border': availability !== option.value }"
            class="rounded-lg text-sm px-6 py-2 cursor-pointer">
            {{ option.label }}
          </button>
        </div>
      </div>

      <div v-if="availability === 'available_now'" class="mt-4 space-y-4">
        <div class="w-full mt-4">
          <label for="rentAmount" class="block text-sm font-medium mb-2">Rent Fee</label>
          <div class="flex items-center bg-[#E4E7EC] border-[0.5px] border-gray-50 rounded-md px-3 py-2">
            <select v-model="rentFrequency" class="bg-transparent py-1.5 text-sm outline-none border-none pr-2">
              <option value="monthly">Monthly</option>
              <option value="annual">Yearly</option>
              <option value="weekly">Weekly</option>
            </select>
            <input id="rentAmount" type="text" v-model="formattedRentAmount" placeholder="e.g. 1,000"
              class="bg-transparent text-sm outline-none flex-grow" @input="onInput" />
          </div>
        </div>
        <div class="pb-4">
          <PropertyAdditionalCharges
           :value="currentRoomAdditionalCharges"
             @update:additionalCharges="updateAdditionalCharges"
          />
  
        </div>
        <div class="space-y-4 mt-3">
          <CoreToggleSwitch id="applyAll" label="Apply these responses above to all remaining rooms"
            @change="applyResponsesToAllRooms" v-model="applyToAllRooms" />
          <CoreToggleSwitch id="masterBedroom" label="Set as master's bedroom" v-model="setAsMasterBedroom" />
        </div>
      </div>

      <div v-else-if="availability === 'unavailable'" class="mt-4">
        <div class="mt-4">
          <label class="block text-sm font-medium">Enter occupant’s name</label>
          <input type="text" v-model="occupantsName" placeholder="e.g Rita"
            class="mt-1 block w-full bg-[#E4E7EC] text-sm px-3 py-3.5 border-[0.5px] outline-none border-gray-50 rounded-md" />
        </div>

        <div class="w-full mt-4">
          <label class="block text-sm font-medium mb-2">Rent Fee</label>
          <div class="flex items-center bg-[#E4E7EC] border-[0.5px] border-gray-50 rounded-md px-3 py-2">
            <select v-model="rentFrequency" class="bg-transparent py-1.5 text-sm outline-none border-none pr-2">
              <option value="monthly">Monthly</option>
              <option value="annual">Yearly</option>
              <option value="weekly">Weekly</option>
            </select>
            <input id="rentAmount" type="text" v-model="formattedRentAmount" placeholder="e.g. 1,000"
              class="bg-transparent text-sm outline-none flex-grow" @input="onInput" />
          </div>
        </div>

        <div class="py-4">
          <PropertyAdditionalCharges
             :value="currentRoomAdditionalCharges"
             @update:additionalCharges="updateAdditionalCharges"
          />
  
        </div>

        <div class="space-y-4 mt-3">
          <CoreToggleSwitch id="applyAll" label="Apply these responses above to all remaining rooms"
            @change="applyResponsesToAllRooms" v-model="applyToAllRooms" />
          <CoreToggleSwitch id="masterBedroom" label="Set as master's bedroom" v-model="setAsMasterBedroom" />
        </div>
      </div>

      <div v-else-if="availability === 'available_from_date'" class="mt-4">
        <label class="block text-sm font-medium">Enter availability date</label>
        <input v-model="availabilityDate" :min="minDate" type="date"
          class="mt-1 block w-full bg-[#E4E7EC] text-sm px-3 py-3.5 border-[0.5px] outline-none border-gray-50 rounded-md" />

        <div class="mt-4">
          <label class="block text-sm font-medium">Enter occupant’s name</label>
          <input type="text" v-model="occupantsName" placeholder="e.g Rita"
            class="mt-1 block w-full bg-[#E4E7EC] text-sm px-3 py-3.5 border-[0.5px] outline-none border-gray-50 rounded-md" />
        </div>

        <div class="w-full mt-4">
          <label class="block text-sm font-medium mb-2">Rent Fee</label>
          <div class="flex items-center bg-[#E4E7EC] border-[0.5px] border-gray-50 rounded-md px-3 py-2">
            <select v-model="rentFrequency" class="bg-transparent py-1.5 text-sm outline-none border-none pr-2">
              <option value="monthly">Monthly</option>
              <option value="annual">Yearly</option>
              <option value="weekly">Weekly</option>
            </select>
            <input id="rentAmount" type="text" v-model="formattedRentAmount" placeholder="e.g. 1,000"
              class="bg-transparent text-sm outline-none flex-grow" @input="onInput" />
          </div>
        </div>

        <div class="py-4">
          <PropertyAdditionalCharges
             :value="currentRoomAdditionalCharges"
             @update:additionalCharges="updateAdditionalCharges"
          />
  
        </div>

        <div class="space-y-4 mt-3">
          <CoreToggleSwitch id="applyAll" label="Apply these responses above to all remaining rooms"
            @change="applyResponsesToAllRooms" v-model="applyToAllRooms" />
          <CoreToggleSwitch id="masterBedroom" label="Set as master's bedroom" v-model="setAsMasterBedroom" />
        </div>
      </div>
      <slot name="action-buttons"></slot>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits, computed } from 'vue';
import { useGetRoomFeatures } from '@/composables/modules/property/fetchRoomFeatures';

const { loading: loadingRoomFeatures, roomFeaturesList } = useGetRoomFeatures();

interface AdditionalCharge {
  additionalChargeId: string;
  amount: number;
}

interface RoomData {
  name: string;
  availability: string;
  availableFrom: string | null;
  occupantName: string;
  isMaster: boolean;
  rentAmount: string | number;
  rentFrequency: string;
  isFurnished: boolean;
  features: Array<any>;
  images: Array<any>;
  additionalCharges: AdditionalCharge[];
}


const props = defineProps({
  payload: {
    type: Object,
    required: true,
    default: () => ({})
  },
  roomFeaturesList: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['emitRoomData']);

const furnishedFeatures = [
  'Bedframe',
  'Mattress',
  'Desk & Chair',
  'Shelves/bookcases',
  'Wardrobes/Closet',
  'Bathroom/Restroom',
  'Window coverings',
  'Air conditioning',
  'Ceiling/Standing fan',
  'Water heating',
  'Living Room',
  'Dining Area',
  'Kitchen',
  'Laundry Area',
  'Study/Office Area',
  'Garden',
  'Swimming Pool',
  'Fitness Center',
  'Rooftop Terrace',
  'Courtyard',
  'Parking area',
  'Balcony',
  'Patio',
  'Recreational area'
];

const unfurnishedFeatures = [
  'Bathroom/Restroom',
  'Wardrobes/Closet',
  'Air conditioning space',
  'Living Room',
  'Dining Area',
  'Kitchen',
  'Laundry Area',
  'Study/Office Area',
  'Garden',
  'Swimming Pool',
  'Fitness Center',
  'Rooftop Terrace',
  'Courtyard',
  'Parking area',
  'Balcony',
  'Patio',
  'Recreational area'
];


// const furnishedFeatures = [
//   'Bedframe',
//   'Mattress',
//   'Desk & Chair',
//   'Shelves/bookcases',
//   'Wardrobes/Closet',
//   'Bathroom/Restroom',
//   'Window coverings',
//   'Air conditioning',
//   'Ceiling/Standing fan',
//   'Water heating'
// ];

// const unfurnishedFeatures = [
//   'Bathroom/Restroom',
//   'Wardrobes/Closet',
//   'Air conditioning space'
// ];


const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const agentFee = ref('80000');
const legalFee = ref('80000');
const cautionFee = ref('80000');
const serviceCharge = ref('80000');
const isCautionEnabled = ref(false);
const isServiceEnabled = ref(false);
const serviceFrequency = ref('Monthly');
const additionalCharges = ref<AdditionalCharge[]>([]);

// Reactive state
const activeRoom = ref('Room 1');
const rooms = ref([]);
const roomData = ref([]);
const isRoomFurnished = ref(true);
const availability = ref('available_now');
const availabilityDate = ref('');
const occupantsName = ref('');
const rentAmount = ref<number | null>(null);
const rentFrequency = ref<string>('monthly');
const roomFeatures = ref([]);
const setAsMasterBedroom = ref(false);
const applyToAllRooms = ref(false);
const manualInput = ref('');
const showManualInput = ref(false);
const availabilityOptions = [
  { label: 'Available Now', value: 'available_now' },
  { label: 'Not available', value: 'unavailable' },
  { label: 'Available from (specify date)', value: 'available_from_date' }
];

// Computed property to get current room's additional charges
const currentRoomAdditionalCharges = computed(() => {
  const currentRoom = roomData.value.find(room => room.name === activeRoom.value);
  return currentRoom?.additionalCharges || [];
});

const incomingAdditionalCharges = ref([]) as any


// Update the updateAdditionalCharges function
const updateAdditionalCharges = (charges: AdditionalCharge[]) => {
  incomingAdditionalCharges.value = charges
  const roomIndex = roomData.value.findIndex(room => room.name === activeRoom.value);
  if (roomIndex !== -1) {
    const updatedRoom = {
          ...roomData.value[roomIndex],
          additionalCharges: [...charges]
        };

        roomData.value[roomIndex] = updatedRoom;

// Emit the updated room data
emit('emitRoomData', roomData.value);

// Optionally, update local storage
localStorage.setItem('property_rooms', JSON.stringify(roomData.value));

    // roomData.value[roomIndex] = {
    //   ...roomData.value[roomIndex],
    //   additionalCharges: charges
    // };
    // emit('emitRoomData', roomData.value); // Emit updated data immediately
  }
};


// Modified to properly handle additional charges
const handleAdditionalChargesUpdate = (charges: AdditionalCharge[]) => {
    const roomIndex = roomData.value.findIndex(room => room.name === activeRoom.value);
    if (roomIndex !== -1) {
        roomData.value[roomIndex].additionalCharges = [...charges];
        additionalCharges.value = [...charges];
        emit('emitRoomData', roomData.value);
    }
};



// Computed property to check if any room is marked as the master bedroom
const isAnyRoomMaster = computed(() => {
  return roomData.value.some(room => room.isMaster);
});

const initializeRoomData = () => {
  const bedroomCount = props.payload.bedroomCount.value;
  
  roomData.value = props.payload.rooms.value.length === bedroomCount
    ? [...props.payload.rooms.value]
    : Array.from({ length: bedroomCount }, (_, i) => ({
        name: `Room ${i + 1}`,
        availability: 'available_now',
        availableFrom: null,
        occupantName: '',
        isMaster: false,
        rentAmount: '',
        rentFrequency: 'monthly',
        isFurnished: true,
        features: [],
        images: [],
        additionalCharges: [] // Initialize with empty additional charges array
      }));
  
  rooms.value = roomData.value;
};



    // Improved save room data method
    const saveRoomData = (roomName: string) => {
      const roomIndex = roomData.value.findIndex((room) => room?.name === roomName);
      if (roomIndex !== -1) {
        // Create a comprehensive room update
        roomData.value[roomIndex] = {
          ...roomData.value[roomIndex],
          availability: availability.value,
          availableFrom: availabilityDate.value,
          occupantName: occupantsName.value,
          rentAmount: parseInt(rentAmount.value?.toString() || '0', 10) || 0,
          rentFrequency: rentFrequency.value,
          isFurnished: isRoomFurnished.value,
          isMaster: setAsMasterBedroom.value,
          features: roomFeatures.value,
          // Preserve existing additional charges or use current state
          additionalCharges: additionalCharges.value.length 
            ? additionalCharges.value 
            : roomData.value[roomIndex].additionalCharges || []
        };

        // Emit updated room data
        emit('emitRoomData', roomData.value);

        // Update local storage
        localStorage.setItem('property_rooms', JSON.stringify(roomData.value));
      }
    };


    // Enhanced room data loading
    const loadRoomData = (roomName: string) => {
      const currentRoomData = roomData.value.find((room: RoomData) => room.name === roomName);

      if (currentRoomData) {
        // Load room-specific data
        availability.value = currentRoomData.availability;
        availabilityDate.value = currentRoomData.availableFrom || '';
        occupantsName.value = currentRoomData.occupantName || '';
        rentAmount.value = currentRoomData.rentAmount || '';
        rentFrequency.value = currentRoomData.rentFrequency || 'monthly';
        isRoomFurnished.value = currentRoomData.isFurnished;
        setAsMasterBedroom.value = currentRoomData.isMaster;
        roomFeatures.value = currentRoomData.features || [];
        
        // Ensure additional charges are loaded correctly
        additionalCharges.value = currentRoomData.additionalCharges || [];
      }
    };



// Filter features based on the furnished status
const filterFeatures = () => {
  const requiredFeatures = isRoomFurnished.value ? furnishedFeatures : unfurnishedFeatures;
  // Clear all features not relevant to the current furnishing status
  roomFeatures.value = roomFeatures.value.filter(feature => requiredFeatures.includes(feature.name));
};

// Set active room and save/load data
const setActiveRoom = (roomName: string) => {
  saveRoomData(activeRoom.value);
  activeRoom.value = roomName;
  loadRoomData(roomName);
};


// Method to format the input value in real-time
function onInput(event) {
  rentAmount.value = unformatCurrency(event.target.value);
  event.target.value = formatCurrency(rentAmount.value);
}

const formattedRentAmount = computed({
  get() {
    return rentAmount.value ? formatCurrency(rentAmount.value) : '';
  },
  set(value) {
    rentAmount.value = unformatCurrency(value);
  }
});

// Manually add an item to the room features list
const addManualItem = () => {
  const trimmedInput = manualInput.value.trim();
  if (trimmedInput) {
    roomFeatures.value.push({ name: trimmedInput, images: [] });
    manualInput.value = '';
    showManualInput.value = false;
    saveRoomData(activeRoom.value);
  }
};

// Toggle selection of room features
const toggleSelection = (item: string) => {
  const index = roomFeatures.value.findIndex((feature) => feature.name === item);
  index > -1 ? roomFeatures.value.splice(index, 1) : roomFeatures.value.push({ name: item, images: [] });
  saveRoomData(activeRoom.value);
};

// Check if a feature is selected
const isSelected = (item: string) => roomFeatures.value.some((feature) => feature.name === item);

// Watch changes to roomData and update the payload
watch(roomData, (newData) => {
  console.log(newData, 'room data has been updatd')
  props.payload.rooms.value = newData;
}, { deep: true });

const setFurnishedStatus = (status: boolean) => {
  isRoomFurnished.value = status;
  filterFeatures(); // Filter features based on the new status

  const requiredFeatures = isRoomFurnished.value ? furnishedFeatures : unfurnishedFeatures;
  roomFeatures.value = roomFeatures.value.filter(feature => requiredFeatures.includes(feature.name));

  saveRoomData(activeRoom.value);
};

// Set the availability status of the room
const setAvailability = (value: string) => {
  availability.value = value;
  if (value === 'available_now') {
    occupantsName.value = '';
    availabilityDate.value = '';
  } else if (value === 'unavailable') {
    availabilityDate.value = '';
  } else if (value === 'available_from_date') {
    occupantsName.value = '';
  }
  saveRoomData(activeRoom.value);
};

const applyResponsesToAllRooms = () => {
  const currentRoom = roomData.value.find(room => room.name === activeRoom.value);
  if (!currentRoom) return;

  roomData.value.forEach(room => {
    if (room.name !== activeRoom.value) {
      Object.assign(room, {
        availability: availability.value,
        availableFrom: availabilityDate.value,
        occupantName: occupantsName.value,
        rentAmount: Number(rentAmount.value),
        rentFrequency: rentFrequency.value,
        isFurnished: isRoomFurnished.value,
        features: roomFeatures.value.map(feature => ({
          ...feature,
          images: [] // Set images to an empty array for each room
        })),
        additionalCharges: [...currentRoom.additionalCharges]
      });
    }
  });
  emit('emitRoomData', roomData.value);
  localStorage.setItem('property_rooms', JSON.stringify(roomData.value));
};

const filteredRoomFeatures = computed(() => {
  return isRoomFurnished.value ? furnishedFeatures : unfurnishedFeatures;
});


// Helper function to format currency
function formatCurrency(value: number | string): string {
  const numericValue = typeof value === 'number' ? value.toString() : value.replace(/[^\d]/g, '');
  const [integerPart, decimalPart] = numericValue.split('.');
  const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');
  return decimalPart ? `${formattedInteger}.${decimalPart.slice(0, 2)}` : formattedInteger;
}

// Helper function to remove formatting and get raw value
function unformatCurrency(value: string): number {
  return parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
}

onMounted(() => {
  initializeRoomData();
  loadRoomData(activeRoom.value);

  if (rooms.value.length > 0) {
    activeRoom.value = rooms.value[0].name; // Set the first room as active
    loadRoomData(activeRoom.value); // Load data for the active room
  }
});
</script>




<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>