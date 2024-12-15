<template>
<main>
              <!-- Property Description -->
              <h2  class="text-base text-[#1D2739] font-medium bg-white border-[0.5px] py-3 px-3 rounded-sm border-gray-50">Property Description</h2>
              <!-- <div class="pt-4 bg-white rounded-lg border-gray-50 p-3 border-[0.5px] text-sm">
                <p class="text-[#1D2739] mt-2  leading-snug text-sm">
                  {{property.description ?? 'Nil'}}
                  <a v-if="property?.description?.length > 50" href="#" class="text-blue-500">View more</a>
                </p>
              </div> -->
              <div class="pt-4 bg-white rounded-lg border-gray-50 p-3 border-[0.5px] text-sm">
                <p class="text-[#1D2739] mt-2 leading-snug text-sm">
                  {{ isExpanded ? property.description : truncatedText }}
                  <a v-if="property?.description?.length > 800" href="#" @click.prevent="toggleView" class="text-blue-500">
                    {{ isExpanded ? 'View less' : 'View more' }}
                  </a>
                </p>
              </div>
        
              <!-- Property Highlights -->
              <h3 class="text-base text-[#1D2739] font-medium bg-white border-[0.5px] py-3 px-3 rounded-sm border-gray-50">Property Highlights</h3>
              <div class="">
                <div class="gap-4 space-y-6 bg-white rounded-lg border-gray-50 p-3 border-[0.5px] text-sm">
              <div class="flex justify-between items-center">
                  <div class="text-[#667185]">Property size <span class="font-medium text-[#1D2739]">{{property?.size ?? 'Nil'}} {{property?.sizeUnit ?? 'Nil'}}</span></div>
                  <div class="text-[#667185]">Flooring type <span class="font-medium text-[#1D2739]">{{property?.flooringType?.name ?? 'Nil'}}</span></div>
              </div>
            <div class="flex justify-between items-center">
              <div class="text-[#667185]">Number of bedrooms <span class="font-medium text-[#1D2739]">{{property?.bedroomCount ?? 'Nil'}}</span></div>
              <div class="text-[#667185]">Number of bathrooms <span class="font-medium text-[#1D2739]d">{{property?.bathroomCount ?? 'Nil'}}</span></div>
            </div>
                  <div class="text-[#667185]">Floor number <span class="font-medium text-[#1D2739]">{{property?.floorNumber ?? 'Nil'}}</span></div>
            <div class="flex justify-between items-center">
              <div class="text-[#667185]">Architecture <span class="font-medium text-[#1D2739]">{{property?.houseType?.name ?? 'Nil'}}</span></div>
              <div class="text-[#667185]">{{property?.availableRoomsCount ?? 'Nil'}} rooms available <span class="text-[#326543]">Now</span></div>
            </div>
                </div>
        
                <!-- Co-living with -->
                  <h2 class="text-sm font-medium text-[#667185] mt-6 border-[0.5px] py-3 px-3 rounded-lg border-gray-50 text-sm text-[#1D2739] font-medium bg-white border-[0.5px] px-3 py-3 rounded-sm border-gray-100">Co-living with 
                    
                    <!-- <span class="text-[#1D2739]">{{occupiedRoomsCount ?? 'Nil'}} Person {{occupiedRoomsCount > 1 ? 's' : ''}}</span> -->
                    <span class="text-[#1D2739]">{{property?.bedroomCount - 1}} Persons</span>
                  </h2>

                <div>
                  <table class="w-full mt-2 table-fixed text-sm">
                    <thead>
                      <tr class="bg-[#F9FAFB] rounded-lg">
                        <th class="text-left text-sm py-3 pl-6 font-medium text-[#1D2739]">Occupants</th>
                        <th class="text-left text-sm py-3 font-medium text-[#1D2739]">Room occupied</th>
                        <th class="text-left text-sm py-3 font-medium text-[#1D2739]">Available from</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(room, index) in formattedRoomData" :key="index">
                        <td class="text-[#1D2739] py-3 pl-6">{{ room.occupant }}</td>
                        <td class="text-[#1D2739] py-3">{{ room.roomOccupied }}</td>
                        <td class="text-[#1D2739] py-3">{{ room.availableFrom }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
        
              <!-- Property Visitation -->
              <h2 v-if="property?.visitations?.length" class="text-sm font-medium text-[#667185] mt-6 border-[0.5px] py-3 px-3 rounded-lg border-gray-50">Property visitation</h2>
              <div v-if="property?.visitations?.length"  class="rounded-md border-[0.5px] border-gray-50 bg-white">
                <table class="w-full mt-2 table-fixed text-sm">
                  <thead>
                    <tr class="bg-[#F9FAFB] rounded-lg">
                      <th class="text-left py-3 text-[#667185] pl-4">Day</th>
                      <th class="text-left py-3 text-[#667185]">Time</th>
                    </tr>
                  </thead>
                  <tbody class="space-y-6">
                    <tr class="">
                      <td class="text-[#1D2739] py-3  pl-4">Monday</td>
                      <td class="text-[#1D2739] py-3 ">10:00 AM</td>
                    </tr>
                    <tr class="">
                      <td class="text-[#1D2739] py-3  pl-4">Tuesday</td>
                      <td class="text-[#1D2739] py-3 ">10:00 AM</td>
                    </tr>
                    <tr class="">
                      <td class="text-[#1D2739] py-3  pl-4">Wednesday</td>
                      <td class="text-[#1D2739] py-3 ">10:00 AM</td>
                    </tr>
                  </tbody>
                </table>
               <div class="mt-5">
                  <button @click="showBookingModal = true" class="mt-4 w-full bg-[#292929]  text-white py-4 rounded-md">Schedule a visit</button>
               </div>
              </div>
        
              <!-- House Rules -->
              <h2 v-if="property?.rules?.length" class="text-sm font-medium text-[#1D2739] mt-6 border-[0.5px] py-3 px-3 rounded-lg border-gray-50">House Rules</h2>
              <div class="">
                <ul v-if="property?.rules?.length" class="space-y-1">
                  <div class="flex justify-between items-center">
                    <p class="border-[0.5px] rounded-lg border-gray-50 py-3 text-sm pl-4">{{property?.rules[0]?.rule }}</p>
                    <p>{{property?.rules[0]?.answer}}</p>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="border-[0.5px] rounded-lg border-gray-50 py-3 text-sm pl-4">{{property?.rules[1]?.rule }}</p>
                    <p>{{property?.rules[1]?.answer}}</p>
                  </div>
                  <div v-if="otherRules?.length" class="border-[0.5px] rounded-lg border-gray-50 py-3">
                      <p class="py-3 text-sm pl-4">Other rules</p>
                    <div class="pl-5">
                      <ul class="list-disc ml-5 space-y-4 text-sm">
                      <li v-for="(item, idx) in otherRules" :key="idx" class="text-[#1D2739] leading-snug">{{item.rule}}</li>
                       </ul>
                    </div>
                  </div>
                </ul>
              </div>

              <CoreModal
              :isOpen="showBookingModal"
              @close="showBookingModal = false"
              >
                <BookingModal class="lg:w-4/12 m-6 lg:m-0" />
              </CoreModal>
</main>
</template>

<script setup lang="ts">
import { useRoomOccupantCount } from '@/composables/core/useRoomOccupantCount';
const showBookingModal = ref(false);
const props = defineProps({
    property: {
      type: Object,
      default: () => {}
    }
  })

  const otherRules = computed(() => {
    if(props.property.rules.length > 2){
      return props.property.rules.slice(2)
    }
  })


  console.log(props.property.rooms)
  const { occupiedRoomsCount } = useRoomOccupantCount(props?.property?.rooms);


  // Computed property to format room data
const formattedRoomData = computed(() => {
if(props.property.rooms){
  return props.property.rooms.map(room => {
    return {
      occupant: room.occupantName || "No occupant",
      roomOccupied: room.name,
      availableFrom: room.availability === "available_now"
        ? "Available now"
        : room.availableFrom
          ? new Date(room.availableFrom).toLocaleDateString()
          : "Not available"
    };
  });
}
});

// Reactive state to track if the full text is expanded
const isExpanded = ref(false);

// Computed property to get the truncated text
const truncatedText = computed(() => {
  return props?.property?.description?.length > 800 
    ? props?.property?.description.substring(0, 800) + '...' 
    : props?.property?.description;
});

// Function to toggle the view between expanded and truncated text
const toggleView = () => {
  isExpanded.value = !isExpanded.value;
};
</script>
