<template>
    <div class="space-y-6">
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Recipient type</label>
        <select v-model="recipientType" class="w-full rounded-md border-gray-300">
          <option value="tenant">Tenant</option>
        </select>
      </div>
  
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Property</label>
        <select v-model="property" class="w-full rounded-md border-gray-300">
          <option value="blackcountry">BlackCountry Homes</option>
        </select>
      </div>
  
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">Recipient</label>
        <div class="relative">
          <input
            type="text"
            v-model="search"
            placeholder="Search"
            class="w-full rounded-md border-gray-300"
          />
          <div v-if="showDropdown" class="absolute w-full bg-white border rounded-md mt-1 shadow-lg">
            <div class="p-2 hover:bg-gray-100 cursor-pointer">All Tenants</div>
            <div @click="showDropdown = false" v-for="tenant in tenants" :key="tenant" class="p-2 hover:bg-gray-100 cursor-pointer">
              {{ tenant }}
            </div>
          </div>
        </div>
      </div>
  
      <div class="flex justify-end space-x-4 mt-8">
        <button
          @click="$emit('prev')"
          class="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          @click="$emit('next')"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const recipientType = ref('tenant');
  const property = ref('blackcountry');
  const search = ref('');
  const showDropdown = ref(true);
  
  const tenants = [
    'Lorenzo Connelly',
    'Garry Moore',
    'Jean Kirlin',
    'Elsa Nikolaus',
    'Peter Price',
    'Daniel Hermann',
    'Velma Nitzsche',
    'Robyn Fadel'
  ];
  </script>