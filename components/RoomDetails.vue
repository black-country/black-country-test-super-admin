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
              <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <label v-for="item in filteredRoomFeatures" :key="item" :for="item"
                      class="flex text-sm block cursor-pointer pl-3 py-3.5 items-start gap-4 rounded-lg border transition"
                      :class="{
                          'bg-white border-2 border-[#5B8469]': isSelected(item, 'interior'),
                          'border-gray-200': !isSelected(item, 'interior')
                      }">
                      <input type="checkbox" class="hidden rounded border-gray-300" :id="item"
                          :checked="isSelected(item, 'interior')" @change="toggleSelection(item, 'interior')" />
                      <div class="flex items-center gap-x-2">
                          <img src="@/assets/img/roomBg.png" alt="Icon" class="md:w-6 w-5 md:h-6 h-5" />
                          <span class="text-xs md:text-sm">{{ item }}</span>
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
              <div class="md:flex space-x-2 pt-3 grid grid-cols-2 md:gap-0 gap-2">
                  <button v-for="option in availabilityOptions" :key="option.value"
                      @click="setAvailability(option.value)"
                      :class="{ 'border-[#5B8469] text-[#5B8469] border-2 bg-white': availability === option.value, 'border-gray-200 border': availability !== option.value }"
                      class="rounded-lg text-sm px-6 py-2 cursor-pointer w-full md:w-auto">
                      {{ option.label }}
                  </button>
              </div>
          </div>

          <div v-if="availability === 'available_now'" class="mt-4 space-y-4">
              <div class="w-full mt-4">
                  <label for="rentAmount" class="block text-sm font-medium mb-2">Rent Fee</label>
                  <div class="flex items-center bg-[#E4E7EC] border-[0.5px] border-gray-50 rounded-md px-3 py-2">
                      <select v-model="rentFrequency"
                          class="bg-transparent py-1.5 text-sm outline-none border-none pr-2">
                          <option value="monthly">Monthly</option>
                          <option value="annual">Yearly</option>
                          <option value="weekly">Weekly</option>
                      </select>
                      <input id="rentAmount" type="text" v-model="formattedRentAmount" placeholder="e.g. 1,000"
                          class="bg-transparent text-sm outline-none flex-grow" @input="onInput" />
                  </div>
              </div>
              <div class="pb-4">
                  <PropertyAdditionalCharges :value="currentRoomAdditionalCharges"
                      @update:additionalCharges="updateAdditionalCharges" />

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
                      <select v-model="rentFrequency"
                          class="bg-transparent py-1.5 text-sm outline-none border-none pr-2">
                          <option value="monthly">Monthly</option>
                          <option value="annual">Yearly</option>
                          <option value="weekly">Weekly</option>
                      </select>
                      <input id="rentAmount" type="text" v-model="formattedRentAmount" placeholder="e.g. 1,000"
                          class="bg-transparent text-sm outline-none flex-grow" @input="onInput" />
                  </div>
              </div>

              <div class="py-4">
                  <PropertyAdditionalCharges :value="currentRoomAdditionalCharges"
                      @update:additionalCharges="updateAdditionalCharges" />

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
                      <select v-model="rentFrequency"
                          class="bg-transparent py-1.5 text-sm outline-none border-none pr-2">
                          <option value="monthly">Monthly</option>
                          <option value="annual">Yearly</option>
                          <option value="weekly">Weekly</option>
                      </select>
                      <input id="rentAmount" type="text" v-model="formattedRentAmount" placeholder="e.g. 1,000"
                          class="bg-transparent text-sm outline-none flex-grow" @input="onInput" />
                  </div>
              </div>

              <div class="py-4">
                  <PropertyAdditionalCharges :value="currentRoomAdditionalCharges"
                      @update:additionalCharges="updateAdditionalCharges" />

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

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

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

const currentRoomAdditionalCharges = computed(() => {
  const currentRoom = roomData.value.find(room => room.name === activeRoom.value);
  return currentRoom?.additionalCharges || [];
});

const updateAdditionalCharges = (charges: AdditionalCharge[]) => {
  const roomIndex = roomData.value.findIndex(room => room.name === activeRoom.value);
  if (roomIndex !== -1) {
      const chargesCopy = JSON.parse(JSON.stringify(charges));
      const updatedRoom = {
          ...roomData.value[roomIndex],
          additionalCharges: chargesCopy
      };
      roomData.value.splice(roomIndex, 1, updatedRoom);
      emit('emitRoomData', roomData.value);
      localStorage.setItem('property_rooms', JSON.stringify(roomData.value));
  }
};

const isAnyRoomMaster = computed(() => {
  return roomData.value.some(room => room.isMaster);
});

const initializeRoomData = () => {
  const bedroomCount = props.payload.bedroomCount?.value || 0;
  if (props.payload.rooms?.value?.length === bedroomCount) {
      roomData.value = props.payload.rooms.value.map(room => JSON.parse(JSON.stringify(room)));
  } else {
      roomData.value = Array.from({ length: bedroomCount }, (_, i) => ({
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
          additionalCharges: []
      }));
  }
  rooms.value = [...roomData.value];
};

