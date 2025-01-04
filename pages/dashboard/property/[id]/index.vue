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
          <button @click="activeTab === 'listings'" :class="[activeTab === 'listings' ? 'bg-[#5B8469] text-white' : '']"
            class="bg-[#5B8469] font-medium px-4 py-2 text-sm rounded-md text-white">Property details</button>
          <button @click="activeTab === 'rental-applications'"
            :class="[activeTab === 'rental-applications' ? 'bg-[#5B8469] text-white' : ' ']"
            class="text-[#292929] font-medium text-sm bg-[#F0F2F5] px-4 py-2 rounded-md">Tenants</button>
          <button @click="activeTab === 'lease-documents'"
            :class="[activeTab === 'lease-documents' ? 'bg-[#5B8469] text-white' : 'bg-[#F0F2F5] text-[#292929]']"
            class="text-[#292929] font-medium text-sm bg-[#F0F2F5] px-4 py-2 rounded-md">Payment history</button>
        </div>
        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <NuxtLink to="/dashboard/notification" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span class="sr-only">View notifications</span>
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </NuxtLink>
          <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true"></div>
          <div class="relative">
            <button @click="router.push('/dashboard/profile')" type="button" class="-m-1.5 flex items-center p-1.5" id="user-menu-button" aria-expanded="false"
              aria-haspopup="true">
              <span class="sr-only">Open user menu</span>
              <!-- <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#292929" />
                <path
                  d="M20.0817 20.1818C20.0817 21.4242 19.8544 22.4924 19.3999 23.3864C18.9453 24.2765 18.3222 24.9621 17.5305 25.4432C16.7427 25.9205 15.8468 26.1591 14.843 26.1591C13.8355 26.1591 12.9358 25.9205 12.1442 25.4432C11.3563 24.9621 10.7351 24.2746 10.2805 23.3807C9.82599 22.4867 9.59872 21.4205 9.59872 20.1818C9.59872 18.9394 9.82599 17.8731 10.2805 16.983C10.7351 16.089 11.3563 15.4034 12.1442 14.9261C12.9358 14.4451 13.8355 14.2045 14.843 14.2045C15.8468 14.2045 16.7427 14.4451 17.5305 14.9261C18.3222 15.4034 18.9453 16.089 19.3999 16.983C19.8544 17.8731 20.0817 18.9394 20.0817 20.1818ZM18.343 20.1818C18.343 19.2348 18.1896 18.4375 17.8828 17.7898C17.5798 17.1383 17.1631 16.6458 16.6328 16.3125C16.1063 15.9754 15.5097 15.8068 14.843 15.8068C14.1726 15.8068 13.5741 15.9754 13.0476 16.3125C12.5211 16.6458 12.1044 17.1383 11.7976 17.7898C11.4946 18.4375 11.343 19.2348 11.343 20.1818C11.343 21.1288 11.4946 21.928 11.7976 22.5795C12.1044 23.2273 12.5211 23.7197 13.0476 24.0568C13.5741 24.3902 14.1726 24.5568 14.843 24.5568C15.5097 24.5568 16.1063 24.3902 16.6328 24.0568C17.1631 23.7197 17.5798 23.2273 17.8828 22.5795C18.1896 21.928 18.343 21.1288 18.343 20.1818ZM22.2706 26V14.3636H26.4183C27.3198 14.3636 28.0679 14.5189 28.6626 14.8295C29.2611 15.1402 29.7081 15.5701 30.0036 16.1193C30.299 16.6648 30.4467 17.2955 30.4467 18.0114C30.4467 18.7235 30.2971 19.3504 29.9979 19.892C29.7024 20.4299 29.2554 20.8485 28.657 21.1477C28.0623 21.447 27.3142 21.5966 26.4126 21.5966H23.2706V20.0852H26.2536C26.8217 20.0852 27.2839 20.0038 27.6399 19.8409C27.9998 19.678 28.263 19.4413 28.4297 19.1307C28.5964 18.8201 28.6797 18.447 28.6797 18.0114C28.6797 17.572 28.5945 17.1913 28.424 16.8693C28.2573 16.5473 27.9941 16.3011 27.6342 16.1307C27.2782 15.9564 26.8104 15.8693 26.2308 15.8693H24.0263V26H22.2706ZM28.0149 20.75L30.8899 26H28.8899L26.0717 20.75H28.0149Z"
                  fill="#EBE5E0" />
              </svg> -->
              <p class="bg-gray-900 text-white p-3 font-semibold rounded-lg">{{initials}}</p>

              <span class="hidden lg:flex lg:items-center">
                <div>
                  <!-- <span class="ml-4 text-sm py-0 my-0 font-semibold block leading-6 text-gray-900"
                    aria-hidden="true">Viola Gottlieb</span> -->
                    <span v-if="user"
                    class="ml-4 text-sm py-0 my-0 font-semibold block leading-6 text-gray-900"
                    aria-hidden="true"
                    > {{user?.firstName}}  {{user?.lastName}}</span
                  >
                  <span class="text-sm py-0 my-0 font-light text-[#667185] block">Super admin</span>
                </div>
                <svg  class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </span>
            </button>
          </div>
        </div>
      </div>
    </template>
  <main>
  <PropertyDetailsHeader v-if="!loading" :propertyObj="propertyObj" />
  <!-- <PropertyImageGallery v-if="propertyObj?.images" :loading="loading" :propertyObj="propertyObj" :images="allImages" class="mt-6" /> -->
   <ImageGallery  v-if="propertyObj?.images" :loading="loading" :propertyObj="propertyObj" :images="allImages" class="mt-6" />
 <section v-if="!loading">
  <div class="pt-4 pb-8">
    <PropertyInfo :propertyObj="propertyObj" :loading="loading" />
  </div>
 </section>
 <section v-else>
  <div class="rounded-md p-4 w-full mx-auto mt-10">
    <div class="animate-pulse flex space-x-4">
      <!-- <div class="rounded-md bg-slate-200 h-44 w-44"></div> -->
      <div class="flex-1 space-y-6 py-1">
        <div class="h-32 bg-slate-200 rounded"></div>
        <div class="space-y-3">
          <div class="grid grid-cols-3 gap-4">
            <div class="h-32 w-full bg-slate-200 rounded col-span-2"></div>
            <div class="h-32 w-full bg-slate-200 rounded col-span-1"></div>
          </div>
          <div class="h-32 w-full bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
 </section>
    <CoreModal
      title="Share using"
      :isOpen="showShareModal"
      @close="showShareModal = false"
    >
      <div
        class="bg-white p-4 w-full m-14 lg:m-0 rounded-lg relative space-y-10"
        @click.stop
      >
        <div class="space-y-7">
          <div class="flex justify-between mb-6">
            <!-- Instagram -->
            <div class="flex flex-col items-center space-y-2">
              <!-- <img src="/instagram-icon.svg" alt="Instagram" class="w-12 h-12 mb-2" /> -->
              <svg
                @click="shareOnInstagram"
                class="cursor-pointer"
                width="61"
                height="60"
                viewBox="0 0 61 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30.125" cy="30" r="30" fill="#FEF7FF" />
                <rect
                  x="15.916"
                  y="15.085"
                  width="29.1667"
                  height="29.8295"
                  rx="8"
                  fill="url(#paint0_radial_6053_214487)"
                />
                <rect
                  x="15.916"
                  y="15.085"
                  width="29.1667"
                  height="29.8295"
                  rx="8"
                  fill="url(#paint1_radial_6053_214487)"
                />
                <rect
                  x="15.916"
                  y="15.085"
                  width="29.1667"
                  height="29.8295"
                  rx="8"
                  fill="url(#paint2_radial_6053_214487)"
                />
                <path
                  d="M37.7923 24.1407C37.7923 25.0233 37.0928 25.7387 36.2298 25.7387C35.3669 25.7387 34.6673 25.0233 34.6673 24.1407C34.6673 23.2582 35.3669 22.5427 36.2298 22.5427C37.0928 22.5427 37.7923 23.2582 37.7923 24.1407Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M30.5007 35.3268C33.3771 35.3268 35.709 32.9419 35.709 30.0001C35.709 27.0582 33.3771 24.6734 30.5007 24.6734C27.6242 24.6734 25.2923 27.0582 25.2923 30.0001C25.2923 32.9419 27.6242 35.3268 30.5007 35.3268ZM30.5007 33.1961C32.2265 33.1961 33.6257 31.7652 33.6257 30.0001C33.6257 28.235 32.2265 26.8041 30.5007 26.8041C28.7748 26.8041 27.3757 28.235 27.3757 30.0001C27.3757 31.7652 28.7748 33.1961 30.5007 33.1961Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M20.084 29.574C20.084 25.9941 20.084 24.2041 20.7652 22.8368C21.3644 21.6341 22.3205 20.6562 23.4965 20.0434C24.8335 19.3467 26.5837 19.3467 30.084 19.3467H30.9173C34.4176 19.3467 36.1678 19.3467 37.5048 20.0434C38.6808 20.6562 39.6369 21.6341 40.2361 22.8368C40.9173 24.2041 40.9173 25.9941 40.9173 29.574V30.4262C40.9173 34.0061 40.9173 35.796 40.2361 37.1634C39.6369 38.3661 38.6808 39.344 37.5048 39.9568C36.1678 40.6535 34.4176 40.6535 30.9173 40.6535H30.084C26.5837 40.6535 24.8335 40.6535 23.4965 39.9568C22.3205 39.344 21.3644 38.3661 20.7652 37.1634C20.084 35.796 20.084 34.0061 20.084 30.4262V29.574ZM30.084 21.4774H30.9173C32.7019 21.4774 33.915 21.479 34.8527 21.5574C35.766 21.6337 36.2331 21.772 36.5589 21.9418C37.343 22.3504 37.9804 23.0023 38.3798 23.8041C38.5459 24.1373 38.6811 24.6151 38.7558 25.5492C38.8324 26.5082 38.834 27.7489 38.834 29.574V30.4262C38.834 32.2513 38.8324 33.492 38.7558 34.451C38.6811 35.3851 38.5459 35.8628 38.3798 36.1961C37.9804 36.9979 37.343 37.6498 36.5589 38.0584C36.2331 38.2282 35.766 38.3665 34.8527 38.4428C33.915 38.5212 32.7019 38.5228 30.9173 38.5228H30.084C28.2994 38.5228 27.0863 38.5212 26.1486 38.4428C25.2353 38.3665 24.7682 38.2282 24.4424 38.0584C23.6583 37.6498 23.0209 36.9979 22.6215 36.1961C22.4554 35.8628 22.3202 35.3851 22.2455 34.451C22.1689 33.492 22.1673 32.2513 22.1673 30.4262V29.574C22.1673 27.7489 22.1689 26.5082 22.2455 25.5492C22.3202 24.6151 22.4554 24.1373 22.6215 23.8041C23.0209 23.0023 23.6583 22.3504 24.4424 21.9418C24.7682 21.772 25.2353 21.6337 26.1486 21.5574C27.0863 21.479 28.2994 21.4774 30.084 21.4774Z"
                  fill="white"
                />
                <defs>
                  <radialGradient
                    id="paint0_radial_6053_214487"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(26.3327 37.4571) rotate(-55.9754) scale(26.9935 26.7735)"
                  >
                    <stop stop-color="#B13589" />
                    <stop offset="0.79309" stop-color="#C62F94" />
                    <stop offset="1" stop-color="#8A3AC8" />
                  </radialGradient>
                  <radialGradient
                    id="paint1_radial_6053_214487"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(25.291 45.9798) rotate(-65.6239) scale(23.9769 23.6276)"
                  >
                    <stop stop-color="#E0E8B7" />
                    <stop offset="0.444662" stop-color="#FB8A2E" />
                    <stop offset="0.71474" stop-color="#E2425C" />
                    <stop offset="1" stop-color="#E2425C" stop-opacity="0" />
                  </radialGradient>
                  <radialGradient
                    id="paint2_radial_6053_214487"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(14.3535 16.1503) rotate(-8.31232) scale(40.5299 8.85781)"
                  >
                    <stop offset="0.156701" stop-color="#406ADC" />
                    <stop offset="0.467799" stop-color="#6A45BE" />
                    <stop offset="1" stop-color="#6A45BE" stop-opacity="0" />
                  </radialGradient>
                </defs>
              </svg>

              <span class="text-sm text-[#1D2739]">Instagram</span>
            </div>
            <!-- X (Twitter) -->
            <div class="flex flex-col items-center space-y-2">
              <!-- <img src="/twitter-icon.svg" alt="Twitter" class="w-12 h-12 mb-2" /> -->
              <svg
                @click="shareOnTwitter"
                class="cursor-pointer"
                width="61"
                height="60"
                viewBox="0 0 61 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30.375" cy="30" r="30" fill="#F0F2F5" />
                <rect
                  x="15.1992"
                  y="15"
                  width="30"
                  height="30"
                  rx="8"
                  fill="black"
                />
                <path
                  d="M34.527 23H36.7714L31.8682 28.6041L37.6364 36.23H33.1199L29.5824 31.6049L25.5347 36.23H23.289L28.5335 30.2358L23 23H27.6312L30.8287 27.2275L34.527 23ZM33.7393 34.8866H34.983L26.9554 24.2728H25.6209L33.7393 34.8866Z"
                  fill="white"
                />
              </svg>

              <span class="text-sm text-[#1D2739]">Twitter</span>
            </div>
            <!-- WhatsApp -->
            <div class="flex flex-col items-center space-y-2">
              <!-- <img src="/whatsapp-icon.svg" alt="WhatsApp" class="w-12 h-12 mb-2" /> -->
              <svg
                @click="shareOnWhatsApp"
                class="cursor-pointer"
                width="61"
                height="60"
                viewBox="0 0 61 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30.375" cy="30" r="30" fill="#F0F2F5" />
                <rect
                  x="15.1992"
                  y="15"
                  width="30"
                  height="30"
                  rx="8"
                  fill="black"
                />
                <path
                  d="M34.527 23H36.7714L31.8682 28.6041L37.6364 36.23H33.1199L29.5824 31.6049L25.5347 36.23H23.289L28.5335 30.2358L23 23H27.6312L30.8287 27.2275L34.527 23ZM33.7393 34.8866H34.983L26.9554 24.2728H25.6209L33.7393 34.8866Z"
                  fill="white"
                />
              </svg>

              <span class="text-sm text-[#1D2739]">WhatsApp</span>
            </div>
            <!-- Facebook -->
            <div class="flex flex-col items-center space-y-2">
              <!-- <img src="/facebook-icon.svg" alt="Facebook" class="w-12 h-12 mb-2" /> -->
              <svg
                @click="shareOnFacebook"
                class="cursor-pointer"
                width="61"
                height="60"
                viewBox="0 0 61 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30.875" cy="30" r="30" fill="#E6F1FF" />
                <rect
                  x="15.5"
                  y="15"
                  width="30"
                  height="30"
                  rx="8"
                  fill="#1877F2"
                />
                <path
                  d="M36.3359 34.3359L37.0039 30H32.8438V27.1875C32.8438 26.0039 33.4238 24.8438 35.2871 24.8438H37.1797V21.1523C37.1797 21.1523 35.4629 20.8594 33.8223 20.8594C30.3945 20.8594 28.1562 22.9336 28.1562 26.6953V30H24.3477V34.3359H28.1562V45H32.8438V34.3359H36.3359Z"
                  fill="white"
                />
              </svg>

              <span class="text-sm text-[#1D2739]">Facebook</span>
            </div>
          </div>
        </div>

        <!-- Copy Link -->
        <div class="pt-4">
          <h3 class="font-medium mb-2 text-[#1D2739]">Copy Link</h3>
          <div class="relative">
            <input
              type="text"
              class="border-[0.5px] rounded-lg w-full py-4 px-4 text-[#667185] bg-[#E4E7EC]"
              :value="shareLink"
              readonly
            />
            <button
              class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-100 p-2 rounded-full"
              @click="copyLink"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.1309 11.0152C11.2623 11.8838 9.85408 11.8838 8.98541 11.0152C8.11684 10.1466 8.11684 8.73833 8.98541 7.8697L10.9514 5.90375C11.7804 5.07467 13.1012 5.03694 13.975 5.79055M13.7037 3.15146C14.5723 2.28285 15.9806 2.28285 16.8492 3.15146C17.7178 4.02006 17.7178 5.42836 16.8492 6.29696L14.8832 8.26291C14.0542 9.092 12.7335 9.12975 11.8597 8.37608"
                  stroke="#1D2739"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M17.5 10.8333C17.5 13.976 17.5 15.5474 16.5237 16.5237C15.5474 17.5 13.976 17.5 10.8333 17.5H9.16667C6.02397 17.5 4.45262 17.5 3.47631 16.5237C2.5 15.5474 2.5 13.976 2.5 10.8333V9.16667C2.5 6.02397 2.5 4.45262 3.47631 3.47631C4.45262 2.5 6.02397 2.5 9.16667 2.5"
                  stroke="#1D2739"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </CoreModal>
  </main>
