<template>
  <LayoutWithoutSidebar>
    <template #header-content>
      <header class="bg-white px-4 flex items-center justify-between container mx-auto h-16">
        <div class="flex items-center space-x-2">
          <img src="@/assets/icons/logo.svg" alt="Logo" class="h-8 w-auto" />
          <span class="text-lg font-semibold">BlackCountry</span>
        </div>
      </header>
    </template>
    <main class="min-h-screen pb-20">
      <!-- Header Section -->
      <div class="max-w-3xl mx-auto py-10 px-6">
        <h2 class="text-lg font-semibold mb-6">
          Follow these steps to add a new listing and showcase available property
          to potential tenants:
        </h2>
        <div class="space-y-4">
          <div
            v-for="step in steps"
            :key="step.id"
            class="flex items-center p-4 bg-[#F9FAFB] shadow rounded-lg"
          >
            <div
              class="w-12 h-12 flex items-center relative justify-center rounded-full mr-4"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <g clip-path="url(#clip0_5289_71417)">
                    <rect width="40" height="40" rx="20" fill="#292929" />
                    <path
                      d="M0.38519 29.5565C0.38519 28.3659 2.91491 27.811 4.62469 27.811C5.10963 27.811 5.92381 27.9086 5.92381 28.561C5.92381 29.8373 3.29221 30.5338 1.94015 30.5338C1.22268 30.5338 0.38519 30.2777 0.38519 29.5565ZM6.78287 28.561C6.78287 27.7831 6.21591 26.9519 4.62469 26.9519C2.86109 26.9519 -0.474153 27.4964 -0.474153 29.5565C-0.474153 30.655 0.496284 31.3929 1.94015 31.3929C3.62864 31.3929 6.78287 30.5623 6.78287 28.561ZM-5.10938 37.2561C-2.91091 38.045 0.42318 38.8632 4.7965 38.8632C11.6857 38.8632 20.8448 38.053 20.8448 31.0487C20.8448 28.3705 19.1641 27.1868 17.8135 26.2356C16.6257 25.399 15.8939 24.8289 15.8187 23.6938C15.7692 22.9455 16.1215 22.2669 16.5299 21.4815C16.9878 20.6006 17.5067 19.6022 17.5067 18.3397C17.5067 16.6261 16.2358 14.7817 13.4456 14.7817C11.2287 14.7817 9.18365 15.6485 7.01886 16.5666C4.23474 17.7471 1.0785 19.0854 -3.38145 19.0854C-3.99762 19.0854 -4.57178 19.0433 -5.10938 18.9685V14.2484C-4.08801 14.3753 -3.05977 14.439 -2.03055 14.4392C3.30544 14.4392 7.0462 12.6399 10.3466 11.0524C13.1578 9.70009 15.813 8.42315 19.0585 8.42315C23.5446 8.42315 25.8915 10.9647 25.8915 13.4751C25.8915 15.1616 25.0167 16.1887 24.0905 17.2757C23.1362 18.3958 22.1494 19.5542 22.1494 21.4329C22.1494 23.2359 22.8576 24.2049 23.5426 25.142C24.3421 26.2356 25.1689 27.3669 25.1689 30.0538C25.1689 35.1811 20.315 38.3549 15.5848 40.2305H-5.10938V37.2561ZM-5.10938 33.0336C-2.99086 33.7967 -0.756258 34.1874 1.49551 34.1885C5.39282 34.1885 11.9309 33.3286 11.9309 27.5701C11.9309 25.8761 10.5705 23.49 7.54581 23.49C5.50967 23.49 3.90521 24.0253 2.35371 24.5431C0.775447 25.0695 -0.715038 25.5668 -2.67003 25.5668C-3.52391 25.5668 -4.34212 25.4197 -5.10938 25.1857V20.8749C-4.53587 20.9422 -3.95889 20.9757 -3.38145 20.9753C1.46299 20.9753 4.9525 19.4957 7.75648 18.3069C9.82572 17.4294 11.6126 16.6716 13.4456 16.6716C15.046 16.6716 15.6164 17.5333 15.6164 18.3397C15.6164 19.1403 15.2455 19.8541 14.8526 20.6101C14.3818 21.5161 13.8482 22.5429 13.9325 23.819C14.0715 25.9118 15.4812 26.9047 16.7247 27.7808C17.9706 28.6583 18.9545 29.351 18.9545 31.0487C18.9545 33.5919 17.4868 36.9729 4.7965 36.9729C0.232659 36.9729 -3.12906 36.0103 -5.10938 35.2266V33.0336ZM-5.10938 26.0882C-4.33722 26.3001 -3.52103 26.4261 -2.67003 26.4261C-0.575459 26.4261 1.05202 25.8831 2.62568 25.3581C4.18063 24.8392 5.64896 24.3494 7.54581 24.3494C10.2099 24.3494 11.0719 26.5194 11.0719 27.5701C11.0719 31.3379 7.76051 33.3294 1.49551 33.3294C-1.18875 33.3294 -3.46348 32.7314 -5.10938 32.1066V26.0882ZM-5.10938 9.67706C-4.33469 9.84933 -3.54364 9.93733 -2.75004 9.93953C2.26996 9.93953 6.12901 7.83691 10.2145 5.61111C14.3346 3.36631 18.5951 1.04525 24.2137 1.04525C26.8151 1.04525 29.0317 1.79754 30.6232 3.22097C32.1686 4.60296 32.9857 6.48629 32.9857 8.66719C32.9857 10.9554 31.5807 13.0146 30.0934 15.1944C28.4771 17.5638 26.8053 20.0135 26.8053 22.9855C26.8053 29.2819 31.9076 32.9668 40.8387 33.1671V35.4306C40.8003 35.4338 40.7626 35.4422 40.7265 35.4557C34.2488 37.9557 30.0623 33.4944 29.8746 33.2854C29.8342 33.2289 29.7806 33.1831 29.7186 33.1519C29.6565 33.1206 29.5878 33.1049 29.5183 33.106C29.4489 33.1072 29.3807 33.1251 29.3197 33.1584C29.2587 33.1916 29.2067 33.2392 29.1681 33.2969C29.1188 33.3721 29.0949 33.461 29.0999 33.5508H29.0967C29.0967 33.5626 29.0653 34.7817 27.9968 36.5781C27.4117 37.562 26.4263 38.8499 24.7881 40.2305H17.7847C18.7755 39.7619 19.8381 39.1869 20.8528 38.4951C24.2868 36.153 26.028 33.313 26.028 30.0538C26.028 27.0863 25.0759 25.7841 24.2362 24.6349C23.5774 23.7338 23.0084 22.9553 23.0084 21.4329C23.0084 19.8705 23.8517 18.8807 24.7444 17.8329C25.7307 16.6754 26.7506 15.4781 26.7506 13.4751C26.7506 10.5376 24.1084 7.56379 19.0585 7.56379C15.617 7.56379 12.8761 8.88218 9.97422 10.278C6.59926 11.9014 3.10946 13.5798 -2.03055 13.5798C-3.19669 13.5798 -4.24513 13.4921 -5.10938 13.3798V9.67706ZM40.8387 15.0957C40.2844 15.553 39.7509 15.9657 39.2349 16.3645C37.0036 18.0884 35.2414 19.4503 35.2414 21.9794C35.2414 23.1412 35.6846 24.0409 36.5224 24.5808C37.1964 25.0151 38.0474 25.178 38.9073 25.178C39.5721 25.178 40.2413 25.0801 40.8387 24.9353V27.1977C37.8272 27.9244 35.4403 27.6887 33.9354 26.5122C32.8573 25.6695 32.2357 24.3192 32.2305 22.8077C32.2155 18.7311 35.5994 15.9775 38.5853 13.5482C39.409 12.8779 40.1846 12.2453 40.8387 11.6185V15.0957ZM40.8387 24.0469C39.5966 24.3793 37.9674 24.4893 36.9878 23.8587C36.3909 23.4739 36.1008 22.8592 36.1008 21.9794C36.1008 19.8722 37.6356 18.6859 39.7601 17.0443C40.1218 16.766 40.4814 16.4848 40.8387 16.2008V24.0469ZM40.8387 40.2305H26.0947C28.6955 37.8078 29.5457 35.6119 29.8208 34.4173C30.3834 34.9045 31.3214 35.6004 32.6072 36.1648C34.4232 36.9617 37.3135 37.6256 40.8387 36.3303V40.2305Z"
                      fill="white"
                      fill-opacity="0.3"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_5289_71417">
                    <rect width="40" height="40" rx="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span class="text-lg font-semibold absolute text-white">{{
                step.id
              }}</span>
            </div>
            <div>
              <h3 class="text- font-medium text-[#171717]">{{ step.title }}</h3>
              <p class="text-[#171717] text-sm font-light">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Sticky Footer Section -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white px-4 border-t py-3 shadow-lg">
      <div class="container mx-auto flex justify-between space-x-4">
        <button @click="openCancelModal = true" class="bg-gray-200 text-sm text-gray-700 px-4 py-3 rounded-md">
          Cancel
        </button>
        <button @click="router.push('/dashboard/property/new')" class="bg-[#292929] text-sm text-white px-4 py-3 rounded-md">
          Continue
        </button>
      </div>
    </footer>

    <CoreReusableModal
      :isOpen="openCancelModal" 
      message="By cancelling, you will lose progress of your property upload" 
      confirmButtonText="No, Continue uploading" 
      cancelButtonText="Yes, Cancel"
      @close="handleClose" 
      @confirm="handleConfirm"
    />
  </LayoutWithoutSidebar>
