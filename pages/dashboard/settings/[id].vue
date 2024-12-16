<template>
  <Layout class="">
    <template #header-content>
      <div class="flex w-full items-center justify-between">
        <div class="flex items-center gap-2">
          <button @click="router.back()" class="text-gray-600 bg-gray-25 px-6 py-3 rounded-lg hover:text-gray-800">
            <span class="flex items-center gap-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5 5C12.5 5 7.50001 8.68242 7.5 10C7.49999 11.3177 12.5 15 12.5 15" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              Back
            </span>
          </button>
          <h1 class="text-lg text-[#1D2739] font-medium">Rent Reminder</h1>
        </div>
        <div class="flex gap-2">
          <button class="px-4 py-2 bg-[#F0F2F5] text-[#292929] border-[0.5px] text-sm rounded-lg hover:text-gray-800">Delete</button>
          <button class="px-4 py-2 bg-[#EBE5E0] rounded-md text-sm">Edit</button>
          <button class="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-800 text-sm">Resend</button>
        </div>
      </div>
    </template>
    <div class="">

      <div class="mb-6">
        <div class="mb-4">
          <h2 class="text-[#475367] font-medium"><span class="font-semiboild text-[#1D2739]">Subject:</span> {{ scheduleInfoObj?.subject ?? 'Nil' }}</h2>
        </div>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-[#1D2739]">Recipients:</span>
          <!-- <div class="flex flex-wrap gap-2">
            <span class="text-[#326543]" v-for="(item, idx) in scheduleInfoObj?.recipients" :key="idx">{{ item }}</span>
          </div> -->

          <div>
    <div class="flex flex-wrap gap-2">
      <!-- Display limited or full list based on the showAll flag -->
      <span
        class="text-[#326543] text-sm "
        v-for="(item, idx) in displayedRecipients"
        :key="idx"
      >
        {{ item }}
      </span>
      <button
      v-if="scheduleInfoObj?.recipients?.length > 2"
      class="text-[#326543] text-sm inline"
      @click="toggleView"
    >
      {{ showAll ? "View Less" : "View More" }}
    </button>
    </div>
    <!-- Show the View More / View Less button conditionally -->
         </div>

        </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span class="px-3 py-2 rounded-full text-sm" :class="statusColorMap(scheduleInfoObj?.status)">
                        {{ scheduleTextMap(scheduleInfoObj?.status) }}
                      </span>
          <span class="text-[#1D2739]">
            {{ moment(scheduleInfoObj?.scheduleStartDate).format('DD MMMM YYYY, HH:mm:ss') }}
          </span>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Email Content -->
        <div class="bg-white rounded-lg  p-6">
          <div v-if="scheduleInfoObj?.message?.coverImageUrl" class="mb-6">
            <img :src="scheduleInfoObj?.message?.coverImageUrl" alt="Rent Reminder" class="w-full h-44 object-cover rounded-lg" />
          </div>

          
          <div class="space-y-4 text-[#1D2739]">
            <!-- <div v-html="sanitizedHtmlContent"></div> -->
            <p v-html="scheduleInfoObj?.message?.htmlContent"></p>
            <!-- <p>Hi there,</p>
            
            <p>This is a friendly reminder that your rent for [Property Name/Address] is due on [Due Date].</p>
            
            <p>Here are the details:</p>
            
            <ul class="list-disc pl-5 space-y-2">
              <li>Amount Due: [Amount]</li>
              <li>Payment Method: [Bank Transfer/Online Payment Platform]</li>
              <li>Payment Reference: [Reference Number]</li>
            </ul>
            
            <p>To avoid late fees, please ensure your payment is made on or before the due date. If you've already made the payment, kindly disregard this message.</p>
            
            <button class="underline text-[#326543] font-medium">Make Payment Now</button>
            
            <p>If you have any questions or need assistance, feel free to contact us.<br />Thank you for your prompt attention to this matter!</p>
            
            <p class="text-[#1D2739]">Cheers<br />BlackCountry Team</p> -->
          </div>
        </div>
  
        <!-- Attachments & Delivery -->
        <div class="space-y-6">
          <div class="border-[0.5px] border-gray-25 rounded-lg bg-white p-4">
            <h2 class="text-base text-[#1D2739] font-medium mb-4">Attachment</h2>
            <div class="grid grid-cols-2 gap-6">
              <div v-for="(attachment, idx) in scheduleInfoObj?.message?.attachments" :key="idx" class="gap-2 rounded-lg border-">
               <div class="border-[0.5px] border-gray-25 rounded-lg py-10 bg-gray-50 w-full flex justify-center items-center">
                <a :href="attachment?.path"><img src="@/assets/img/pdf-file.png" alt="PDF" class="w-8 h-8" /></a>
               </div>
                <div class="flex-1 pt-1">
                  <p class="text-sm font-medium">{{ attachment?.filename ?? 'Nil' }}.pdf</p>
                  <!-- <p class="text-xs text-gray-500">2056kb</p> -->
                </div>
              </div>
            </div>
          </div>
  
          <div>
            <SettingsDeliveries v-if="!loadingDeliveries && deliveriesList?.length" :loadingDeliveries="loadingDeliveries" :deliveriesList="deliveriesList" />
            <!-- <div v-else-if="loadingDeliveries && !deliveriesList?.length" class="absolute inset-0 flex justify-center items-center bg-gray-200 bg-opacity-50">
               <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            </div> -->
            <div
            v-else-if="loadingDeliveries && !deliveriesList?.length"
              class="h-32 bg-slate-200 rounded animate-pulse w-full m-3"
            ></div>

            <section v-else class="flex flex-col justify-between items-center mx-6 space-y-2 mt-10">
            <svg width="152" height="124" viewBox="0 0 152 124" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="76" cy="58" r="52" fill="#EAEAEA"/>
              <circle cx="21" cy="25" r="5" fill="#BDBDBD"/>
              <circle cx="18" cy="109" r="7" fill="#BDBDBD"/>
              <circle cx="145" cy="41" r="7" fill="#BDBDBD"/>
              <circle cx="134" cy="14" r="4" fill="#BDBDBD"/>
              <g filter="url(#filter0_b_6853_118795)">
                <rect x="52" y="34" width="48" height="48" rx="24" fill="#9D9D9D"/>
                <path d="M85.9598 56.9707C86.0134 57.8009 86.0134 58.6607 85.9598 59.4909C85.6856 63.7332 82.3536 67.1125 78.1706 67.3905C76.7435 67.4854 75.2536 67.4852 73.8294 67.3905C73.339 67.3579 72.8044 67.2409 72.344 67.0513C71.8318 66.8403 71.5756 66.7348 71.4454 66.7508C71.3153 66.7668 71.1264 66.9061 70.7487 67.1846C70.0827 67.6757 69.2437 68.0285 67.9994 67.9982C67.3703 67.9829 67.0557 67.9752 66.9148 67.7351C66.774 67.495 66.9494 67.1626 67.3002 66.4978C67.7867 65.5758 68.095 64.5203 67.6279 63.6746C66.8234 62.4666 66.1401 61.036 66.0402 59.4909C65.9866 58.6607 65.9866 57.8009 66.0402 56.9707C66.3144 52.7284 69.6464 49.3491 73.8294 49.0711C75.0318 48.9911 75.2812 48.9786 76.5 49.0337" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M72.5 61H79.5M72.5 56H76" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M86 51.5C86 53.433 84.433 55 82.5 55C80.567 55 79 53.433 79 51.5C79 49.567 80.567 48 82.5 48C84.433 48 86 49.567 86 51.5Z" stroke="white" stroke-width="1.5"/>
              </g>
            </svg>
            <h2 class="text-[#1D2739]">No Deliveries Available</h2>
          </section>
          
          </div>
        </div>
      </div>
    </div>
  </Layout>
  </template>
  
  <script setup lang="ts">
  import moment from "moment";
  import { useFetchSchedule  } from '@/composables/modules/settings/useFetchScheduleById'
  import {  useFetchSchedules } from '@/composables/modules/settings/useFetchDeliveries'
  const {  loadingDeliveries,
    deliveriesList } = useFetchSchedules()
    const { loading, scheduleInfoObj } = useFetchSchedule()
  import Layout from '@/layouts/dashboard.vue';
const router = useRouter()

const scheduleTextMap = (statusText: any) => {
    const textMap = {
      'pending': 'Scheduled',
      'sent': 'Sent',
      'draft': 'Draft',
    };

    return textMap[statusText] ?? '';
  };

  const statusColorMap = (statusText: any) => {
    const colorMap = {
      'pending': 'text-[#DD900D] bg-[#FEF6E7]',
      'sent': 'text-[#099137] bg-[#E7F6EC]',
      'draft': 'text-[#1D2739] bg-[#F9FAFB]',
    };

    return colorMap[statusText] ?? 'text-black'; // Default color
  };



  import DOMPurify from 'dompurify'; // Install DOMPurify for sanitizing HTML

// Define the type for the API response
interface BackendResponse {
  htmlContent: string;
}

// Define the type for dynamic data placeholders
interface DynamicData {
  firstName: string;
  lastName: string;
  propertyName: string;
  propertyAddress: string;
}

// Mock API response (replace with an actual API call in a production environment)
const apiResponse: BackendResponse = reactive({
  htmlContent:
    "<p>hello {{firstName}} {{lastName}} {{propertyName}} {{propertyAddress}}. This is the content of the notification.</p>",
});

// Mock dynamic data
const dynamicData: DynamicData = reactive({
  firstName: "John",
  lastName: "Doe",
  propertyName: "Palm Springs",
  propertyAddress: "123 Main St, CA",
});

// Function to replace placeholders in the HTML content
const processHtmlContent = (html: string, data: DynamicData): string => {
  let processedHtml = html;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g"); // Match {{key}} placeholders
    processedHtml = processedHtml?.replace(regex, value);
  });
  return processedHtml;
};

// Sanitize and process HTML content
const sanitizedHtmlContent = computed(() => {
  const processedHtml = processHtmlContent(scheduleInfoObj?.value?.message?.htmlContent, dynamicData);
  return DOMPurify.sanitize(processedHtml); // Sanitize HTML for security
});
  

// State to track whether to show all recipients
const showAll = ref(false);

// Method to toggle between showing all and limited recipients
const toggleView = () => {
  showAll.value = !showAll.value;
};

// Computed property to determine displayed recipients
const displayedRecipients = computed(() => {
  return showAll.value ? scheduleInfoObj.value?.recipients : scheduleInfoObj?.value?.recipients?.slice(0, 2);
});


  </script>