</Layout>
</template>

<script setup lang="ts">
import { useUserInitials } from '@/composables/core/useUserInitials'
import Layout from '@/layouts/dashboard.vue';
import { useUser } from '@/composables/auth/user'
import { useFetchProperty } from "@/composables/modules/property/fetchProperty";
import { dynamicImage } from "@/utils/assets";
const { user } = useUser()
const router = useRouter();
const { propertyObj, loading } = useFetchProperty();

// Property Images
const mainImage = ref("property1.png");
const secondaryImage1 = ref("property1.png");
const secondaryImage2 = ref("property1.png");
const secondaryImage3 = ref("property1.png");
const secondaryImage4 = ref("property1.png");

import { useImageExtractor } from '@/composables/core/useExtractImages'; 
const { extractImages } = useImageExtractor();
const allImages = computed(() => extractImages(propertyObj.value));


definePageMeta({
     middleware: 'auth'
})

const showShareModal = ref(false);
// const showBookingModal = ref(true);

// Property Manager

const initials = ref('') as any

onMounted(() => {
  // Get initials from the composable
const { getInitials } = useUserInitials(user.value);
initials.value = getInitials.value;
})

// Similar Properties
// const similarProperties = ref([
//   {
//     id: 1,
//     image: "property1.png",
//     name: "Jason Co-living Space",
//     address: "Iconic Tower, off Ajose Adegun VI, Lagos.",
//     price: "5 bedrooms | 6 baths | 5254 sqft",
//   },
//   {
//     id: 2,
//     image: "property2.png",
//     name: "Jason Co-living Space",
//     address: "Iconic Tower, off Ajose Adegun VI, Lagos.",
//     price: "5 bedrooms | 6 baths | 5254 sqft",
//   },
//   {
//     id: 3,
//     image: "property1.png",
//     name: "Jason Co-living Space",
//     address: "Iconic Tower, off Ajose Adegun VI, Lagos.",
//     price: "5 bedrooms | 6 baths | 5254 sqft",
//   },
//   {
//     id: 4,
//     image: "property2.png",
//     name: "Jason Co-living Space",
//     address: "Iconic Tower, off Ajose Adegun VI, Lagos.",
//     price: "5 bedrooms | 6 baths | 5254 sqft",
//   },
// ]);
const route = useRoute()

