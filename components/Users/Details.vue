<template>
<main>
  <div class="border-b border-gray-25 pb-3 overflow-x-auto">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <a 
          href="#" 
          :class="{
            'border-[#326543] text-[#326543]': activeTab === 'tenantDetails',
            'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': activeTab !== 'tenantDetails'
          }"
          class="whitespace-nowrap border-b-4 px-1 py-3 text-sm font-medium" 
          @click.prevent="setActiveTab('tenantDetails')"
        >
          User’s details
        </a>
        <a 
  href="#" 
  :class="{
    'border-[#326543] text-[#326543]': activeTab === 'paymentHistory' && tenantObj.home !== null,
    'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': activeTab !== 'paymentHistory' && tenantObj.home !== null,
    'cursor-not-allowed text-gray-400': tenantObj.home === null
  }"
  class="whitespace-nowrap border-b-4 px-1 py-3 text-sm font-medium"
  :disabled="tenantObj.home === null"
  @click.prevent="tenantObj.home !== null && setActiveTab('paymentHistory')"
>
  Payment history
</a>
<a
  href="#" 
  :class="{
    'border-[#326543] text-[#326543]': activeTab === 'leaseDocument' && tenantObj.home !== null,
    'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': activeTab !== 'leaseDocument' && tenantObj.home !== null,
    'cursor-not-allowed text-gray-400': tenantObj.home === null
  }"
  class="whitespace-nowrap border-b-4 px-1 py-3 text-sm font-medium"
  :disabled="tenantObj.home === null"
  @click.prevent="tenantObj.home !== null && setActiveTab('leaseDocument')"
>
  Lease Document
</a>
<a 
  href="#" 
  :class="{
    'border-[#326543] text-[#326543]': activeTab === 'maintenanceRequest' && tenantObj.home !== null,
    'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': activeTab !== 'maintenanceRequest' && tenantObj.home !== null,
    'cursor-not-allowed text-gray-400': tenantObj.home === null
  }"
  class="whitespace-nowrap border-b-4 px-1 py-3 text-sm font-medium"
  :disabled="tenantObj.home === null"
  @click.prevent="tenantObj.home !== null && setActiveTab('maintenanceRequest')"
>
  Maintenance request
