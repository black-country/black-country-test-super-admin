<template>
  <Layout>
    <template #header-content>
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
          <div class="flex items-center gap-x-4">
            <button @click="router.back()" class="text-[#1D2739] flex items-center gap-x-3 px-4 py-3 text-sm bg-gray-50 rounded-md">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 5C12.5 5 7.50001 8.68242 7.5 10C7.49999 11.3177 12.5 15 12.5 15" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              Back</button>
          <p v-if="!loading && Object.keys(memberObj).length">{{memberObj?.firstName ?? 'Nil'}} {{memberObj?.lastName ?? 'Nil'}}</p>
          </div>
          <div v-if="!loading && Object.keys(memberObj).length" class="flex items-center gap-x-4 lg:gap-x-6">
           <button @click="deleteModal = true" class="bg-[#F9FAFB] text-[#292929] text-sm px-6 py-2.5 rounded-lg">Remove User</button>
           <button @click="deactivateModal = true" class="bg-[#292929] text-white text-sm px-6 py-2.5 rounded-lg">Deactivate User</button>
          </div>
        </div>
      </template>
    <div v-if="Object.keys(memberObj).length && !loading" class="min-h-screen flex justify-center">
      <div class="w-full grid grid-cols-12 gap-8">
  
        <!-- Profile and Recent Activity Section -->
        <aside class="col-span-4 rounded-lg p-6  space-y-7">
         <section class="bg-white rounded-lg p-4">
            <div class="text-center mb-6">
                <img
                v-if="memberObj.profilePicture"
                :src="memberObj.profilePicture"
                alt="User profile picture"
                class="mx-auto rounded-full h-20 w-20"
              />
              <img
              v-else
              :src="dynamicImage('avatar.png')"
              alt="User profile picture"
              class="mx-auto rounded-full h-20 w-20"
            />
                <h2 class="mt-4 text-lg font-semibold text-gray-900">{{memberObj?.firstName ?? 'Nil'}} {{memberObj?.lastName ?? 'Nil'}}</h2>
                <p class="text-sm text-[#667185]">Agent</p>
              </div>
              <ul class="space-y-4 text-sm text-gray-600">
                <li class="flex justify-between items-center text-sm text-[#1D2739]">
                  <span class="font-medium text-[#667185] text-sm">Last active:</span> {{memberObj?.createdAt ?? 'Nil'}}
                </li>
                <li class="flex justify-between items-center text-sm text-[#1D2739]">
                  <span class="font-medium text-[#667185] text-sm">Email:</span> {{memberObj?.email ?? 'Nil'}}
                </li>
                <li class="flex justify-between items-center text-sm text-[#1D2739]">
                  <span class="font-medium text-[#667185] text-sm">Phone number:</span> {{memberObj?.phone ?? 'Nil'}}
                </li>
                <li class="flex justify-between items-center text-sm text-[#1D2739]">
                  <span class="font-medium text-[#667185] text-sm">Location:</span> {{memberObj?.address ?? 'Nil'}}
                </li>
              </ul>
         </section>
  
          <!-- Recent Activity Section -->
          <!-- <div class="mt-8">
            <h3 class="font-semibold text-gray-900 mb-4">Recent activity</h3>
            <ul class="space-y-4">
              <li class="flex items-start">
                <span class="mr-2 mt-1 w-2 h-2 rounded-full bg-blue-500"></span>
                <div class="text-sm text-gray-600">
                  <p>Vickie Will assigned Cummings, Frami and Lynch apartments to agent Adetunde Salami</p>
                  <p class="text-xs text-gray-400 mt-1">5th April, 2024 | 11:54 am</p>
                </div>
              </li>
            </ul>
          </div> -->
     <div class="space-y-3">
        <div class="py-5 bg-white rounded-lg text-sm pl-4">
            <p>Recent activities</p>
          </div>
          <div class="overflow-hidden rounded-lg">
            <section v-if="membersActivities.length" class="bg-white border rounded-lg border-gray-50 px-4 py-5 sm:p-6">
                <div v-for="(item, idx) in membersActivities" :key="idx" class="flex gap-x-3 border-b last:border-b-0 border-gray-25 py-4">
                    <div>
                     <svg width="8" height="60" viewBox="0 0 8 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <circle cx="4" cy="4" r="4" fill="#6A9AEB"/>
                         <line x1="4.5" y1="12" x2="4.5" y2="60" stroke="#6A9AEB" stroke-dasharray="2 2"/>
                         </svg>   
                    </div>
                   <div class="space-y-0.5">
                     <p class="text-sm text-[#1D2739] max-w-lg">{{item.description}}</p>    
                     <p class="text-sm text-gray-500 font-light">{{item.date}}</p>         
                   </div>
             </div>
            </section>
            <div v-else
            class="bg-white border rounded-lg border-gray-50 px-4 py-5 sm:p-6 h-80 flex flex-col gap-y-4 justify-center items-center">
            <img :src="dynamicIcons('activities-empty-state')" alt="leases empty state" class="" />
            <p class="text-[#1D2739]">No recent activities</p>
          </div>
          </div>
     </div>
        </aside>
  
        <main class="col-span-8 space-y-6">
            <!-- Statistics Section -->
            <div class="w-full lg:max-w-5xl lg:flex p-3 border border-gray-25 rounded-lg bg-white">
                <div v-for="(item, idx) in firstSection" :key="idx" class="h-32 cursor-pointer space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
                  <div class="flex justify-end items-end ">
                    <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
                  </div>
                  <div>
                    <p class="text-[#1D2739] font-semibold text-2xl">{{item.value}}</p>
                    <h6 class="text-[#667185] font-medium text-sm">{{item.label}}</h6>
                  </div>
                </div>
              </div>
    
            <!-- Availability Calendar Section -->
            <div class="py-5 bg-white rounded-lg text-sm pl-4">
                <h3 class="font-semibold text-gray-900">Availability</h3>
            </div>
            <div class="bg-white rounded-lg py-4">
              <div class="flex justify-between items-center mb-4 px-10">
                <h4 class="font-medium text-gray-600">{{ monthName }} {{ year }}</h4>
                <div class="flex space-x-2">
                  <button @click="prevMonth" class="p-1 ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        
                  </button>
                  <button @click="nextMonth" class="p-1 ">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-7 text-center text-gray-600">
                <div>SUN</div>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
                <!-- Calendar Days -->
                <div v-for="day in calendarDays" :key="day.date" class="py-2">
                  <span  class="text-[#5B8469] font-semibold" >{{ day.day }}</span>
                </div>
              </div>
            </div>
          </main>
      </div>
    </div>

    <section v-else>
      <div class="rounded-md p-4 w-full mx-auto">
        <div class="animate-pulse flex space-x-4 h-44 w-full bg-slate-200 rounded">
        </div>
      </div>
     </section>

    <CoreReusableModal :loading="deactivating" :isOpen="deactivateModal" @close="deactivateModal = false" @confirm="handleDeactivateConfirm"
    :title="`${memberObj.isActive ? 'Deactivate' : 'Activate'} Member`" :message="`${memberObj.isActive ? 'Deactivating this member will make it unavailable for new inquiries and listings. You can reactivate it at any time.' : 'Activating this member will make it available.. You can de-activate it at any time.'}`"
    :confirmButtonText="`${memberObj.isActive ? 'Yes, deactivate' : 'Yes, Activate'}`" cancelButtonText="Cancel" />

    <CoreReusableModal :loading="deleting" :isOpen="deleteModal" @close="deleteModal = false" @confirm="handleDeleteConfirm"
    title="Remove Member" :message="`By deleting ${memberObj.firstName} ${memberObj.lastName}, you will permanently remove this member from the platform. Are you sure you want to proceed?`" confirmButtonText="Yes, delete"
    cancelButtonText="Cancel" />
  </Layout>
  </template>
  
  <script lang="ts" setup>
  import Layout from '@/layouts/dashboard.vue';
  import { useFetchMemberDetails } from '@/composables/modules/member/details'
    import { dynamicImage } from "@/utils/assets";
    import { useDeleteMember } from '@/composables/modules/member/delete'
