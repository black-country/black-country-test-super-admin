<template>
  <div v-if="!leaseDocumentsList?.length && !loading" class="text-center text-gray-500 py-12">
    <img src="@/assets/icons/config-illustration.svg" alt="No transactions" class="h-12 w-12 mx-auto mb-2" />
    <p>No Lease documents available</p>
  </div>
  <section class="my-6" v-if="!leaseDocumentsList?.length && loading">
    <div class="animate-pulse flex space-x-4 h-44 bg-slate-200 rounded"></div>
  </section>

  <section v-else class="grid lg:grid-cols-2 gap-4 mt-6">
    <div class="bg-white rounded-lg p-4 flex flex-col h-[300px]" v-for="itm in leaseDocumentsList" :key="itm">
      <div class="p-2 flex-1 text-sm object-cover rounded-lg shadow-sm overflow-hidden"
        v-if="!containsHttps(itm?.leaseAgreementContent)" v-html="itm?.leaseAgreementContent"></div>
      <div v-else>
        <iframe
          :src="`https://docs.google.com/viewer?url=${encodeURIComponent(extractUrl(itm?.leaseAgreementContent))}&embedded=true`"
          class="w-full h-44" frameborder="0"></iframe>
      </div>
      <div class="flex justify-between items-center mt-4">
        <div class="space-y-1">
          <h6 class="text-base font-semibold text-gray-800">Lease document for {{ itm?.signeeName ?? 'Nil' }}</h6>
          <p class="text-xs text-gray-600">Tenant: <span class="font-medium text-[#1D2739]">{{ itm?.signeeName ?? 'Nil'
              }}</span></p>
          <p class="text-xs text-gray-600">Last updated: <span class="font-medium text-[#1D2739]">
              {{ moment(itm?.signedAt).format('DD MMMM YYYY, HH:mm:ss') }}</span></p>
        </div>
        <div class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0" >
        <button @click="toggleDropdown(itm.id)" :id="'drop-options-' + itm.id" class="p-2">
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.4922 12H12.5012" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M12.4844 18H12.4934" stroke="#1D2739" stroke-width="2.5" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M12.5 6H12.509" stroke="#1D2739" stroke-width="2.5" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <div v-if="openDropdown === itm.id" class="absolute right-0 z-10 mt-2 w-60 bg-gray-25 shadow-lg rounded-md">
          <ul class="divide-y divide-gray-100">
            <li class="p-2 text-sm cursor-pointer">
              <button @click="viewTemplate(itm)" class="flex py-1.5 text-[#1D2739] items-center font-medium gap-x-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.9527 9.20449C18.206 9.55974 18.3327 9.73741 18.3327 10.0003C18.3327 10.2632 18.206 10.4409 17.9527 10.7962C16.8143 12.3925 13.907 15.8337 9.99935 15.8337C6.09167 15.8337 3.18443 12.3925 2.04605 10.7962C1.79269 10.4409 1.66602 10.2632 1.66602 10.0003C1.66602 9.73741 1.79269 9.55974 2.04605 9.20449C3.18443 7.60819 6.09167 4.16699 9.99935 4.16699C13.907 4.16699 16.8143 7.60819 17.9527 9.20449Z"
                    stroke="#5B8469" stroke-width="1.5" />
                  <path
                    d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z"
                    stroke="#5B8469" stroke-width="1.5" />
                </svg>

                View
              </button>
            </li>

            <li class="p-2 text-sm cursor-pointer">
              <button :disabled="isDownloading" @click="downloadTemplate(itm)"
                class="flex py-1.5 text-[#1D2739] disabled:cursor-not-allowed disabled:opacity-25 items-center font-medium gap-x-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.99935 12.0833V3.75M9.99935 12.0833C9.41585 12.0833 8.32562 10.4214 7.91602 10M9.99935 12.0833C10.5828 12.0833 11.6731 10.4214 12.0827 10"
                    stroke="#5B8469" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M16.6673 13.75C16.6673 15.8183 16.2357 16.25 14.1673 16.25H5.83398C3.76565 16.25 3.33398 15.8183 3.33398 13.75"
                    stroke="#5B8469" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ isDownloading ? 'downloading...' : 'Preview & Download' }}
              </button>
            </li>
          </ul>
        </div>
        </div>

      </div>
    </div>
  </section>




  <div v-if="showPreview" class="fixed inset-0 bg-gray-800 z-50 bg-opacity-50 flex items-center justify-center">
    <section class="bg-white py-4 rounded-t-lg">
      <h2 class="text-lg font-semibold mb-4 pl-10">Preview Document and download</h2>
      <div class="bg-white p-6 rounded-lg max-w-2xl w-full h-[500px] overflow-y-auto">
        <div ref="leaseAgreementContent">
          <div v-html="selectedLease?.leaseAgreementContent" class="p-4"></div>
          <div class="mt-6 px-6">
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
              <img :src="selectedLease?.houseOwnerSignatureUrl" alt="Signature"
                class="w-full border-b-2 border-dotted py-2 mb-4  bg-transparent outline-none placeholder-gray-400" />
              <label class="block text-sm text-gray-500 mb-1">Full Name</label>
              <div class="border-b-2 border-dotted text-gray-800 py-2 mb-4">
                {{ selectedLease?.houseOwnerSigneeName }}
              </div>
              <label class="block text-sm text-gray-500 mb-1">Date</label>
              <div class="border-b-2 border-dotted text-gray-800 py-2 mb-8">
                {{ moment(selectedLease?.signedAt).format('DD MMMM YYYY, HH:mm:ss') }}
              </div>
            </div>

            <div class="mb-4">
              <h3 class="text-base font-medium mb-2">Tenant:</h3>
              <label class="block text-sm text-gray-500 mb-1">Full Name</label>
              <div class="border-b-2 border-dotted text-gray-800 py-2 mb-4">
                {{ selectedLease?.signeeName }}
              </div>
              <label class="block text-sm text-gray-500 mb-1">Signature</label>
              <img :src="selectedLease?.signatureUrl" alt="Signature"
                class="w-full border-b-2 border-dotted py-2 mb-4 bg-transparent outline-none placeholder-gray-400" />
              <label class="block text-sm text-gray-500 mb-1">Date</label>
              <div class="border-b-2 border-dotted text-gray-800 py-2 mb-8">
                {{ moment(selectedLease?.createdAt).format('DD MMMM YYYY, HH:mm:ss') }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-between items-center gap-x-4">
          <button @click="showPreview = false"
            class="px-4 py-3.5 bg-red-500 w-full text-white rounded-md flex justify-center items-center">
            Close
          </button>
          <button :disabled="isDownloading" @click="downloadAgreement"
            class="bg-[#292929] w-full disabled:cursor-not-allowed disabled:opacity-25 text-white px-6 py-3.5 rounded-lg flex justify-center items-center gap-x-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.99935 12.0833V3.75M9.99935 12.0833C9.41585 12.0833 8.32562 10.4214 7.91602 10M9.99935 12.0833C10.5828 12.0833 11.6731 10.4214 12.0827 10"
                stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M16.6673 13.75C16.6673 15.8183 16.2357 16.25 14.1673 16.25H5.83398C3.76565 16.25 3.33398 15.8183 3.33398 13.75"
                stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ isDownloading ? 'downloading...' : 'Download' }}
          </button>
        </div>
      </div>
    </section>
  </div>


