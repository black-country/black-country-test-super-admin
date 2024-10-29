<template>
  <Layout>
    <template #header-content>
      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        <div class="flex items-center gap-x-4">
          <h4 class="text-[#1D2739] text-lg">Tenant Management</h4>
          <div class="hidden lg:flex gap-x-4">
            <button
              @click="setActiveTab('tenants')"
              :class="[
                activeTab === 'tenants'
                  ? 'bg-[#5B8469] text-white'
                  : 'text-[#292929] text-sm bg-[#F0F2F5]',
              ]"
              class="font-medium text-sm px-4 py-2 rounded-md"
            >
              Tenants
            </button>
            <button
              @click="setActiveTab('maintenance-request')"
              :class="[
                activeTab === 'maintenance-request'
                  ? 'bg-[#5B8469] text-white'
                  : 'text-[#292929] text-sm bg-[#F0F2F5]',
              ]"
              class="px-4 py-2 text-sm rounded-md"
            >
              Manintenance request
            </button>
          </div>
        </div>
        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <NuxtLink
            to="/dashboard/notification"
            class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span class="sr-only">View notifications</span>
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </NuxtLink>
          <div
            class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          ></div>
          <div class="relative">
            <button
              type="button"
              @click="router.push('/dashboard/profile')"
              class="-m-1.5 flex items-center p-1.5"
              id="user-menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              <span class="sr-only">Open user menu</span>
              <!-- <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#292929"/>
                <path d="M20.0817 20.1818C20.0817 21.4242 19.8544 22.4924 19.3999 23.3864C18.9453 24.2765 18.3222 24.9621 17.5305 25.4432C16.7427 25.9205 15.8468 26.1591 14.843 26.1591C13.8355 26.1591 12.9358 25.9205 12.1442 25.4432C11.3563 24.9621 10.7351 24.2746 10.2805 23.3807C9.82599 22.4867 9.59872 21.4205 9.59872 20.1818C9.59872 18.9394 9.82599 17.8731 10.2805 16.983C10.7351 16.089 11.3563 15.4034 12.1442 14.9261C12.9358 14.4451 13.8355 14.2045 14.843 14.2045C15.8468 14.2045 16.7427 14.4451 17.5305 14.9261C18.3222 15.4034 18.9453 16.089 19.3999 16.983C19.8544 17.8731 20.0817 18.9394 20.0817 20.1818ZM18.343 20.1818C18.343 19.2348 18.1896 18.4375 17.8828 17.7898C17.5798 17.1383 17.1631 16.6458 16.6328 16.3125C16.1063 15.9754 15.5097 15.8068 14.843 15.8068C14.1726 15.8068 13.5741 15.9754 13.0476 16.3125C12.5211 16.6458 12.1044 17.1383 11.7976 17.7898C11.4946 18.4375 11.343 19.2348 11.343 20.1818C11.343 21.1288 11.4946 21.928 11.7976 22.5795C12.1044 23.2273 12.5211 23.7197 13.0476 24.0568C13.5741 24.3902 14.1726 24.5568 14.843 24.5568C15.5097 24.5568 16.1063 24.3902 16.6328 24.0568C17.1631 23.7197 17.5798 23.2273 17.8828 22.5795C18.1896 21.928 18.343 21.1288 18.343 20.1818ZM22.2706 26V14.3636H26.4183C27.3198 14.3636 28.0679 14.5189 28.6626 14.8295C29.2611 15.1402 29.7081 15.5701 30.0036 16.1193C30.299 16.6648 30.4467 17.2955 30.4467 18.0114C30.4467 18.7235 30.2971 19.3504 29.9979 19.892C29.7024 20.4299 29.2554 20.8485 28.657 21.1477C28.0623 21.447 27.3142 21.5966 26.4126 21.5966H23.2706V20.0852H26.2536C26.8217 20.0852 27.2839 20.0038 27.6399 19.8409C27.9998 19.678 28.263 19.4413 28.4297 19.1307C28.5964 18.8201 28.6797 18.447 28.6797 18.0114C28.6797 17.572 28.5945 17.1913 28.424 16.8693C28.2573 16.5473 27.9941 16.3011 27.6342 16.1307C27.2782 15.9564 26.8104 15.8693 26.2308 15.8693H24.0263V26H22.2706ZM28.0149 20.75L30.8899 26H28.8899L26.0717 20.75H28.0149Z" fill="#EBE5E0"/>
                </svg> -->
              <p class="bg-gray-900 text-white p-3 font-semibold rounded-lg">
                {{ initials }}
              </p>

              <span class="hidden lg:flex lg:items-center">
                <div>
                  <span
                    v-if="user"
                    class="ml-4 text-sm py-0 my-0 font-semibold block leading-6 text-gray-900"
                    aria-hidden="true"
                  >
                    {{ user?.firstName }} {{ user?.lastName }}</span
                  >
                  <span
                    class="text-sm py-0 my-0 font-light text-[#667185] block"
                    >Super admin</span
                  >
                </div>
                <svg
                  class="cursor-pointer"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18"
                    stroke="#1D2739"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </template>
    <main class="min-h-screen">
      <div class="p-6">
        <!-- Filter Row -->
        <div class="flex items-center space-x-4 mb-6">
          <!-- Dropdown Filter -->
          <di v>
            <select
              class="px-4 py-3 bg-[#F9FAFB] border-[0.5px] text-sm border-gray-300 rounded-lg"
            >
              <option>All Tenants</option>
              <option>Tenant 1</option>
              <option>Tenant 2</option>
              <!-- Add more options as needed -->
            </select>
          </di>

          <!-- Search Input -->
          <div class="relative flex-1">
            <input
              type="text"
              placeholder="Search"
              class="w-full px-4 py-3 text-sm bg-[#F9FAFB] border-[0.5px] rounded-lg pl-10 text-gray-700 placeholder-gray-500"
            />
            <img
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              :src="dynamicIcons('gray-search')"
            />
          </div>

          <!-- Date Pickers -->
          <div class="flex space-x-4">
            <input
              type="date"
              class="px-4 py-3 bg-[#F9FAFB] border-[0.5px] text-sm rounded-lg"
            />
            <input
              type="date"
              class="px-4 py-3 bg-[#F9FAFB] border-[0.5px] text-sm rounded-lg"
            />
          </div>

          <!-- Configure Table Button -->
          <button
            class="flex items-center px-4 text-sm py-3 border-[0.5px] gap-x-2 bg-[#F9FAFB] rounded-lg text-gray-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.7633 5.95083L17.3519 5.237C17.0409 4.69714 16.8854 4.42722 16.6207 4.31958C16.356 4.21194 16.0567 4.29688 15.4581 4.46674L14.4413 4.75316C14.0591 4.84129 13.6581 4.79129 13.3092 4.612L13.0284 4.45003C12.7292 4.25837 12.499 3.97578 12.3716 3.64363L12.0934 2.81248C11.9104 2.26246 11.8189 1.98745 11.601 1.83015C11.3833 1.67285 11.0939 1.67285 10.5153 1.67285H9.58628C9.0077 1.67285 8.71836 1.67285 8.50053 1.83015C8.28274 1.98745 8.19125 2.26246 8.00827 2.81248L7.72997 3.64363C7.60257 3.97578 7.37241 4.25837 7.07317 4.45003L6.79244 4.612C6.44348 4.79129 6.04252 4.84129 5.66035 4.75316L4.64349 4.46674C4.04487 4.29688 3.74557 4.21194 3.48092 4.31958C3.21627 4.42722 3.06074 4.69714 2.74966 5.237L2.33834 5.95083C2.04675 6.45688 1.90095 6.7099 1.92925 6.97925C1.95754 7.2486 2.15272 7.46566 2.54308 7.89978L3.40228 8.86034C3.61228 9.12618 3.76137 9.58951 3.76137 10.0061C3.76137 10.4228 3.61233 10.886 3.40231 11.1519L2.54308 12.1125C2.15272 12.5467 1.95755 12.7637 1.92925 13.0331C1.90095 13.3024 2.04675 13.5554 2.33834 14.0614L2.74965 14.7753C3.06072 15.3151 3.21627 15.5851 3.48092 15.6927C3.74557 15.8003 4.04488 15.7154 4.64351 15.5455L5.66031 15.2591C6.04256 15.1709 6.44359 15.221 6.79259 15.4003L7.07328 15.5623C7.37245 15.754 7.60256 16.0365 7.72995 16.3687L8.00827 17.1999C8.19125 17.7499 8.28274 18.0249 8.50053 18.1823C8.71836 18.3395 9.0077 18.3395 9.58628 18.3395H10.5153C11.0939 18.3395 11.3833 18.3395 11.601 18.1823C11.8189 18.0249 11.9104 17.7499 12.0934 17.1999L12.3717 16.3687C12.499 16.0365 12.7291 15.754 13.0284 15.5623L13.309 15.4003C13.658 15.221 14.059 15.1709 14.4413 15.2591L15.4581 15.5455C16.0567 15.7154 16.356 15.8003 16.6207 15.6927C16.8854 15.5851 17.0409 15.3151 17.3519 14.7753L17.7633 14.0614C18.0549 13.5554 18.2006 13.3024 18.1724 13.0331C18.144 12.7637 17.9489 12.5467 17.5585 12.1125L16.6993 11.1519C16.4893 10.886 16.3402 10.4228 16.3402 10.0061C16.3402 9.58951 16.4894 9.12618 16.6993 8.86034L17.5585 7.89978C17.9489 7.46566 18.144 7.2486 18.1724 6.97925C18.2006 6.7099 18.0549 6.45688 17.7633 5.95083Z"
                stroke="#292929"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M12.931 9.99967C12.931 11.6105 11.6251 12.9163 10.0143 12.9163C8.40346 12.9163 7.09766 11.6105 7.09766 9.99967C7.09766 8.38884 8.40346 7.08301 10.0143 7.08301C11.6251 7.08301 12.931 8.38884 12.931 9.99967Z"
                stroke="#292929"
                stroke-width="1.5"
              />
            </svg>

            Configure table
          </button>

          <!-- Export Button -->
          <button
            class="flex items-center px-4 text-sm py-3 border-[0.5px] gap-x-2 bg-[#F9FAFB] rounded-lg text-gray-700"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0013 12.0833V3.75M10.0013 12.0833C9.4178 12.0833 8.32758 10.4214 7.91797 10M10.0013 12.0833C10.5848 12.0833 11.6751 10.4214 12.0846 10"
                stroke="#292929"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16.6654 13.75C16.6654 15.8183 16.2337 16.25 14.1654 16.25H5.83203C3.7637 16.25 3.33203 15.8183 3.33203 13.75"
                stroke="#292929"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            Export
          </button>
        </div>

        <div class="bg-white rounded-lg">
          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white">
              <thead class="border-b border-gray-50">
                <tr>
                  <th
                    class="py-4 px-5 text-left text-sm font-medium text-[#1D2739] tracking-wider"
                  >
                    Tenant name
                  </th>
                  <th
                    class="py-4 px-5 text-left text-sm font-medium text-[#1D2739] tracking-wider"
                  >
                    Current home
                  </th>
                  <th
                    class="py-4 px-5 text-left text-sm font-medium text-[#1D2739] tracking-wider"
                  >
                    Room number
                  </th>
                  <th
                    class="py-4 px-5 text-left text-sm font-medium text-[#1D2739] tracking-wider"
                  >
                    Frequency
                  </th>
                  <th
                    class="py-4 px-5 text-left text-sm font-medium text-[#1D2739] tracking-wider"
                  >
                    Payment count
                  </th>
                  <th
                    class="py-4 px-5 text-left text-sm font-medium text-[#1D2739] tracking-wider"
                  >
                    Current rent status
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr
                  class="cursor-pointer"
                  v-for="(tenant, index) in tenants"
                  :key="index"
                >
                  <td
                                      @click="router.push(`/dashboard/tenant-mgt/${index}`)"
                    class="py-6 px-5 whitespace-nowrap text-sm text-[#667185] cursor-pointer"
                  >
                    {{ tenant.name }}
                  </td>
                  <td
                                      @click="router.push(`/dashboard/tenant-mgt/${index}`)"
                    class="py-6 px-5 whitespace-nowrap text-sm text-[#667185] cursor-pointer"
                  >
                    {{ tenant.currentHome }}
                  </td>
                  <td
                                      @click="router.push(`/dashboard/tenant-mgt/${index}`)"
                    class="py-6 px-5 whitespace-nowrap text-sm text-[#667185] cursor-pointer"
                  >
                    {{ tenant.roomNumber }}
                  </td>
                  <td
                                      @click="router.push(`/dashboard/tenant-mgt/${index}`)"
                    class="py-6 px-5 whitespace-nowrap text-sm text-[#667185] cursor-pointer"
                  >
                    {{ tenant.frequency }}
                  </td>
                  <td
                                      @click="router.push(`/dashboard/tenant-mgt/${index}`)"
                    class="py-6 px-5 whitespace-nowrap text-sm text-[#667185] cursor-pointer"
                  >
                    {{ tenant.paymentCount }}
                  </td>
                  <td class="py-6 px-5 whitespace-nowrap text-sm">
                    <span
                      :class="{
                        'bg-green-100 text-green-800':
                          tenant.rentStatus === 'Paid',
                        'bg-red-100 text-red-800':
                          tenant.rentStatus === 'Not Paid',
                      }"
                      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ tenant.rentStatus }}
                    </span>
                  </td>
                  <td
                    class="py-4 px-5 relative whitespace-nowrap text-sm text-[#667185]"
                  >
                    <button
                      @click="toggleDropdown(index)"
                      class="inline-flex items-center text-sm font-medium text-[#667185] hover:text-black"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.99609 10H10.0036"
                          stroke="#292929"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M15 10H15.0075"
                          stroke="#1D2739"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M5 10H5.00748"
                          stroke="#1D2739"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <div
                      v-if="activeDropdown === index"
                      class="absolute -top-2 right-10 z-50 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg"
                    >
                      <ul
                        class="py-1 text-sm text-gray-700 divide divide-y-[0.5px]"
                      >
                        <li>
                          <a
                            @click.prevent="
                              handleDropdownClick('view', tenant)
                            "
                            href="#"
                            class="block flex items-center gap-x-2 px-4 py-3 hover:bg-gray-100 text-start"
                          >
                            <img :src="dynamicIcons('view-property')" />
                            View Tenant
                          </a>
                        </li>
                        <li>
                          <a
                            @click.prevent="
                              handleDropdownClick('message', tenant)
                            "
                            href="#"
                            class="block flex items-center gap-x-2 px-4 py-3 text-sm hover:bg-gray-100 text-start"
                          >
                            <img :src="dynamicIcons('edit-property')" />
                            Message Tenant
                          </a>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
          v-if="activeDropdown !== null"
          @click="closeDropdown"
          class="fixed inset-0 z-40 bg-black opacity-25"
        ></div>

          <!-- Pagination Controls -->
          <section class="border-t border-gray-50">
            <nav class="flex justify-between items-center mt- px-4 py-6">
              <div class="-mt-px flex w-0 flex-1">
                <button
                  class="px-6 text-sm py-2 bg-[#F9FAFB] text-[#545454] border-[0.5px] rounded-md"
                  disabled
                >
                  Previous
                </button>
              </div>
              <div class="hidden md:-mt-px md:flex">
                <a
                  href="#"
                  class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >1</a
                >
                <a
                  href="#"
                  class="inline-flex items-center px-4 pt-4 text-sm font-medium text-[#1D2739]"
                  aria-current="page"
                  >2</a
                >
                <a
                  href="#"
                  class="inline-flex items-center border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >3</a
                >
                <span
                  class="inline-flex items-center border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
                  >...</span
                >
                <a
                  href="#"
                  class="inline-flex items-center border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >8</a
                >
                <a
                  href="#"
                  class="inline-flex items-center border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >9</a
                >
                <a
                  href="#"
                  class="inline-flex items-center border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >10</a
                >
              </div>
              <div class="-mt-px flex w-0 flex-1 justify-end">
                <button
                  class="px-6 text-sm py-2 bg-[#292929] text-white rounded-md"
                >
                  Next
                </button>
              </div>
            </nav>
          </section>
        </div>
      </div>
    </main>
  </Layout>
