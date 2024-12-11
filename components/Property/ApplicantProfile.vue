<template>
    <div class="p-6 bg-white rounded-lg shadow-md">
      <!-- Profile Section -->
      <div class="flex flex-col items-center">
        <img
          v-if="!rentalObj?.tenant?.profilePicture"
          :src="dynamicImage('male-avatar.png')"
          alt="Profile Picture"
          class="w-32 h-32 rounded-full mb-4"
        />
        <img
         v-else
        :src="rentalObj?.tenant?.profilePicture"
        alt="Profile Picture"
        class="w-32 h-32 rounded-full mb-4"
      />
        <h2 class="text-xl font-medium text-gray-800">{{rentalObj?.tenant?.firstName}} {{rentalObj?.tenant?.lastName}}</h2>
        <p class="text-gray-600 mb-4 text-sm">{{rentalObj?.tenant?.email ?? '----'}}</p>
        <div class="text-sm text-gray-600 space-y-4 w-full">
          <p class="flex justify-between"><span class="text-[#667185]">Phone number:</span> {{rentalObj?.tenant?.phoneNumber ?? '-----'}} </p>
          <p class="flex justify-between"><span class="text-[#667185]">Date of Birth:</span> {{rentalObj?.tenant?.dateOfBirth ?? '----'}}</p>
          <p class="flex justify-between"><span class="text-[#667185]">Gender:</span> {{rentalObj?.tenant?.gender ?? '----'}}</p>
          <p class="flex justify-between"><span class="text-[#667185]">Marital status:</span>{{rentalObj?.tenant?.maritalStatus ?? '----'}}</p>
          <p class="flex justify-between"><span class="text-[#667185]">State of Origin:</span>{{rentalObj?.tenant?.city?.stateName ?? '----'}}</p>
          <p class="flex justify-between"><span class="text-[#667185]">LGA:</span>{{rentalObj?.tenant?.city?.name ?? '----'}}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
        import { dynamicImage } from '@/utils/assets';
        const props = defineProps({
          rentalObj: {
            type: Object
          }
        })
  // Add any required scripts here if needed
  </script>
  
  <style scoped>
  /* Additional custom styles if needed */
  </style>
  