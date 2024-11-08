<template>
    <DashboardWithHeaderOnly>
        <template #left-content>
            <h2 class="text-lg font-semibold">{{leaseDocsObj?.rentalApplication?.house?.name ?? 'Nil'}} Lease agreement</h2>
          </template>
          <template #right-content>
            <div class="flex items-center gap-x-4">
         <button
                :class="[
                  'relative rounded-full font-semibold text-sm px-6 py-3',
                  `text-[${handleColor(leaseDocsObj.status).textColor}]`,
                  `bg-[${handleColor(leaseDocsObj.status).bgColor}]`
                ]"
              >
                {{ handleColor(leaseDocsObj.status).text }}
              </button>
              
              <button :disabled="isDownloading"  v-if="leaseDocsObj.status === 'SIGNED'" @click="downloadAgreement" class="bg-[#292929] disabled:cursor-not-allowed disabled:opacity-25 text-white px-6 py-3 rounded-lg flex items-center gap-x-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.99935 12.0833V3.75M9.99935 12.0833C9.41585 12.0833 8.32562 10.4214 7.91602 10M9.99935 12.0833C10.5828 12.0833 11.6731 10.4214 12.0827 10" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16.6673 13.75C16.6673 15.8183 16.2357 16.25 14.1673 16.25H5.83398C3.76565 16.25 3.33398 15.8183 3.33398 13.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    {{  isDownloading ? 'downloading...' : 'Download' }}
            </button>
                <button v-if="leaseDocsObj.status === 'DRAFT'" @click="editLeaseAgreement" class="bg-[#292929] text-white px-6 py-3 rounded-lg flex items-center gap-x-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5111 4.15199L14.6792 2.98386C15.3244 2.33871 16.3703 2.33871 17.0155 2.98386C17.6606 3.629 17.6606 4.67498 17.0155 5.32012L15.8473 6.48826M13.5111 4.15199L9.14952 8.51358C8.27846 9.38467 7.8429 9.82016 7.54632 10.3509C7.24974 10.8817 6.95135 12.1349 6.66602 13.3333C7.86442 13.048 9.11768 12.7496 9.64843 12.453C10.1792 12.1564 10.6147 11.7209 11.4858 10.8498L15.8473 6.48826M13.5111 4.15199L15.8473 6.48826" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M17.5 10C17.5 13.5355 17.5 15.3033 16.4017 16.4017C15.3033 17.5 13.5355 17.5 10 17.5C6.46447 17.5 4.6967 17.5 3.59835 16.4017C2.5 15.3033 2.5 13.5355 2.5 10C2.5 6.46447 2.5 4.6967 3.59835 3.59835C4.6967 2.5 6.46447 2.5 10 2.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                   Edit</button>
            </div>
          </template>
    <main>
            <div  ref="leaseAgreementContent" class="bg-white p-6 rounded-lg max-w-5xl mx-auto w-full border-[0.5px] shadow-sm border-gray-100 my-10">
              <div v-html="leaseDocsObj?.leaseAgreementContent" class="p-4 rounded-lg shadow-sm"></div>
              <div class="mt-6">
                <h2 class="text- font-medium mb-2">Signature</h2>
                <p class="text-gray-500 mb-6">
                  The parties hereto have executed this Lease Agreement as of the
                  date first above written.
                </p>
    
                <div class="mb-4">
                  <h3 class="text-sm font-medium mb-2">
                    Landlord/Property Manager:
                  </h3>
                  <label class="block text-sm text-gray-500 mb-1">Signature</label>
                  <img :src="leaseDocsObj?.houseOwnerSignatureUrl" alt="Signature"
                  class="w-full border-b-2 border-dotted py-2 mb-4  bg-transparent outline-none placeholder-gray-400" />
                  <label class="block text-sm text-gray-500 mb-1">Full Name</label>
                  <div class="border-b-2 border-dotted text-gray-800 py-2 mb-4">
                    {{ leaseDocsObj?.houseOwnerSigneeName }}
                  </div>
                  <label class="block text-sm text-gray-500 mb-1">Date</label>
                  <div class="border-b-2 border-dotted text-gray-800 py-2 mb-8">
                    {{ moment(leaseDocsObj?.signedAt).format('DD MMMM YYYY, HH:mm:ss') }}
                  </div>
                </div>
    
                <div class="mb-4">
                  <h3 class="text-base font-medium mb-2">Tenant:</h3>
                  <label class="block text-sm text-gray-500 mb-1">Full Name</label>
                    <div class="border-b-2 border-dotted text-gray-800 py-2 mb-4">
                        {{ leaseDocsObj?.signeeName }}
                      </div>
                  <label class="block text-sm text-gray-500 mb-1">Signature</label>
                  <img :src="leaseDocsObj?.signatureUrl" alt="Signature"
                    class="w-full border-b-2 border-dotted py-2 mb-4 bg-transparent outline-none placeholder-gray-400" />
                  <label class="block text-sm text-gray-500 mb-1">Date</label>
                  <div class="border-b-2 border-dotted text-gray-800 py-2 mb-8">
                    {{ moment(leaseDocsObj?.createdAt).format('DD MMMM YYYY, HH:mm:ss') }}
                  </div>
                </div>
              </div>
            </div>
    </main>
</DashboardWithHeaderOnly>
</template>


<script setup lang="ts">
  import moment from "moment";
import DashboardWithHeaderOnly from '@/layouts/DashboardWithHeaderOnly.vue'
import { useDownloadPdf } from '@/composables/core/useDownloadPdf'; 
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

// Initialize composable
const { downloadPdf, isDownloading } = useDownloadPdf();

const router = useRouter()
const leaseDocsObj = ref({})
const leaseAgreementContent = ref(null); // Reference for the lease agreement content

onMounted(() => {
    leaseDocsObj.value = JSON.parse(localStorage.getItem('selected-lease-document'))
})

const colorMap = {
  "SIGNED": {
    text: 'Signed',
    bgColor: '#E7F6EC',
    textColor: '#099137'
  },
  "PENDING_SIGNAGE": {
    text: 'Pending',
    bgColor: '#FEF6E7',
    textColor: '#D75626'
  },
  "DRAFT": {
    text: 'Draft',
    bgColor: '#F0F2F5',
    textColor: '#1D2739'
  }
};

const handleColor = (statusText: string) => {
  return colorMap[statusText] || {
    text: 'Unknown',
    bgColor: '#ffffff',
    textColor: '#000000'
  };
};

// Function to trigger PDF download
const downloadAgreement = () => {
  if (leaseAgreementContent.value) {
    downloadPdf(leaseAgreementContent.value, `${leaseDocsObj?.value?.rentalApplication?.house?.name}-lease-agreement`); // Pass the ref element directly
  } else {
    showToast({
          title: "Error",
          message: "No lease agreement content available",
          toastType: "error",
          duration: 3000
        });
  }
};


const editLeaseAgreement = () => {
    router.push(`/dashboard/property/lease-documents/${leaseDocsObj?.value?.id}/edit`)
}

</script>