</template>

<script lang="ts" setup>
import moment from "moment";
import { useUrlExtractor } from '@/composables/core/useUrlExtractor';
import { useHttpsDetector } from '@/composables/core/useUrlCheck'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useFetchLeaseDocuments } from '@/composables/modules/tenants/useFetchLeaseDocuments'
import { useDownloadPdf } from '@/composables/core/useDownloadPdf';
const { leaseDocumentsList, loading } = useFetchLeaseDocuments()
const { containsHttps } = useHttpsDetector();
const { extractUrl } = useUrlExtractor();
const selectedLease = ref({});
const showPreview = ref(false);
const { showToast } = useCustomToast();
const router = useRouter()

const { downloadPdf, isDownloading } = useDownloadPdf();

const leaseAgreementContent = ref(null); // Reference for the lease agreement content


const openDropdown = ref<number | null>(null);
const toggleDropdown = (id: number) => {
  openDropdown.value = openDropdown.value === id ? null : id;
};


const dropdownVisible = ref<null | number>(null);

// Close dropdown when clicking outside the specific row
const handleClickOutside = (event: MouseEvent) => {
  const dropdownId = `drop-options-${openDropdown.value}`;
  const dropdownButton = document.getElementById(dropdownId);
  if (dropdownButton && !dropdownButton.contains(event.target as Node)) {
    openDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const downloadAgreement = async () => {
  console.log(selectedLease.value)
  if (selectedLease.value) {
    await downloadPdf(leaseAgreementContent.value, `${selectedLease.value?.agreementName?.house?.name}-lease-agreement`); // Pass the ref element directly
    showPreview.value = false
  } else {
    showToast({
      title: "Error",
      message: "No lease agreement content available",
      toastType: "error",
      duration: 3000
    });
  }
};

const downloadTemplate = (item: any) => {
  selectedLease.value = item
  showPreview.value = true
};

const viewTemplate = (itm: any) => {
  // showPreview.value = true
  selectedLease.value = itm;
  localStorage.setItem("selected-lease-document", JSON.stringify(itm));
  router.push(`/dashboard/property/lease-documents/${itm.id}/preview`);
  dropdownVisible.value = null;
};

</script>

<style scoped>
.pdf-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>