const saveRoomData = (roomName: string) => {
  const roomIndex = roomData.value.findIndex((room) => room?.name === roomName);
  if (roomIndex !== -1) {
      const currentCharges = roomData.value[roomIndex].additionalCharges || [];

      roomData.value[roomIndex] = {
          ...roomData.value[roomIndex],
          availability: availability.value,
          availableFrom: availabilityDate.value,
          occupantName: occupantsName.value,
          rentAmount: parseInt(rentAmount.value?.toString() || '0', 10) || 0,
          rentFrequency: rentFrequency.value,
          isFurnished: isRoomFurnished.value,
          isMaster: setAsMasterBedroom.value,
          features: JSON.parse(JSON.stringify(roomFeatures.value)),
          additionalCharges: JSON.parse(JSON.stringify(currentCharges))
      };
      emit('emitRoomData', roomData.value);
      localStorage.setItem('property_rooms', JSON.stringify(roomData.value));
  }
};

const loadRoomData = (roomName: string) => {
  const currentRoomData = roomData.value.find((room: RoomData) => room.name === roomName);
  if (currentRoomData) {
      availability.value = currentRoomData.availability;
      availabilityDate.value = currentRoomData.availableFrom || '';
      occupantsName.value = currentRoomData.occupantName || '';
      rentAmount.value = currentRoomData.rentAmount || '';
      rentFrequency.value = currentRoomData.rentFrequency || 'monthly';
      isRoomFurnished.value = currentRoomData.isFurnished;
      setAsMasterBedroom.value = currentRoomData.isMaster;

      roomFeatures.value = JSON.parse(JSON.stringify(currentRoomData.features || []));
  }
};

const filterFeatures = () => {
  const requiredFeatures = isRoomFurnished.value ? furnishedFeatures : unfurnishedFeatures;
  roomFeatures.value = roomFeatures.value.filter(feature => requiredFeatures.includes(feature.name));
};

const setActiveRoom = (roomName: string) => {
  saveRoomData(activeRoom.value);
  activeRoom.value = roomName;
  loadRoomData(roomName);
};

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

const addManualItem = () => {
  const trimmedInput = manualInput.value.trim();
  if (trimmedInput) {
      roomFeatures.value.push({ name: trimmedInput, images: [] });
      manualInput.value = '';
      showManualInput.value = false;
      saveRoomData(activeRoom.value);
  }
};

const toggleSelection = (item: string) => {
  const index = roomFeatures.value.findIndex((feature) => feature.name === item);
  index > -1 ? roomFeatures.value.splice(index, 1) : roomFeatures.value.push({ name: item, images: [] });
  saveRoomData(activeRoom.value);
};

const isSelected = (item: string) => roomFeatures.value.some((feature) => feature.name === item);

watch(roomData, (newData) => {
  if (props.payload.rooms) {
      props.payload.rooms.value = JSON.parse(JSON.stringify(newData));
  }
}, { deep: true });

const setFurnishedStatus = (status: boolean) => {
  isRoomFurnished.value = status;
  filterFeatures();

  const requiredFeatures = isRoomFurnished.value ? furnishedFeatures : unfurnishedFeatures;
  roomFeatures.value = roomFeatures.value.filter(feature => requiredFeatures.includes(feature.name));

  saveRoomData(activeRoom.value);
};

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
  saveRoomData(activeRoom.value);
  const currentRoom = roomData.value.find(room => room.name === activeRoom.value);
  if (!currentRoom) return;
  const newRoomData = [...roomData.value];

  newRoomData.forEach((room, index) => {
      if (room.name !== activeRoom.value) {
          const deepCopiedCharges = JSON.parse(JSON.stringify(currentRoom.additionalCharges || []));

          newRoomData[index] = {
              ...room,
              availability: currentRoom.availability,
              availableFrom: currentRoom.availableFrom,
              occupantName: currentRoom.occupantName,
              rentAmount: currentRoom.rentAmount,
              rentFrequency: currentRoom.rentFrequency,
              isFurnished: currentRoom.isFurnished,
              features: JSON.parse(JSON.stringify(currentRoom.features || [])),
              additionalCharges: deepCopiedCharges
          };
      }
  });
  roomData.value = newRoomData;
  emit('emitRoomData', roomData.value);
  localStorage.setItem('property_rooms', JSON.stringify(roomData.value));
};

const filteredRoomFeatures = computed(() => {
  return isRoomFurnished.value ? furnishedFeatures : unfurnishedFeatures;
});

function formatCurrency(value: number | string): string {
  if (!value && value !== 0) return '';
  const numericValue = typeof value === 'number' ? value.toString() : value.replace(/[^\d]/g, '');
  const [integerPart, decimalPart] = numericValue.split('.');
  const formattedInteger = parseInt(integerPart || '0', 10).toLocaleString('en-US');
  return decimalPart ? `${formattedInteger}.${decimalPart.slice(0, 2)}` : formattedInteger;
}

function unformatCurrency(value: string): number {
  return parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
}

onMounted(() => {
  initializeRoomData();

  if (rooms.value.length > 0) {
      activeRoom.value = rooms.value[0].name;
      loadRoomData(activeRoom.value);
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