</template>

<script lang="ts" setup>
import { useUserInitials } from "@/composables/core/useUserInitials";
import { useUser } from "@/composables/auth/user";
import Layout from "@/layouts/dashboard.vue";
const { user } = useUser();
const router = useRouter();
const route = useRoute();
import { dynamicIcons } from "@/utils/assets";

const initials = ref("") as any;

const activeTab = ref("tenants"); // Default active tab

onMounted(() => {
  // Get initials from the composable
  const { getInitials } = useUserInitials(user.value);
  initials.value = getInitials.value;
});

const closeDropdown = () => {
  activeDropdown.value = null;
};

const downloadDropdown = ref(false);

const activeDropdown = ref<number | null>(null);

// Function to handle dropdown option click
const handleDropdownClick = (action: any, item: any) => {
  if (action === "view") {
    return router.push(`/dashboard/tenant-mgt/${item.id}`);
  }

  if (action === "message") {
    return router.push(`/dashboard/tenant-mgt/${item.id}`);
  }
  closeDropdown();
};

const toggleDropdown = (index: number) => {
  if (activeDropdown.value === index) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = index;
  }
};


// Function to change the active tab and update the query parameter
const setActiveTab = (tab: string) => {
  activeTab.value = tab;
  // Update the URL query parameter to reflect the active tab
  router.push({ query: { ...route.query, activeTab: tab } });
};