</template>

<script lang="ts" setup>
import { useGoBack } from '@/composables/core/useGoBack'
import LayoutWithoutSidebar from '@/layouts/dashboardWithoutSidebar.vue'
const { goBack } = useGoBack()
const router = useRouter()

definePageMeta({
     middleware: 'auth'
})

const handleConfirm = () => {
   router.push('/dashboard/property/new')
   openCancelModal.value = false
}

const handleClose= () => {
   router.push('/dashboard/property')
   openCancelModal.value = false
}
const steps = [
  {
    id: 1,
    title: "Basic Property Information",
    description:
      "Provide essential information about the property, including its name, location, architecture type, available rooms, co-living arrangements, internal and external features.",
  },
  {
    id: 2,
    title: "Detailed Property Information",
    description:
      "Enhance your property listing by adding high-quality photos of key areas such as the bathroom, bedroom, kitchen, and compound to attract potential tenants.",
  },
  {
    id: 3,
    title: "Add Visuals",
    description:
      "Enhance your property listing by adding high-quality photos of key areas such as the bathroom, bedroom, kitchen, and compound to attract potential tenants.",
  },
  {
    id: 4,
    title: "Finalize listing and publish",
    description:
      "Establish clear and concise guidelines for tenants by setting up house rules that outline expectations and regulations for living in the property.",
  },
];

const openCancelModal = ref(false)
</script>

<style scoped>
/* Make the footer sticky */
footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 10;
}

/* Ensure the main content doesn't overlap the footer */
main {
  padding-bottom: 80px; /* Adjust based on the height of the footer */
}
</style>
