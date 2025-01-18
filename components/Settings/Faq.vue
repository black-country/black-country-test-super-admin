<!-- <template>
    <div class="w-full max-w-7xl mx-auto">
      <div class="lg:flex items-center justify-between mb-6">
        <div class="flex border-gray-200 text-sm w-full">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="setActiveTab(tab.key)"
            class="py-2 px-2 -mb-px"
            :class="[
              activeTab === tab.key
                ? 'border-b-4 text-sm border-[#326543] text-[#326543] font-medium'
                : 'text-[#475367]'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="flex items-center space-x-4 mt-6 lg:mt-0 w-full">
          <div class="relative flex-1 w-full">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search"
              class="w-full pl-10 outline-none text-sm bg-[#EAEAEA] pr-4 py-3.5 w-full bg-gray-100 rounded-lg"
            />
            <svg
              class="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.668 12.168L14.668 15.168"
                stroke="#667185"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.332 7.83203C13.332 4.51832 10.6458 1.83203 7.33203 1.83203C4.01832 1.83203 1.33203 4.51832 1.33203 7.83203C1.33203 11.1458 4.01832 13.832 7.33203 13.832C10.6458 13.832 13.332 11.1458 13.332 7.83203Z"
                stroke="#667185"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <button  v-if="isChecked " @click="handleEditFaq" class="text-[#292929] flex items-center gap-x-2 border border-gray-200 bg-[#F9FAFB] py-3 rounded-lg px-6">
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.5131 4.65199L14.6811 3.48386C15.3263 2.83871 16.3723 2.83871 17.0175 3.48386C17.6626 4.129 17.6626 5.17498 17.0175 5.82012L15.8493 6.98826M13.5131 4.65199L9.15147 9.01358C8.28041 9.88467 7.84485 10.3202 7.54828 10.8509C7.25169 11.3817 6.9533 12.6349 6.66797 13.8333C7.86638 13.548 9.11964 13.2496 9.65039 12.953C10.1811 12.6564 10.6166 12.2209 11.4877 11.3498L15.8493 6.98826M13.5131 4.65199L15.8493 6.98826" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.5 10.5C17.5 14.0355 17.5 15.8033 16.4017 16.9017C15.3033 18 13.5355 18 10 18C6.46447 18 4.6967 18 3.59835 16.9017C2.5 15.8033 2.5 14.0355 2.5 10.5C2.5 6.96447 2.5 5.1967 3.59835 4.09835C4.6967 3 6.46447 3 10 3" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"/>
</svg>

            Edit
          </button>
          <NuxtLink
            to="/dashboard/settings/faq/create-faq"
            class="px-4 py-3.5 bg-[#292929] text-sm text-white rounded-lg"
          >
            New FAQ
          </NuxtLink>
        </div>
      </div>
      <div v-if="faqList?.length && !loading" class="space-y-4">
        <div v-for="faq in filteredFaqs" :key="faq.id" class="border-gray-100">
          <button
            @click="toggleFaq(faq.id)"
            class="w-full flex justify-between border-[0.5px] border-gray-50 rounded-lg bg-white px-4 items-center py-3.5 text-left"
          >
            <div class="space-x-2">
              <input v-model="isChecked" @change="handleSelected('example')" type="checkbox" />
              <span class="text- text-[#1D2739]">{{ faq.question }}</span>
            </div>
            <svg
              :class="{ 'rotate-180': openFaqId === faq.id }"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6.00003C12 6.00003 9.05407 10 8 10C6.94587 10 4 6 4 6"
                stroke="#667185"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div
            v-show="openFaqId === faq.id"
            class="pb-4 text-[#1D2739] text-sm border-[0.5px] mt-2 border-gray-50 rounded-lg bg-white py-6 p-3"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
      <section v-else-if="loading && !faqList?.length">
        <div class="animate-pulse h-32 w-full bg-white rounded flex space-x-4"></div>
      </section>
      <div
        v-else
        class="bg-white px-4 py-5 sm:p-6 h-80 rounded-lg flex flex-col gap-y-4 justify-center border items-center border-gray-50"
      >
        <p class="text-[#1D2739]">No FAQ available</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  import { useFetchFaq } from "@/composables/modules/settings/useFetchFaq";
  
  const { loading, faqList, appType } = useFetchFaq();
  
  const tabs = ref([
    {
      key: "tenant-app",
      label: "Tenant",
    },
    {
      key: "admin-app",
      label: "Admin",
    },
    {
      key: "agent-app",
      label: "Agent",
    },
    {
      key: "service-provider-app",
      label: "Service Provider",
    },
    {
      key: "property-manager-app",
      label: "Property Manager",
    },
  ]);
  
  const activeTab = ref("tenant-app");
  const searchQuery = ref("");
  const openFaqId = ref<string | null>(null);
    const isSelectedItemNotEmpty = computed(() => Object.keys(selectedItem.value).length > 0);
  
  const setActiveTab = (tab: string) => {
    activeTab.value = tab;
    appType.value = tab
  };
  
  const filteredFaqs = computed(() => {
    return faqList.value
      .filter((faq) => faq.app === activeTab.value)
      .filter(
        (faq) =>
          searchQuery.value === "" ||
          faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
  });
  
  const toggleFaq = (id: string) => {
    openFaqId.value = openFaqId.value === id ? null : id;
  };

  const selectedItem = ref({}) as any


  // const handleSelected = (item: any) => {
  //   selectedItem.value = item
  //   localStorage.setItem('selected-faq', JSON.stringify(selectedItem.value))
  // }

  // watch(selectedItem, (val) => {
  //    console.log(val, 'updated')
  // })

  const isChecked = ref(false);

// Watch for changes in the checkbox state
watch(isChecked, (newValue, oldValue) => {
  console.log(`Checkbox changed from ${oldValue} to ${newValue}`);
  // Perform actions based on the change
  if (newValue) {
    console.log('Checkbox is checked');
  } else {
    console.log('Checkbox is unchecked');
  }
});

// Function to handle additional actions
const handleSelected = (faq) => {
  selectedItem.value = faq
  localStorage.setItem('selected-faq', JSON.stringify(selectedItem.value))
  console.log('Handling selected for:', faq);
};


  const router = useRouter()

  const handleEditFaq = () => {
    router.push(`/dashboard/settings/faq/${selectedItem.value.id}/edit`)
  }
  </script>
   -->

   <!-- <script setup lang="ts">
   import { ref, computed, watch } from "vue";
   import { useFetchFaq } from "@/composables/modules/settings/useFetchFaq";
   
   const { loading, faqList, appType } = useFetchFaq();
   
   const tabs = ref([
     {
       key: "tenant-app",
       label: "Tenant",
     },
     {
       key: "admin-app",
       label: "Admin",
     },
     {
       key: "agent-app",
       label: "Agent",
     },
     {
       key: "service-provider-app",
       label: "Service Provider",
     },
     {
       key: "property-manager-app",
       label: "Property Manager",
     },
   ]);
   
   const activeTab = ref("tenant-app");
   const searchQuery = ref("");
   const openFaqId = ref<string | null>(null);
   const selectedFaqId = ref<string | null>(null); // Track selected FAQ ID
   
   const setActiveTab = (tab: string) => {
     activeTab.value = tab;
     appType.value = tab;
   };
   
   const filteredFaqs = computed(() => {
     return faqList.value
       .filter((faq) => faq.app === activeTab.value)
       .filter(
         (faq) =>
           searchQuery.value === "" ||
           faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
           faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
       );
   });
   
   const toggleFaq = (id: string) => {
     openFaqId.value = openFaqId.value === id ? null : id;
   };
   
   const handleSelected = (faqObj: string) => {
     selectedFaqId.value = faqObj;
     localStorage.setItem("selected-faq", JSON.stringify(faqObj));
    //  console.log("Selected FAQ ID:", faqObj);
   };
   
   const router = useRouter();
   
   const handleEditFaq = () => {
     if (selectedFaqId.value) {
       router.push(`/dashboard/settings/faq/${selectedFaqId.value}/edit`);
     }
   };
   </script>

<template>
  <div class="w-full max-w-7xl mx-auto">
    <div class="lg:flex items-center justify-between mb-6">
      <div class="flex border-gray-200 text-sm w-full">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="setActiveTab(tab.key)"
          class="py-2 px-2 -mb-px"
          :class="[
            activeTab === tab.key
              ? 'border-b-4 text-sm border-[#326543] text-[#326543] font-medium'
              : 'text-[#475367]'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="flex items-center space-x-4 mt-6 lg:mt-0 w-full">
        <div class="relative flex-1 w-full">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search"
            class="w-full pl-10 outline-none text-sm bg-[#EAEAEA] pr-4 py-3.5 w-full bg-gray-100 rounded-lg"
          />
        </div>
        <button
          v-if="selectedFaqId"
          @click="handleEditFaq"
          class="text-[#292929] flex items-center gap-x-2 border border-gray-200 bg-[#F9FAFB] py-3 rounded-lg px-6"
        >
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.5131 4.65199L14.6811 3.48386C15.3263 2.83871 16.3723 2.83871 17.0175 3.48386C17.6626 4.129 17.6626 5.17498 17.0175 5.82012L15.8493 6.98826M13.5131 4.65199L9.15147 9.01358C8.28041 9.88467 7.84485 10.3202 7.54828 10.8509C7.25169 11.3817 6.9533 12.6349 6.66797 13.8333C7.86638 13.548 9.11964 13.2496 9.65039 12.953C10.1811 12.6564 10.6166 12.2209 11.4877 11.3498L15.8493 6.98826M13.5131 4.65199L15.8493 6.98826" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.5 10.5C17.5 14.0355 17.5 15.8033 16.4017 16.9017C15.3033 18 13.5355 18 10 18C6.46447 18 4.6967 18 3.59835 16.9017C2.5 15.8033 2.5 14.0355 2.5 10.5C2.5 6.96447 2.5 5.1967 3.59835 4.09835C4.6967 3 6.46447 3 10 3" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"/>
</svg>
          Edit
        </button>
        <NuxtLink
          to="/dashboard/settings/faq/create-faq"
          class="px-4 py-3.5 bg-[#292929] text-sm text-white rounded-lg"
        >
          New FAQ
        </NuxtLink>
      </div>
    </div>
    <div v-if="faqList?.length && !loading" class="space-y-4">
      <div v-for="faq in filteredFaqs" :key="faq.id" class="border-gray-100">
        <button
          @click="toggleFaq(faq.id)"
          class="w-full flex justify-between border-[0.5px] border-gray-50 rounded-lg bg-white px-4 items-center py-3.5 text-left"
        >
          <div class="space-x-2">
            <input
              type="radio"
              :value="faq.id"
              v-model="selectedFaqId"
              @change="handleSelected(faq)"
              class="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="text- text-[#1D2739]">{{ faq.question }}</span>
          </div>
        </button>
        <div
          v-show="openFaqId === faq.id"
          class="pb-4 text-[#1D2739] text-sm border-[0.5px] mt-2 border-gray-50 rounded-lg bg-white py-6 p-3"
        >
          {{ faq.answer }}
        </div>
      </div>
    </div>
    <section v-else-if="loading && !faqList?.length">
      <div class="animate-pulse h-32 w-full bg-white rounded flex space-x-4"></div>
    </section>
    <div
      v-else
      class="bg-white px-4 py-5 sm:p-6 h-80 rounded-lg flex flex-col gap-y-4 justify-center border items-center border-gray-50"
    >
      <p class="text-[#1D2739]">No FAQ available</p>
    </div>
  </div>
</template> -->

<script setup lang="ts">
import { ref, computed } from "vue";
import { useFetchFaq } from "@/composables/modules/settings/useFetchFaq";

const { loading, faqList, appType } = useFetchFaq();

const tabs = ref([
  { key: "tenant-app", label: "Tenant" },
  { key: "admin-app", label: "Admin" },
  { key: "agent-app", label: "Agent" },
  { key: "service-provider-app", label: "Service Provider" },
  { key: "property-manager-app", label: "Property Manager" },
]);

const activeTab = ref("tenant-app");
const searchQuery = ref("");
const openFaqId = ref<string | null>(null);
const selectedFaqId = ref<string | null>(null); // Store the selected FAQ ID
const selectedFaq = ref<object | null>(null); // Store the selected FAQ object

const setActiveTab = (tab: string) => {
  activeTab.value = tab;
  appType.value = tab;
};

const filteredFaqs = computed(() => {
  return faqList.value
    .filter((faq) => faq.app === activeTab.value)
    .filter(
      (faq) =>
        searchQuery.value === "" ||
        faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const toggleFaq = (id: string) => {
  openFaqId.value = openFaqId.value === id ? null : id;
};

const handleSelected = (faqId: string) => {
  selectedFaqId.value = faqId; // Set the selected FAQ ID
  const faq = faqList.value.find((item) => item.id === faqId); // Find the FAQ object
  if (faq) {
    selectedFaq.value = faq; // Store the selected FAQ object
    localStorage.setItem("selected-faq", JSON.stringify(faq)); // Save to local storage
    console.log("Selected FAQ:", faq);
  }
};

const router = useRouter();

const handleEditFaq = () => {
  if (selectedFaq.value) {
    router.push(`/dashboard/settings/faq/${selectedFaq.value.id}/edit`);
  }
};
</script>

<template>
  <div class="w-full max-w-7xl mx-auto">
    <div class="lg:flex items-center justify-between mb-6">
      <div class="flex border-gray-200 text-sm w-full">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="setActiveTab(tab.key)"
          class="py-2 px-2 -mb-px"
          :class="[
            activeTab === tab.key
              ? 'border-b-4 text-sm border-[#326543] text-[#326543] font-medium'
              : 'text-[#475367]'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="flex items-center space-x-4 mt-6 lg:mt-0 w-full">
        <div class="relative flex-1 w-full">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search"
            class="w-full pl-10 outline-none text-sm bg-[#EAEAEA] pr-4 py-3.5 w-full bg-gray-100 rounded-lg"
          />
        </div>
        <button
          v-if="selectedFaq"
          @click="handleEditFaq"
          class="text-[#292929] flex items-center gap-x-2 border border-gray-200 bg-[#F9FAFB] py-3 rounded-lg px-6"
        >
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.5131 4.65199L14.6811 3.48386C15.3263 2.83871 16.3723 2.83871 17.0175 3.48386C17.6626 4.129 17.6626 5.17498 17.0175 5.82012L15.8493 6.98826M13.5131 4.65199L9.15147 9.01358C8.28041 9.88467 7.84485 10.3202 7.54828 10.8509C7.25169 11.3817 6.9533 12.6349 6.66797 13.8333C7.86638 13.548 9.11964 13.2496 9.65039 12.953C10.1811 12.6564 10.6166 12.2209 11.4877 11.3498L15.8493 6.98826M13.5131 4.65199L15.8493 6.98826" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.5 10.5C17.5 14.0355 17.5 15.8033 16.4017 16.9017C15.3033 18 13.5355 18 10 18C6.46447 18 4.6967 18 3.59835 16.9017C2.5 15.8033 2.5 14.0355 2.5 10.5C2.5 6.96447 2.5 5.1967 3.59835 4.09835C4.6967 3 6.46447 3 10 3" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"/>
</svg>
          Edit
        </button>
        <NuxtLink
          to="/dashboard/settings/faq/create-faq"
          class="px-4 py-3.5 bg-[#292929] text-sm text-white rounded-lg"
        >
          New FAQ
        </NuxtLink>
      </div>
    </div>
    <div v-if="faqList?.length && !loading" class="space-y-4">
      <div v-for="faq in filteredFaqs" :key="faq.id" class="border-gray-100">
        <button
          @click="toggleFaq(faq.id)"
          class="w-full flex justify-between border-[0.5px] border-gray-50 rounded-lg bg-white px-4 items-center py-3.5 text-left"
        >
          <div class="space-x-2 flex items-center">
            <input
              type="radio"
              :value="faq.id"
              v-model="selectedFaqId"
              @change="handleSelected(faq.id)"
              class="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="text-[#1D2739]">{{ faq.question }}</span>
          </div>
        </button>
        <div
          v-show="openFaqId === faq.id"
          class="pb-4 text-[#1D2739] text-sm border-[0.5px] mt-2 border-gray-50 rounded-lg bg-white py-6 p-3"
        >
          {{ faq.answer }}
        </div>
      </div>
    </div>
    <section v-else-if="loading && !faqList?.length">
      <div class="animate-pulse h-32 w-full bg-white rounded flex space-x-4"></div>
    </section>
    <div
      v-else
      class="bg-white px-4 py-5 sm:p-6 h-80 rounded-lg flex flex-col gap-y-4 justify-center border items-center border-gray-50"
    >
      <p class="text-[#1D2739]">No FAQ available</p>
    </div>
  </div>
</template>
