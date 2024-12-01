<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
      <!-- Profile Section -->
      <div class="flex flex-col items-center">
        <img
          v-if="!tenantObj?.profilePicture"
          :src="dynamicImage('male-avatar.png')"
          alt="Profile Picture"
          class="w-32 h-32 rounded-full mb-4"
        />
        <img
         v-else
        :src="tenantObj?.profilePicture"
        alt="Profile Picture"
        class="w-32 h-32 rounded-full mb-4"
      />
        <h2 class="text-xl font-medium text-gray-800">{{tenantObj?.firstName}} {{tenantObj?.lastName}}</h2>
        <p class="text-gray-600 mb-4 text-sm">{{tenantObj?.email ?? '----'}}</p>
        <div class="text-sm text-gray-600 space-y-4 w-full">
          <p class="flex justify-between"><span class="text-[#667185]">Phone number:</span> {{tenantObj?.phoneNumber ?? '-----'}} </p>
          <p class="flex justify-between"><span class="text-[#667185]">Date of Birth:</span> {{tenantObj?.dateOfBirth ?? '----'}}</p>
          <p class="flex justify-between"><span class="text-[#667185]">Gender:</span> {{tenantObj?.gender ?? '----'}}</p>
          <p class="flex justify-between"><span class="text-[#667185]">Marital status:</span>{{tenantObj?.maritalStatus ?? '----'}}</p>
          <p class="flex justify-between"><span class="text-[#667185]">State of Origin:</span>{{tenantObj?.city?.name ?? '----'}}</p>
          <p class="flex justify-between"><span class="text-[#667185]">LGA:</span>{{tenantObj?.city?.stateName ?? '----'}}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
        import { dynamicImage } from '@/utils/assets';
        const props = defineProps({
          tenantObj: {
            type: Object
          }
        })
  // Add any required scripts here if needed
  </script>
  
  <style scoped>
  /* Additional custom styles if needed */
  </style>
  