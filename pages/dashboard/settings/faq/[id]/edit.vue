<template>
    <LayoutWithoutSidebar>
      <div class="flex flex-col min-h-screen">
        <div class="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div class="flex items-center space-x-2">
            <button @click="router.back()" class="p-2">
              <svg width="100" height="44" viewBox="0 0 100 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_11633_65137)">
                  <rect width="100" height="44" rx="8" fill="#F9FAFB" />
                  <path d="M28.5 17C28.5 17 23.5 20.6824 23.5 22C23.5 23.3177 28.5 27 28.5 27" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M48.3463 17.504C49.2143 17.504 49.9423 17.588 50.5303 17.756C51.1183 17.9147 51.5569 18.176 51.8463 18.54C52.1449 18.904 52.2943 19.394 52.2943 20.01C52.2943 20.3927 52.2289 20.738 52.0983 21.046C51.9676 21.354 51.7763 21.606 51.5243 21.802C51.2816 21.998 50.9783 22.1287 50.6143 22.194V22.264C50.9876 22.3293 51.3189 22.4507 51.6083 22.628C51.9069 22.796 52.1403 23.0433 52.3083 23.37C52.4856 23.6873 52.5743 24.1073 52.5743 24.63C52.5743 25.2367 52.4296 25.7547 52.1403 26.184C51.8509 26.6133 51.4356 26.94 50.8943 27.164C50.3623 27.388 49.7276 27.5 48.9903 27.5H45.3363V17.504H48.3463ZM48.5843 21.578C49.2936 21.578 49.7789 21.466 50.0403 21.242C50.3109 21.018 50.4463 20.6867 50.4463 20.248C50.4463 19.8 50.2876 19.478 49.9703 19.282C49.6529 19.086 49.1443 18.988 48.4443 18.988H47.1283V21.578H48.5843ZM47.1283 23.02V26.002H48.7523C49.4803 26.002 49.9843 25.862 50.2643 25.582C50.5536 25.302 50.6983 24.9287 50.6983 24.462C50.6983 24.1633 50.6376 23.9067 50.5163 23.692C50.3949 23.4773 50.1849 23.314 49.8863 23.202C49.5876 23.0807 49.1816 23.02 48.6683 23.02H47.1283ZM57.2091 19.772C58.1891 19.772 58.9311 19.9867 59.4351 20.416C59.9485 20.836 60.2051 21.4987 60.2051 22.404V27.5H58.9591L58.6091 26.45H58.5531C58.3385 26.7207 58.1145 26.9493 57.8811 27.136C57.6571 27.3133 57.3958 27.4393 57.0971 27.514C56.8078 27.598 56.4531 27.64 56.0331 27.64C55.5851 27.64 55.1791 27.556 54.8151 27.388C54.4605 27.22 54.1805 26.9633 53.9751 26.618C53.7698 26.2633 53.6671 25.82 53.6671 25.288C53.6671 24.504 53.9518 23.916 54.5211 23.524C55.0998 23.1227 55.9725 22.9033 57.1391 22.866L58.4551 22.824V22.446C58.4551 21.9607 58.3385 21.6153 58.1051 21.41C57.8718 21.2047 57.5451 21.102 57.1251 21.102C56.7425 21.102 56.3738 21.158 56.0191 21.27C55.6645 21.382 55.3191 21.5127 54.9831 21.662L54.4231 20.43C54.7965 20.234 55.2211 20.0753 55.6971 19.954C56.1825 19.8327 56.6865 19.772 57.2091 19.772ZM57.5311 23.944C56.7565 23.972 56.2198 24.1073 55.9211 24.35C55.6225 24.5833 55.4731 24.9007 55.4731 25.302C55.4731 25.6567 55.5805 25.9133 55.7951 26.072C56.0098 26.2307 56.2851 26.31 56.6211 26.31C57.1345 26.31 57.5685 26.1653 57.9231 25.876C58.2778 25.5773 58.4551 25.1387 58.4551 24.56V23.916L57.5311 23.944ZM65.2016 27.64C64.4829 27.64 63.8576 27.5047 63.3256 27.234C62.8029 26.954 62.3969 26.5293 62.1076 25.96C61.8276 25.3813 61.6876 24.644 61.6876 23.748C61.6876 22.8147 61.8416 22.0587 62.1496 21.48C62.4669 20.892 62.9009 20.4627 63.4516 20.192C64.0023 19.912 64.6323 19.772 65.3416 19.772C65.8176 19.772 66.2423 19.8187 66.6156 19.912C66.9889 20.0053 67.3063 20.1173 67.5676 20.248L67.0496 21.634C66.7603 21.522 66.4709 21.4287 66.1816 21.354C65.8923 21.27 65.6123 21.228 65.3416 21.228C64.9216 21.228 64.5716 21.3213 64.2916 21.508C64.0209 21.6947 63.8203 21.9747 63.6896 22.348C63.5589 22.712 63.4936 23.174 63.4936 23.734C63.4936 24.2753 63.5589 24.728 63.6896 25.092C63.8296 25.456 64.0349 25.7313 64.3056 25.918C64.5763 26.0953 64.9123 26.184 65.3136 26.184C65.7429 26.184 66.1209 26.1327 66.4476 26.03C66.7743 25.9273 67.0823 25.7873 67.3716 25.61V27.136C67.0823 27.3133 66.7696 27.4393 66.4336 27.514C66.1069 27.598 65.6963 27.64 65.2016 27.64ZM70.6193 21.914C70.6193 22.1567 70.6099 22.4133 70.5913 22.684C70.5726 22.9453 70.5539 23.202 70.5353 23.454H70.5773C70.6519 23.342 70.7406 23.2207 70.8433 23.09C70.9459 22.95 71.0486 22.8147 71.1513 22.684C71.2633 22.544 71.3706 22.418 71.4733 22.306L73.7133 19.912H75.7153L72.6773 23.188L75.9113 27.5H73.8533L71.5013 24.252L70.6193 24.98V27.5H68.8693V16.86H70.6193V21.914Z" fill="#292929" />
                </g>
                <defs>
                  <clipPath id="clip0_11633_65137">
                    <rect width="100" height="44" rx="8" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
            <h2 class="text-lg font-medium text-[#1D2739]">New FAQ</h2>
          </div>
          <button class="text-gray-600 bg-[#F9FAFB]">Save & exit</button>
        </div>
  
        <div class="p-6 space-y-6 w-full max-w-xl mx-auto flex-1">
          <h3 class="text-lg font-medium mb-6">Compose the message</h3>
  
          <div class="space-y-4">
            <div>
              <label class="block text-sm mb-2">FAQ Audience</label>
              <select
                disabled
                v-model="form.audience"
                class="w-full disabled:cursor-not-allowed p-4 bg-[#F0F2F5] border-[0.5px] outline-none border-gray-100 text-sm rounded-lg"
              >
                <option value="tenant-app">Tenants</option>
                <option value="agent-app">Agents</option>
                <option value="admin-app">Admin</option>
                <option value="property-manager-app">Property Manager</option>
                <option value="service-provider-app">Service Provider</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm mb-2">Enter FAQ question</label>
              <input
                v-model="form.question"
                type="text"
                placeholder="Enter your question e.g How old are you?"
                class="w-full p-4 bg-[#F0F2F5] border-[0.5px] outline-none border-gray-100 text-sm rounded-lg"
              />
            </div>
  
            <div>
              <label class="block text-sm mb-2">Enter response</label>
              <textarea
                v-model="form.answer"
                rows="6"
                class="w-full p-4 bg-[#F0F2F5] border-[0.5px] outline-none border-gray-100 text-sm rounded-lg"
              ></textarea>
            </div>
          </div>
        </div>
  
        <div class="sticky bottom-0 flex justify-between items-center space-x-4 p-4 border-t bg-white">
          <button
            @click="$emit('close')"
            class="px-6 py-3 bg-[#EBE5E0] text-gray-800 text-sm rounded-lg"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            :disabled="!isFormValid || loading"
            class="px-6 py-3 bg-[#292929] text-sm text-white rounded-lg disabled:opacity-50"
          >
            {{ loading ? 'processing..' : 'Publish'}}
          </button>
        </div>
      </div>
    </LayoutWithoutSidebar>
  </template>
  
  <!-- <script setup lang="ts">
  import { useCreateFAQ } from '@/composables/modules/settings/useCreateFaq'
  import LayoutWithoutSidebar from "@/layouts/dashboardWithoutSidebar.vue";
  import { ref, computed } from "vue";
  
  const emit = defineEmits(["close", "submit"]);
  const { createFaq, setPayload, loading, payload } = useCreateFAQ()
  const router = useRouter()
  
  const form = ref({
    audience: "",
    question: "",
    answer: "",
  });
  
  const isFormValid = computed(
    () =>
      form.value.audience &&
      form.value.question.trim() &&
      form.value.answer.trim()
  );
  
  const handleSubmit = () => {
    if (isFormValid.value) {
        const payload = {
            question: form.value.question,
            answer: form.value.answer,
            app: form.value.audience
        }
        setPayload(payload)
        createFaq()
    }
  };
  </script>
   -->

   <script setup lang="ts">
import { useCreateFAQ } from '@/composables/modules/settings/useCreateFaq';
import LayoutWithoutSidebar from "@/layouts/dashboardWithoutSidebar.vue";
import { ref, computed, onMounted } from "vue";

const emit = defineEmits(["close", "submit"]);
const { createFaq, setPayload, loading, payload } = useCreateFAQ();
const router = useRouter();

const form = ref({
  audience: "",
  question: "",
  answer: "",
});

const isFormValid = computed(
  () =>
    form.value.audience &&
    form.value.question.trim() &&
    form.value.answer.trim()
);

const handleSubmit = () => {
  if (isFormValid.value) {
    const payload = {
      question: form.value.question,
      answer: form.value.answer,
      app: form.value.audience,
    };
    setPayload(payload);
    createFaq();
  }
};

onMounted(() => {
  const savedFaq = localStorage.getItem("selected-faq");
  if (savedFaq) {
    try {
      const faqData = JSON.parse(savedFaq);
      form.value.audience = faqData.app || "";
      form.value.question = faqData.question || "";
      form.value.answer = faqData.answer || "";
    } catch (error) {
      console.error("Error parsing saved FAQ data:", error);
    }
  }
});
</script>