const tenants = ref([
  {
    name: "Jackie Goodwin",
    currentHome: "Ortiz - Kunde",
    roomNumber: 5,
    frequency: "Yearly",
    paymentCount: "1/2",
    rentStatus: "Paid",
  },
  {
    name: "Henry Veum",
    currentHome: "Hodkiewicz - Cummings",
    roomNumber: 5,
    frequency: "Monthly",
    paymentCount: "1/2",
    rentStatus: "Not Paid",
  },
  {
    name: "Shari Lang",
    currentHome: "Gislason - Crona",
    roomNumber: 5,
    frequency: "Monthly",
    paymentCount: "1/2",
    rentStatus: "Paid",
  },
  {
    name: "Kristina Schinner",
    currentHome: "Cassin - Simonis",
    roomNumber: 5,
    frequency: "Yearly",
    paymentCount: "1/2",
    rentStatus: "Not Paid",
  },
  {
    name: "Alex Brown",
    currentHome: "Parisian - Haley",
    roomNumber: 5,
    frequency: "Monthly",
    paymentCount: "1/2",
    rentStatus: "Paid",
  },
  {
    name: "Pat Haley",
    currentHome: "Torp, O'Kon and Gislason",
    roomNumber: 5,
    frequency: "Yearly",
    paymentCount: "1/2",
    rentStatus: "Not Paid",
  },
  {
    name: "Kristopher Beatty",
    currentHome: "Lubowitz, Berge and Cartwright",
    roomNumber: 5,
    frequency: "Yearly",
    paymentCount: "1/2",
    rentStatus: "Paid",
  },
  {
    name: "Franklin Jakubowski",
    currentHome: "Fritsch LLC",
    roomNumber: 5,
    frequency: "Monthly",
    paymentCount: "1/2",
    rentStatus: "Paid",
  },
]);

const currentPage = 1;
</script>