</a>

        <!-- <a 
          href="#" 
          :class="{
            'border-[#326543] text-[#326543]': activeTab === 'paymentHistory',
            'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': activeTab !== 'paymentHistory'
          }"
          class="whitespace-nowrap border-b-4 px-1 py-3 text-sm font-medium disabled" 
          @click.prevent="setActiveTab('paymentHistory')"
        >
          Payment history
        </a>
        <a
          href="#" 
          :class="{
            'border-[#326543] text-[#326543]': activeTab === 'leaseDocument',
            'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': activeTab !== 'leaseDocument'
          }"
          class="whitespace-nowrap border-b-4 px-1 py-3 text-sm font-medium" 
          @click.prevent="setActiveTab('leaseDocument')"
        >
          Lease Document
        </a>
        <a 
          href="#" 
          :class="{
            'border-[#326543] text-[#326543]': activeTab === 'maintenanceRequest',
            'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700': activeTab !== 'maintenanceRequest'
          }"
          class="whitespace-nowrap border-b-4 px-1 py-3 text-sm font-medium" 
          @click.prevent="setActiveTab('maintenanceRequest')"
        >
          Maintenance request
        </a> -->
      </nav>
  </div>

    <TenantPaymentList v-if="activeTab === 'paymentHistory'" />
    <TenantLeaseDocument v-if="activeTab === 'leaseDocument'" />
    <TenantsMaintenenceRequests :showTabs="false"  v-if="activeTab === 'maintenanceRequest'"  />
    <TenantChecklist v-if="activeTab === 'checklist'" />
    <!-- <TenantMaintanceInfo v-if="activeTab === 'maintenanceRequest'" /> -->
      <!-- Current Residence -->
    <section class="space-y-6" v-if="activeTab === 'tenantDetails'">
        <div class="max-w-2xl mx-auto">
    <!-- Property Information -->
    <div v-if="tenantObj?.home" class="mb-8">
      <h1 class="text-sm font-medium mb-6 bg-white py-3 rounded-lg px-5">Current residence</h1>
      <!-- {{ tenantObj.home }} -->
      <div class="space-y-6 bg-white rounded-lg p-5">
        <div>
          <p class="text-sm mb-2">Current Home</p>
          <div class="bg-gray-50 p-4 rounded text-sm">{{tenantObj?.home?.house?.name ?? 'Nil'}}</div>
        </div>

        <div>
          <p class="text-sm mb-2">Room number</p>
          <div class="bg-gray-50 p-4 rounded text-sm">{{tenantObj?.home?.room?.name ?? 'Nil'}}</div>
        </div>

        <div>
          <p class="text-sm mb-2">Current payment status</p>
          <div class="bg-gray-50 p-4 rounded text-sm">{{tenantObj?.home?.rentPayment?.status ?? 'Nil'}}</div>
        </div>

        <div>
          <p class="text-sm mb-2">Payment frequency</p>
          <div class="bg-gray-50 p-4 rounded text-sm">{{tenantObj?.home?.rentPayment?.rentFrequency ?? 'Nil'}}</div>
        </div>

        <div>
          <p class="text-sm mb-2">Payment cZount</p>
          <div class="bg-gray-50 p-4 rounded text-sm">{{tenantObj?.home?.rentPayment?.totalNumberOfPays ?? 'Nil'}}</div>
        </div>

        <div>
          <p class="text-sm mb-2">Lease start date</p>
          <div class="bg-gray-50 p-4 rounded text-sm">
            {{ moment(tenantObj?.home?.rentalLeaseAgreement?.startDate).format('DD MMMM YYYY') }}
            <!-- {{tenantObj?.home?.rentalLeaseAgreement?.startDate  ?? 'Nil'}} -->
          </div>
        </div>

        <div>
          <p class="text-sm mb-2">Lease end date</p>
          <div class="bg-gray-50 p-4 rounded text-sm">
            {{ moment(tenantObj?.home?.rentalLeaseAgreement?.endDate).format('DD MMMM YYYY') }}
            <!-- {{tenantObj?.home?.rentalLeaseAgreement?.endDate  ?? 'Nil'}} -->
          </div>
        </div>
      </div>
    </div>
     </div>

  <section class="px-3">
    <div class="mb-6">
        <h3 class="text-base font-medium text-[#1D2739] mb-4 border-[0.5px] border-gray-25 py-3 px-3 rounded-lg bg-white">Rental History</h3>
      </div>

    <div class="border-[0.5px]  border-gray-25 py-3 px-3 rounded-lg bg-white">
        <div class="space-y-5 p-3 text-sm">
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Current Landlord:</span> {{tenantObj?.currentLandlord ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Rental Address:</span> {{tenantObj?.rentalAddress ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Length of Tenancy:</span> {{tenantObj?.lengthOfTenancy ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Reason for moving out:</span> {{tenantObj?.reasonForMovingOut ?? 'Nil'}}</p>
        </div>
    </div>
  </section>

      <!-- Employment Information -->
      <section class="mb-6 px-3">
        <h3 class="text-base font-medium text-[#1D2739] mb-4 border-[0.5px] border-gray-25 flex justify-between items-center py-3 px-3 rounded-lg bg-white">
          <span>Employment Information</span>
          <!-- <a href="#" class="text-blue-500">Edit</a> -->
        </h3>

        <div class="border-[0.5px]  border-gray-25 py-6 px-3 rounded-lg bg-white">
            <div class="space-y-5 p-3 text-sm">
                <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Employment Status:</span> {{tenantObj?.employmentStatus ?? 'Nil'}}</p>
                <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Employer’s full name:</span> {{tenantObj?.employerName ?? 'Nil'}}</p>
                <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Occupation:</span>{{tenantObj?.occupation ?? 'Nil'}}</p>
                <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Organization address:</span>{{tenantObj?.employerAddress ?? 'Nil'}}</p>
                <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Monthly Net salary:</span>{{tenantObj?.monthlyNetSalary ?? 'Nil'}}</p>
              </div>
        </div>
      </section>

      <!-- Next of Kin -->
      <section class="mb-6 px-3">
        <h3 class="text-base font-medium text-[#1D2739] mb-4 border-[0.5px] border-gray-25 py-3 px-3 rounded-lg bg-white">Next of Kin</h3>
    <div class="border-[0.5px]  border-gray-25  py-6 px-3 rounded-lg bg-white">
        <div class="space-y-5 p-3 text-sm">
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Full name:</span> {{tenantObj?.nextOfKinName ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Relationship:</span> {{tenantObj?.nextOfKinRelationship ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Email address:</span> {{tenantObj?.nextOfKinEmail ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Residential address:</span>{{tenantObj?.nextOfKinAddress ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Phone number:</span>{{tenantObj?.nextOfKinPhone ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Occupation:</span>{{tenantObj?.nextOfKinOccupation ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Organization name:</span> {{tenantObj?.nextOfKinEmployer ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Office address:</span>{{tenantObj?.nextOfKinEmployerAddress ?? 'Nil'}}</p>
          </div>
    </div>
      </section>
    </section>
</main>
</template>

<script lang="ts" setup>
import moment from "moment";
import { dynamicImage } from '@/utils/assets';
const props = defineProps({
        tenantObj: {
          type: Object
        }
      })

      const activeTab = ref('tenantDetails')

      const setActiveTab = (item: any) => {
        activeTab.value = item
      }
</script>

