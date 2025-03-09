<template>
    <div 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 "  
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[60%] overflow-auto custom-scrollbar">
        <h2 class="text-lg font-semibold mb-4">Filter</h2>
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">Date created/updated</label>
              <input 
                type="date" 
                placeholder="From" 
                v-model="fromDate"
                class="w-full px-4 py-3.5 border-[0.5px] text-sm bg-[#F0F2F5] rounded-lg outline-none"
              />
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-[#1D2739]"> </label>
              <input 
                type="date" 
                placeholder="To" 
                v-model="toDate"
                class="w-full px-4 py-3.5 border-[0.5px] text-sm bg-[#F0F2F5] rounded-lg outline-none"
              />
            </div>
          </div>
          <div class="space-y-1 relative">
            <!-- <label class="block text-sm font-medium text-[#1D2739]">Property name</label> -->
            <!-- <CoreSelect /> -->
            <CoreSelectProperty
            v-model="selectedPropertyName"
                  :options="propertiesList"
                  label="Property"
                  placeholder="Select a property..."
                  @select="handlePropertySelect"
              />
            <!-- <input type="text" readonly placeholder="Single agent/property manager" v-model="selectedPropertyName"
            @click="togglePropertyDropdown"
            class="w-full bg-[#F0F2F5] text-sm py-3 px-4 border-[0.5px] outline-none border-gray-100 rounded-md cursor-pointer" />
            <div v-if="showPropertyDropdown" ref="dropdown"
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
                  <ul v-if="!loadingProperties">
                      <li v-for="property in propertiesList" :key="property.id" @click="selectProperty(property)"
                          class="px-4 py-3 text-sm border-b-[0.5px] last:border-b-0 hover:bg-gray-50 cursor-pointer">
                          {{ property.name}}
                      </li>
                  </ul>
              </div> -->
          </div>
          <div class="space-y-1">
            <!-- <label class="block text-sm font-medium text-[#1D2739]">Agent/Property manager assigned</label> -->
            <CoreSelectTenant
                v-model="selectedUserText"
                 :options="agentsList"
                label="Single agent/property manager"
                placeholder="Search and select an agent..."
                @select="handleAgentSelect"
              />
            <!-- <div class="mt-1 relative">
              <input type="text" readonly placeholder="Single agent/property manager" v-model="selectedUserText"
                  @click="toggleDropdown"
                  class="w-full bg-[#F0F2F5] text-sm py-3 px-4 border-[0.5px] outline-none border-gray-100 rounded-md cursor-pointer" />
              <div v-if="showDropdown" ref="dropdown"
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
                  <ul v-if="!loading">
                      <li v-for="user in agentsList" :key="user.id" @click="selectUser(user)"
                          class="px-4 py-3 text-sm border-b-[0.5px] last:border-b-0 hover:bg-gray-50 cursor-pointer">
                          {{ user.firstName }} {{ user.lastName }}
                      </li>
                  </ul>
              </div>
          </div> -->
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-medium text-[#1D2739]">Property Status</label>
            <div class="mt-1 relative">
              <input type="text" readonly placeholder="Single property status" v-model="selectedStatusText"
                  @click="toggleStatusDropdown"
                  class="w-full bg-[#F0F2F5] text-sm py-3 px-4 border-[0.5px] outline-none border-gray-100 rounded-md cursor-pointer" />
              <div v-if="showStatusDropdown" ref="dropdown"
                  class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1">
                  <ul>
                      <li v-for="status in propertyStatusList" :key="status.code" @click="selectStatus(status)"
                          class="px-4 py-3 text-sm border-b-[0.5px] last:border-b-0 hover:bg-gray-50 cursor-pointer">
                          {{ status.label }}
                      </li>
                  </ul>
                </div>
          </div>
          </div>

        </div>
        <div class="mt-10 flex justify-between gap-x-6 pt-20">
          <button class="bg-[#EBE5E0] font-semibold text-[#292929] w-full px-4 py-3 text-sm rounded-md" @click="resetFilters">Reset</button>
          <button class="bg-[#292929] font-semibold w-full text-white px-4 py-3 text-sm rounded-md"  @click="applyFilters">Apply filter</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useGetProperties } from "@/composables/modules/property/fetchProperties";
  import { useFetchAgents } from '@/composables/modules/agents/fetch'
  const {
  loadingProperties,
  propertiesList
} = useGetProperties();
  const { agentsList, loading } = useFetchAgents()
  
  const emit = defineEmits<{
  (e: 'close'): void
  (e: 'applyFilters', filters: any): void
}>();

const closeModal = () => {
  emit('close');
}

const fromDate = ref<string>('');
const toDate = ref<string>('');
const propertyName = ref<string>('');
const agentId = ref<string>('');
const propertyId = ref<string>('');

const resetFilters = () => {
  fromDate.value = '';
  toDate.value = '';
  propertyName.value = '';
  agentId.value = '';
  selectedStatusText.value = 'All Properties'
  applyFilters();
}


const propertyStatusList = ref([
  {
    label: 'All Properties',
    code: 'all'
  },
  {
    label: 'Published',
    code: 'published'
  },
  {
    label: 'Draft',
    code: 'draft'
  },
  {
    label: 'Deactivated',
    code: 'hidden'
  }
])

// Reactive variable to store the selected agent
const selectedAgent = ref(null);

const handlePropertySelect = (property: any) => {
      // console.log('Selected Property:', property)
      propertyName.value = property.name
      propertyId.value = property.id
    }

    // Handles agent selection
const handleAgentSelect = (agent: any) => {
  console.log("Selected Agent:", agent);
  selectedAgent.value = agent;
  agentId.value = agent.id
};

const applyFilters = () => {
  // Emit the filters to the parent component
  emit('applyFilters', {
    fromDate: fromDate.value,
    toDate: toDate.value,
    searchQuery: propertyName.value,
    propertyId: propertyId.value,
    agentId: agentId.value,
    status: selectedStatusText.value || null
    // status: selectedStatusText.value === 'Published' ? true : selectedStatusText.value === 'Draft' ? false : null
  });
  closeModal();
}

const selectedUser = ref({});
const selectedProperty = ref({})
const selectedPropertyName = ref('')
const selectedUserText = ref('');
const selectedStatusText = ref('');
const showDropdown = ref(false)
const showStatusDropdown = ref(false)
const showPropertyDropdown = ref(false)
function toggleDropdown() {
    showDropdown.value = !showDropdown.value;
}

function togglePropertyDropdown() {
    showPropertyDropdown.value = !showPropertyDropdown.value;
}

function toggleStatusDropdown() {
    showStatusDropdown.value = !showStatusDropdown.value;
}



function selectUser(user: any) {
  agentId.value = user.id
  selectedUser.value = user
  selectedUserText.value = `${user.firstName} ${user.lastName}`;
  showDropdown.value = false;
}

function selectProperty(property: any) {
  selectedProperty.value = property
  selectedPropertyName.value = property.name
  showPropertyDropdown.value = false;
}

function selectStatus(item: any) {
  selectedStatusText.value = item.label;
  showStatusDropdown.value = false;
}

const propertyDropdownRef = ref<HTMLElement | null>(null);
  const agentDropdownRef = ref<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
    const propertyDropdown = propertyDropdownRef.value;
    if (propertyDropdown && !propertyDropdown.contains(event.target as Node)) {
        showDropdown.value = false;
    }

    const agentDropdown = agentDropdownRef.value;
    if (agentDropdown && !agentDropdown.contains(event.target as Node)) {
        showDropdown.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
  </script>

<style scoped>
.custom-scrollbar {
    scrollbar-width: thin; 
    scrollbar-color: #cccccc #f1f1f1; 
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px; 
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background-color: #cccccc;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #cccccc; 
    border-radius: 4px; 
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: #cccccc; 
  }
</style>
  