import { useDeactivateMember } from '@/composables/modules/member/deactivate'
const { deleteMember, loading: deleting } = useDeleteMember()
const {  deactivateMember, loading: deactivating } = useDeactivateMember()
const {  memberObj, loading } = useFetchMemberDetails()
const router = useRouter()

const firstSection = ref([
  { icon: 'total-properties', value: '0', label: 'Total Listings' },
  { icon: 'total-tenants', value: '0', label: 'Properties rented out' },
  { icon: 'total-income', value: '0', label: 'Rooms rented out' },
])

const handleDeleteConfirm = async () => {
  if (memberObj.value.id) {                                
    await deleteMember(memberObj.value.id).then(() => {
      deleteModal.value = false;
     router.push(`/dashboard/members/${memberObj.value.id}/delete-success`)
    })
  }
};


const handleDeactivateConfirm = async () => {
  try {
    const actionType = memberObj.value.isActive ? 'deactivate' : 'activate';
    const successRoute = memberObj.value.isActive 
      ? `/dashboard/members/${memberObj.value.id}/deactivate-success` 
      : `/dashboard/members/${memberObj.value.id}/activate-success`;

    await deactivateMember(memberObj.value.id, actionType); // Wait for the action to complete

    deactivateModal.value = false; // Close the modal
    router.push(successRoute); // Navigate to the success page
  } catch (error) {
    useNuxtApp().$toast.error("Error processing member action.", {
      autoClose: 5000,
      dangerouslyHTMLString: true,
    });
  }
};

