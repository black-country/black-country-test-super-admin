<template>
  <div class="space-y-6">
      <!-- Current Residence -->
      <div class="max-w-2xl mx-auto">
    <!-- Property Information -->
    <div class="mb-8">
      <h1 class="text-sm font-medium mb-6 bg-white py-3 rounded-lg px-5">Property Information</h1>
      
      <div class="space-y-6 bg-white rounded-lg p-5">
        <div>
          <p class="text-sm mb-2">Property name</p>
          <div class="bg-gray-50 p-4 rounded text-sm">{{tenantObj?.home?.house?.name ?? 'Nil'}}</div>
        </div>

        <div>
          <p class="text-sm mb-2">Room number</p>
          <div class="bg-gray-50 p-4 rounded text-sm">{{tenantObj?.home?.room?.name ?? 'Nil'}}</div>
        </div>
      </div>
    </div>

    <!-- Pre-screening Section -->
    <div>
      <h2 class="text-sm font-medium mb-6 bg-white py-3 rounded-lg px-5">Pre-screening questions</h2>
      
      <div class="space-y-6 bg-white rounded-lg p-5">
        <div v-for="(item, idx) in tenantObj?.home?.questionAnswers" :key="idx">
          <p class="text-sm mb-2 text-sm">{{ item?.question?.question ?? 'Nil' }}</p>
          <div class="bg-gray-50 p-4 text-sm rounded">{{ item?.answer ?? 'Nil' }}</div>
        </div>
      </div>
    </div>
  </div>

  <section>
    <div class="mb-6">
        <h3 class="text-base font-medium text-[#1D2739] mb-4 border-[0.5px] py-3 px-3 rounded-lg bg-white">Rental History</h3>
      </div>

    <div class="border-[0.5px] py-3 px-3 rounded-lg bg-white">
        <div class="space-y-5 p-3 text-sm">
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Current Landlord:</span> {{tenantObj?.currentLandlord ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Rental Address:</span> {{tenantObj?.rentalAddress ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Length of Tenancy:</span> {{tenantObj?.lengthOfTenancy ?? 'Nil'}}</p>
            <p class="flex justify-between items-center text-[#1D2739]"><span class="text-[#667185] font-light">Reason for moving out:</span> {{tenantObj?.reasonForMovingOut ?? 'Nil'}}</p>
        </div>
    </div>
  </section>

      <!-- Employment Information -->
      <section class="mb-6">
        <h3 class="text-base font-medium text-[#1D2739] mb-4 border-[0.5px] flex justify-between items-center py-3 px-3 rounded-lg bg-white">
          <span>Employment Information</span>
          <!-- <a href="#" class="text-blue-500">Edit</a> -->
        </h3>

        <div class="border-[0.5px] py-6 px-3 rounded-lg bg-white">
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
      <section class="mb-6">
        <h3 class="text-base font-medium text-[#1D2739] mb-4 border-[0.5px] py-3 px-3 rounded-lg bg-white">Next of Kin</h3>
    <div class="border-[0.5px] py-6 px-3 rounded-lg bg-white">
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

      <!-- ID Card -->
    <section>
      <h3 class="font-medium text-[#1D2739] text-sm mb-4 border-[0.5px] py-3 px-3 rounded-lg bg-white">Identity document</h3>
      <div class="border-[0.5px] py-3 px-3 rounded-lg bg-white text-sm">
        <div class="mb-4 space-y-3">
          <p>ID Type:</p>
          <h3 class="ttext-sm font-medium text-[#1D2739] mb-4 border-[0.5px] py-3 px-3 rounded-lg bg-[#E4E7EC]">{{ tenantObj?.home?.idDocs?.type ?? 'Nil' }}</h3>
        </div>
      <div v-if="tenantObj?.home?.idDocs?.fileUrls" class="grid grid-cols-2 gap-6">
        <img class="w-96 h- rounded-lg border border-gray-300" v-for="itm in tenantObj?.home?.idDocs?.fileUrls" :key="itm" :src="itm" />
      </div>
        <img
           v-else
          :src="dynamicImage('id-card.png')"
          alt="ID Card"
          class="w-96 h- rounded-lg border border-gray-300"
        />
      </div>
    </section>
    </div>
</template>

<script lang="ts" setup>
import { dynamicImage } from '@/utils/assets';
const props = defineProps({
        tenantObj: {
          type: Object
        }
      })
</script>