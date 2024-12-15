<template>
  <div class="min-h-screen flex flex-col justify-between">
    <!-- Main Content -->
    <div class="space-y-6">
      <h2 class="font-semibold text-lg">Define your audience</h2>
      <!-- {{ recipientType }}
      {{ selected }}
      {{ property }} -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Recipient type</label>
        <select
          v-model="recipientType"
          class="w-full text-sm outline-none border py-4 pl-5 placeholder:text-[#98A2B3] bg-[#F0F2F5] rounded-md border-gray-25"
        >
          <option value="tenant">Tenant</option>
          <option value="agent">Agent</option>
          <option value="service_provider">Service Provider</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <div v-if="recipientType === 'tenant'" class="space-y-4">
        <PropertySelector
          :multiple="true"
          label="Property"
          @property-selected="handleSelectedProperty"
          v-model="property"
        />
      </div>
      
      <CoreMultiSelect
      v-model="selected"
      :items="compotedUsersList"
      label="Recipient"
      placeholder="Search users..."
      :loading="loadingTenants"
      @search="handleSearch"
      @select="handleSelect"
      @remove="handleRemove"
      @change="handleChange"
    >
    </CoreMultiSelect>

    </div>
  
    <!-- Footer Buttons -->
    <div class="border-t border-gray-50 bg-white flex justify-between  lg:px-32 items-center space-x-4 p-4 fixed bottom-0 left-0 w-full">
      <button
        @click="emit('prev')"
        type="button"
        class="px-6 py-2.5 border rounded-md text-[#292929] bg-[#EBE5E0]"
      >
        Previous
      </button>
      <!-- <button
        @click="$emit('next')"
        class="px-6 py-2.5 rounded-md bg-[#292929] text-white"
      >
        Next
      </button> -->
      <button
        @click="emitData()"
        :disabled="!isValid"
        type="button"
        class="px-6 py-2.5 disabled:cursor-not-allowed disabled:opacity-25 rounded-md bg-[#292929] text-white"
      >
        Next
      </button>
    </div>
  </div>
</template>

  
  <script setup lang="ts">
    import { useGetMembers } from "@/composables/modules/member/fetch";
  import { useGetTenants } from '@/composables/modules/tenants/fetch'
    import { useGetProperties } from '@/composables/modules/property/fetchProperties'
    const { loadingProperties, propertiesList, metadata } = useGetProperties()
    const {
    loadingMembers,
    membersList,
    serviceProviders,
    agents,
    admins,
    getMembers
  } = useGetMembers();
  const recipientType = ref('tenant');
  const property = ref('');
  const {
        loadingTenants,
        tenantsList,
        searchQuery,
        applyFilters, 
} = useGetTenants();

const emit = defineEmits(['next', 'prev'])

const compotedUsersList = computed(() => {
  switch (recipientType.value) {
    case 'tenant':
      return tenantsList.value;
    case 'agent':
      return agents.value;
    case 'service_provider':
      return serviceProviders.value;
    case 'staff':
      return admins.value;
    default:
      // Log or handle an unrecognized recipient type
      console.warn(`Unrecognized recipient type: ${recipientType.value}`);
      return [];
  }
});
  

  const handleSelectedProperty = (data: any) => {
    property.value = data.id
}

// // Handle search input
const handleSearch = (query: string) => {
  searchQuery.value = query;
  if (recipientType.value === "tenant") {
    applyFilters();
  } else {
    getMembers({ search: query });
  }
};



const selected = ref([])

const isValid = computed(() => recipientType.value !== '' && selected.value !== []);

// Emit data to parent
const emitData = () => {
  if (isValid.value) {
    emit("next", {
    recipientType: recipientType.value,
    property: property.value,
    selectedRecipients: selected.value,
  });
  }
};

  // const handleSearch = (query: string) => {
  //   // Handle search
  // }
  
  const handleChange = (items: any[]) => {
    console.log('Selected items:', items)
  }
  </script>