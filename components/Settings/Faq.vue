<template>
    <div class="w-full max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
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
        <div class="flex items-center space-x-4 w-full">
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
          <NuxtLink
            to="/dashboard/settings/new-faq"
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
            <span class="text- text-[#1D2739]">{{ faq.question }}</span>
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
  </script>
  