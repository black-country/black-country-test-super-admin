<template>
  <Layout>
    <template #header-content>
      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        <div class="flex items-center gap-x-4">
          <button @click="router.back()"
            class="text-[#1D2739] flex items-center md:gap-x-3 md:px-4 md:py-3 p-2 text-xs md:text-sm bg-gray-50 rounded-md">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 5C12.5 5 7.50001 8.68242 7.5 10C7.49999 11.3177 12.5 15 12.5 15" stroke="#292929"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Back</button>
          <p class="md:text-base text-xs" v-if="!loading && Object.keys(memberObj).length">{{ memberObj?.firstName ?? 'Nil' }} {{ memberObj?.lastName
            ??
            'Nil'}}</p>
        </div>
        <div v-if="!loading && Object.keys(memberObj).length" class="flex items-center gap-x-4 lg:gap-x-6">
          <button @click="deleteModal = true" class="bg-[#F9FAFB] text-[#292929] text-xs md:text-sm md:px-6 md:py-2.5 p-2 rounded-lg">Remove
            User</button>
          <button @click="deactivateModal = true"
            class="bg-[#292929] text-white text-xs md:text-sm md:px-6 md:py-2.5 p-2 rounded-lg">Deactivate User</button>
        </div>
      </div>
    </template>
    <div v-if="Object.keys(memberObj).length && !loading" class="min-h-screen flex justify-center">
      <div class="w-full grid grid-cols-12 gap-8">

        <!-- Profile and Recent Activity Section -->
        <aside class="md:col-span-4 col-span-12 rounded-lg p-6  space-y-7 ">
          <section class="bg-white rounded-lg p-4">
            <div class="text-center mb-6">
              <img v-if="memberObj.profilePicture" :src="memberObj.profilePicture" alt="User profile picture"
                class="mx-auto rounded-full h-20 w-20" />
              <svg v-else class="mx-auto rounded-full h-20 w-20" viewBox="0 0 111 106" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M86.162 83.0406C90.5989 78.8716 94.1335 73.8369 96.5473 68.2476C98.9612 62.6584 100.203 56.6334 100.196 50.5452C100.196 25.8886 80.2096 5.90234 55.553 5.90234C30.8964 5.90234 10.9102 25.8886 10.9102 50.5452C10.9031 56.6334 12.1449 62.6584 14.5588 68.2476C16.9726 73.8369 20.5072 78.8716 24.9441 83.0406C33.2176 90.8561 44.1718 95.2034 55.553 95.1881C66.9343 95.2034 77.8885 90.8561 86.162 83.0406ZM28.7444 77.1569C31.9591 73.1351 36.0384 69.8892 40.6796 67.6602C45.3207 65.4312 50.4044 64.2763 55.553 64.2815C60.7017 64.2763 65.7854 65.4312 70.4265 67.6602C75.0676 69.8892 79.147 73.1351 82.3616 77.1569C78.8544 80.6995 74.6787 83.5104 70.0767 85.4267C65.4747 87.343 60.5381 88.3264 55.553 88.3199C50.568 88.3264 45.6313 87.343 41.0294 85.4267C36.4274 83.5104 32.2516 80.6995 28.7444 77.1569ZM72.7234 36.8089C72.7234 41.3628 70.9144 45.7301 67.6943 48.9502C64.4742 52.1703 60.1069 53.9793 55.553 53.9793C50.9992 53.9793 46.6318 52.1703 43.4118 48.9502C40.1917 45.7301 38.3827 41.3628 38.3827 36.8089C38.3827 32.2551 40.1917 27.8877 43.4118 24.6677C46.6318 21.4476 50.9992 19.6386 55.553 19.6386C60.1069 19.6386 64.4742 21.4476 67.6943 24.6677C70.9144 27.8877 72.7234 32.2551 72.7234 36.8089Z"
                  fill="#D6D0CC" />
                <path
                  d="M105.5 50C105.5 77.6142 83.1142 100 55.5 100C27.8858 100 5.5 77.6142 5.5 50C5.5 22.3858 27.8858 0 55.5 0C83.1142 0 105.5 22.3858 105.5 50ZM11.3186 50C11.3186 74.4007 31.0993 94.1814 55.5 94.1814C79.9007 94.1814 99.6814 74.4007 99.6814 50C99.6814 25.5993 79.9007 5.81863 55.5 5.81863C31.0993 5.81863 11.3186 25.5993 11.3186 50Z"
                  fill="#F0F2F5" />
              </svg>
              <h2 class="mt-4 text-lg font-semibold text-gray-900">{{ memberObj?.firstName ?? 'Nil' }}
                {{ memberObj?.lastName
                  ?? 'Nil' }}</h2>
              <p class="text-sm text-[#667185]">Agent</p>
            </div>
            <ul class="space-y-4 text-sm text-gray-600">
              <li class="flex justify-between items-center text-sm text-[#1D2739] flex-wrap">
                <span class="font-medium text-[#667185] text-sm">Last active:</span> {{ memberObj?.createdAt ?? 'Nil' }}
              </li>
              <li class="flex justify-between items-center text-sm text-[#1D2739] flex-wrap">
                <span class="font-medium text-[#667185] text-sm">Email:</span> {{ memberObj?.email ?? 'Nil' }}
              </li>
              <li class="flex justify-between items-center text-sm text-[#1D2739] flex-wrap">
                <span class="font-medium text-[#667185] text-sm">Phone number:</span> {{ memberObj?.phone ?? 'Nil' }}
              </li>
              <li class="flex justify-between items-center text-sm text-[#1D2739] flex-wrap">
                <span class="font-medium text-[#667185] text-sm">Location:</span> {{ memberObj?.address ?? 'Nil' }}
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
              <section v-if="memberObj?.activities?.length"
                class="bg-white border rounded-lg border-gray-50 px-4 py-5 sm:p-6">
                <div v-for="(item, idx) in memberObj?.activities" :key="idx"
                  class="flex gap-x-3 border-b last:border-b-0 border-gray-25 py-4">
                  <div>
                    <svg width="8" height="60" viewBox="0 0 8 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="4" cy="4" r="4" fill="#6A9AEB" />
                      <line x1="4.5" y1="12" x2="4.5" y2="60" stroke="#6A9AEB" stroke-dasharray="2 2" />
                    </svg>
                  </div>
                  <div class="space-y-0.5">
                    <p class="text-sm text-[#1D2739] max-w-lg">{{ item.description }}</p>
                    <p class="text-sm text-gray-500 font-light">{{ item.date }}</p>
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

        <main class="md:col-span-8 col-span-12 space-y-6">
          <!-- Statistics Section -->
          <div class="w-full lg:max-w-5xl lg:flex p-3 border border-gray-25 rounded-lg bg-white">
            <div v-for="(item, idx) in firstSection" :key="idx"
              class="h-32 cursor-pointer space-y-4 w-full border-gray-100 lg:border-r last:border-r-0 p-4">
              <div class="flex justify-end items-end ">
                <img :src="dynamicIcons(item.icon)" :alt="item.label" class="h-10 w-10 bg-gray-100 p-2 rounded-md" />
              </div>
              <div>
                <p class="text-[#1D2739] font-semibold text-2xl">{{ item.value }}</p>
                <h6 class="text-[#667185] font-medium text-sm">{{ item.label }}</h6>
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
                    <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="#1D2739"
                      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                </button>
                <button @click="nextMonth" class="p-1 ">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739"
                      stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
                <span class="text-[#5B8469] font-semibold">{{ day.day }}</span>
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

    <CoreReusableModal :loading="deactivating" :isOpen="deactivateModal" @close="deactivateModal = false"
      @confirm="handleDeactivateConfirm" :title="`${memberObj.isActive ? 'Deactivate' : 'Activate'} Member`"
      :message="`${memberObj.isActive ? 'Deactivating this member will make it unavailable for new inquiries and listings. You can reactivate it at any time.' : 'Activating this member will make it available.. You can de-activate it at any time.'}`"
      :confirmButtonText="`${memberObj.isActive ? 'Yes, deactivate' : 'Yes, Activate'}`" cancelButtonText="Cancel" />

    <CoreReusableModal :loading="deleting" :isOpen="deleteModal" @close="deleteModal = false"
      @confirm="handleDeleteConfirm" title="Remove Member"
      :message="`By deleting ${memberObj.firstName} ${memberObj.lastName}, you will permanently remove this member from the platform. Are you sure you want to proceed?`"
      confirmButtonText="Yes, delete" cancelButtonText="Cancel" />
  </Layout>
</template>

<script lang="ts" setup>
import Layout from '@/layouts/dashboard.vue';
import { useFetchMemberDetails } from '@/composables/modules/member/details'
import { dynamicImage } from "@/utils/assets";
import { useDeleteMember } from '@/composables/modules/member/delete'
import { useDeactivateMember } from '@/composables/modules/member/deactivate'
const { deleteMember, loading: deleting } = useDeleteMember()
const { deactivateMember, loading: deactivating } = useDeactivateMember()
const { memberObj, loading } = useFetchMemberDetails()
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