const handleFavorite = () => {};

const fullUrlPath = computed(() => {
  if (process.client) { // Ensure code runs only on the client-side
    const origin = window.location.origin;
    return `${origin}${route.fullPath}`;
  }
  return ''; // Return an empty string or a default value for server-side rendering
});

// Function to copy the link to the clipboard
// const copyLink = async () => {
//   try {
//     await navigator.clipboard.writeText(shareLink.value);
//     alert("Link copied!");
//   } catch (err) {
//     alert("Failed to copy link");
//   }
// };

// The link to share
const shareLink = ref(fullUrlPath.value);

// Functions to share on different platforms
const shareOnInstagram = () => {
  // Instagram does not support direct URL sharing, so we'll just provide a message.
  alert("Please share this link on Instagram: " + shareLink.value);
};

const shareOnTwitter = () => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=Check%20this%20out!&url=${encodeURIComponent(
    shareLink.value
  )}`;
  window.open(twitterUrl, "_blank");
};

const shareOnWhatsApp = () => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    "Check this out: " + shareLink.value
  )}`;
  window.open(whatsappUrl, "_blank");
};

const shareOnFacebook = () => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareLink.value
  )}`;
  window.open(facebookUrl, "_blank");
};

const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value).then(
    () => {
      alert("Link copied to clipboard!");
    },
    (err) => {
      console.error("Could not copy text: ", err);
    }
  );
};
</script>

<style scoped>
/* Additional styling for specific elements can be added here */
</style>