const deleteModal = ref(false);
const deactivateModal = ref(false);


const membersActivities = ref([
  {
    description:
      "Vickie Will assigned Cummings, Frami and Lynch apartments to agent Adetunde Salami",
    date: "5th April, 2024 | 11:54 am",
  },
  {
    description:
      "Vickie Will assigned Cummings, Frami and Lynch apartments to agent Adetunde Salami",
    date: "5th April, 2024 | 11:54 am",
  },
  {
    description:
      "Vickie Will assigned Cummings, Frami and Lynch apartments to agent Adetunde Salami",
    date: "5th April, 2024 | 11:54 am",
  },
  {
    description:
      "Vickie Will assigned Cummings, Frami and Lynch apartments to agent Adetunde Salami",
    date: "5th April, 2024 | 11:54 am",
  },
  {
    description:
      "Vickie Will assigned Cummings, Frami and Lynch apartments to agent Adetunde Salami",
    date: "5th April, 2024 | 11:54 am",
  },
]);

  
  // Current date state
  const current = new Date();
  const year = ref(current.getFullYear());
  const month = ref(current.getMonth()); // 0 is January, 11 is December
  
  // Names of the months
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Computed Member to get the current month's name
  const monthName = computed(() => monthNames[month.value]);
  
  // Function to get the number of days in the current month
  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Function to get the first day of the month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Function to generate the calendar days for the current month
  const generateCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(month.value, year.value);
    const firstDay = firstDayOfMonth(month.value, year.value);
  
    // Add empty days at the start of the month to align the first day correctly
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', date: null });
    }
  
    // Add the days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, date: new Date(year.value, month.value, i) });
    }
  
    return days;
  };
  
  // Computed Member to get the days in the current month
  const calendarDays = computed(() => generateCalendarDays());
  
  // Functions to navigate between months
  const prevMonth = () => {
    if (month.value === 0) {
      month.value = 11;
      year.value--;
    } else {
      month.value--;
    }
  };
  
  const nextMonth = () => {
    if (month.value === 11) {
      month.value = 0;
      year.value++;
    } else {
      month.value++;
    }
  };
  
  // Function to determine the class for each day
  const dayClass = (day: { day: string | number }) => {
    return day.day ? "inline-block w-full text-sm font-medium text-gray-900" : "bg-red-500";
  };
  </script>
  