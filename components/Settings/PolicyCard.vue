<template>
  <div class="relative rounded-lg border-[0.5px] border-gray-50">
    <div class="block bg-yellow-200 rounded-t-lg">
      <div>
        <img v-if="type === 'privacy_policy'" src="@/assets/img/privacy-policy.png" alt="Privacy Policy" />
        <img v-if="type === 'terms_of_use'" src="@/assets/img/terms-condition.png" alt="Terms of Use" />
      </div>
      <div class="text-sm text-gray-600 space-y-1 p-4 bg-white relative">
        <div class="flex justify-between items-center">
          <p class="text-lg text-gray-800">{{ name || "Nil" }}</p>
          <button @click.stop="toggleDropdown(id)" class="focus:outline-none relative" :id="'drop-options-' + id"
            ref="dropdownTrigger">
            <span class="sr-only">More options</span>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>

            <div v-if="openDropdown === id" class="absolute -left-32 z-10 mt-2 w-60 bg-gray-25 shadow-lg rounded-md">
      <div
        class="fixed w-40 bg-white border-[0.5px] divide-y divide-gray-100 border-gray-100 shadow-lg rounded-lg z-50">
        <button
          class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
          @click="viewPolicy">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.9527 9.20547C18.206 9.56072 18.3327 9.73839 18.3327 10.0013C18.3327 10.2642 18.206 10.4419 17.9527 10.7971C16.8143 12.3935 13.907 15.8346 9.99935 15.8346C6.09167 15.8346 3.18443 12.3935 2.04605 10.7971C1.79269 10.4419 1.66602 10.2642 1.66602 10.0013C1.66602 9.73839 1.79269 9.56072 2.04605 9.20547C3.18443 7.60917 6.09167 4.16797 9.99935 4.16797C13.907 4.16797 16.8143 7.60917 17.9527 9.20547Z"
              stroke="#326543" stroke-width="1.5" />
            <path
              d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z"
              stroke="#326543" stroke-width="1.5" />
          </svg>

          View
        </button>
        <button
          class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
          @click="editPolicy">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.5111 4.15199L14.6792 2.98386C15.3244 2.33871 16.3703 2.33871 17.0155 2.98386C17.6606 3.629 17.6606 4.67498 17.0155 5.32012L15.8473 6.48826M13.5111 4.15199L9.14952 8.51358C8.27846 9.38467 7.8429 9.82016 7.54632 10.3509C7.24974 10.8817 6.95135 12.1349 6.66602 13.3333C7.86442 13.048 9.11768 12.7496 9.64843 12.453C10.1792 12.1564 10.6147 11.7209 11.4858 10.8498L15.8473 6.48826M13.5111 4.15199L15.8473 6.48826"
              stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M17.5 10C17.5 13.5355 17.5 15.3033 16.4017 16.4017C15.3033 17.5 13.5355 17.5 10 17.5C6.46447 17.5 4.6967 17.5 3.59835 16.4017C2.5 15.3033 2.5 13.5355 2.5 10C2.5 6.46447 2.5 4.6967 3.59835 3.59835C4.6967 2.5 6.46447 2.5 10 2.5"
              stroke="#326543" stroke-width="1.5" stroke-linecap="round" />
          </svg>

          Edit
        </button>
        <button 
          :disabled="isDownloading"
          class="flex items-center disabled:cursor-not-allowed disabled:opacity-25 gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
          @click="downloadPolicy">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.99935 12.0833V3.75M9.99935 12.0833C9.41585 12.0833 8.32562 10.4214 7.91602 10M9.99935 12.0833C10.5828 12.0833 11.6731 10.4214 12.0827 10"
              stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M16.6673 13.75C16.6673 15.8183 16.2357 16.25 14.1673 16.25H5.83398C3.76565 16.25 3.33398 15.8183 3.33398 13.75"
              stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          {{ isDownloading ? 'downloading' : 'Download'}}
        </button>
      </div>
             </div>
          </button>
        </div>
        <div>
          Policy Audience:
          <span class="font-medium text-gray-900">{{ app || "Nil" }}</span>
        </div>
        <div>
          Last updated:
          <span class="font-medium text-gray-900">{{ createdAt || "Nil" }}</span>
        </div>
      </div>
    </div>

    <!-- <div v-if="openDropdown === id" class="absolute right-0 z-10 mt-2 w-60 bg-gray-25 shadow-lg rounded-md">
      <div
        class="fixed w-40 bg-white border-[0.5px] divide-y divide-gray-100 border-gray-100 shadow-lg rounded-lg z-50">
        <button
          class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
          @click="viewPolicy">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.9527 9.20547C18.206 9.56072 18.3327 9.73839 18.3327 10.0013C18.3327 10.2642 18.206 10.4419 17.9527 10.7971C16.8143 12.3935 13.907 15.8346 9.99935 15.8346C6.09167 15.8346 3.18443 12.3935 2.04605 10.7971C1.79269 10.4419 1.66602 10.2642 1.66602 10.0013C1.66602 9.73839 1.79269 9.56072 2.04605 9.20547C3.18443 7.60917 6.09167 4.16797 9.99935 4.16797C13.907 4.16797 16.8143 7.60917 17.9527 9.20547Z"
              stroke="#326543" stroke-width="1.5" />
            <path
              d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z"
              stroke="#326543" stroke-width="1.5" />
          </svg>

          View
        </button>
        <button
          class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
          @click="editPolicy">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.5111 4.15199L14.6792 2.98386C15.3244 2.33871 16.3703 2.33871 17.0155 2.98386C17.6606 3.629 17.6606 4.67498 17.0155 5.32012L15.8473 6.48826M13.5111 4.15199L9.14952 8.51358C8.27846 9.38467 7.8429 9.82016 7.54632 10.3509C7.24974 10.8817 6.95135 12.1349 6.66602 13.3333C7.86442 13.048 9.11768 12.7496 9.64843 12.453C10.1792 12.1564 10.6147 11.7209 11.4858 10.8498L15.8473 6.48826M13.5111 4.15199L15.8473 6.48826"
              stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M17.5 10C17.5 13.5355 17.5 15.3033 16.4017 16.4017C15.3033 17.5 13.5355 17.5 10 17.5C6.46447 17.5 4.6967 17.5 3.59835 16.4017C2.5 15.3033 2.5 13.5355 2.5 10C2.5 6.46447 2.5 4.6967 3.59835 3.59835C4.6967 2.5 6.46447 2.5 10 2.5"
              stroke="#326543" stroke-width="1.5" stroke-linecap="round" />
          </svg>

          Edit
        </button>
        <button
          class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
          @click="downloadPolicy">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.99935 12.0833V3.75M9.99935 12.0833C9.41585 12.0833 8.32562 10.4214 7.91602 10M9.99935 12.0833C10.5828 12.0833 11.6731 10.4214 12.0827 10"
              stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M16.6673 13.75C16.6673 15.8183 16.2357 16.25 14.1673 16.25H5.83398C3.76565 16.25 3.33398 15.8183 3.33398 13.75"
              stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          Download
        </button>
      </div>
    </div> -->
    <!-- More Options Dropdown -->
    <!-- <Teleport to="body">
      <div
        v-if="showDropdown"
        :style="dropdownStyle"
        class="fixed w-40 bg-white border-[0.5px] divide-y divide-gray-100 border-gray-100 shadow-lg rounded-lg z-50"
      >
        <button
          class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
          @click="viewPolicy"
        >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.9527 9.20547C18.206 9.56072 18.3327 9.73839 18.3327 10.0013C18.3327 10.2642 18.206 10.4419 17.9527 10.7971C16.8143 12.3935 13.907 15.8346 9.99935 15.8346C6.09167 15.8346 3.18443 12.3935 2.04605 10.7971C1.79269 10.4419 1.66602 10.2642 1.66602 10.0013C1.66602 9.73839 1.79269 9.56072 2.04605 9.20547C3.18443 7.60917 6.09167 4.16797 9.99935 4.16797C13.907 4.16797 16.8143 7.60917 17.9527 9.20547Z" stroke="#326543" stroke-width="1.5"/>
<path d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z" stroke="#326543" stroke-width="1.5"/>
</svg>

          View
        </button>
        <button
          class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
          @click="editPolicy"
        >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.5111 4.15199L14.6792 2.98386C15.3244 2.33871 16.3703 2.33871 17.0155 2.98386C17.6606 3.629 17.6606 4.67498 17.0155 5.32012L15.8473 6.48826M13.5111 4.15199L9.14952 8.51358C8.27846 9.38467 7.8429 9.82016 7.54632 10.3509C7.24974 10.8817 6.95135 12.1349 6.66602 13.3333C7.86442 13.048 9.11768 12.7496 9.64843 12.453C10.1792 12.1564 10.6147 11.7209 11.4858 10.8498L15.8473 6.48826M13.5111 4.15199L15.8473 6.48826" stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M17.5 10C17.5 13.5355 17.5 15.3033 16.4017 16.4017C15.3033 17.5 13.5355 17.5 10 17.5C6.46447 17.5 4.6967 17.5 3.59835 16.4017C2.5 15.3033 2.5 13.5355 2.5 10C2.5 6.46447 2.5 4.6967 3.59835 3.59835C4.6967 2.5 6.46447 2.5 10 2.5" stroke="#326543" stroke-width="1.5" stroke-linecap="round"/>
</svg>

          Edit
        </button>
        <button
          class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
          @click="downloadPolicy"
        >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.99935 12.0833V3.75M9.99935 12.0833C9.41585 12.0833 8.32562 10.4214 7.91602 10M9.99935 12.0833C10.5828 12.0833 11.6731 10.4214 12.0827 10" stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.6673 13.75C16.6673 15.8183 16.2357 16.25 14.1673 16.25H5.83398C3.76565 16.25 3.33398 15.8183 3.33398 13.75" stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

          Download
        </button>
      </div>
    </Teleport> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useHtmlToPdf } from '@/composables/core/useDownloadHtmlPdf';
const { downloadHtmlAsPdf, isDownloading } = useHtmlToPdf();
// import { useDownloadPdf } from '@/composables/core/useDownloadPdf';
// const { downloadPdf, isDownloading } = useDownloadPdf();
// import { useHtmlToPdf } from '@/composables/core/useCustomToast'

// import { useDownloadPdf } from '@/composables/core/useDownloadHtmlPdf';
// const { downloadHtmlAsPdf, isDownloading } = useHtmlToPdf();

// const contentToDownload = ref(null);
// const { downloadPdf } = useDownloadPdf();
// 
// const { showToast } = useCustomToast();
const router = useRouter()

// Define props with default values
interface Props {
  title: string;
  audience: string;
  lastUpdated: string;
  type: string;
  name: string;
  content: string;
  description: string;
  app: string;
  id: string;
  createdAt: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  audience: '',
  lastUpdated: '',
  type: '',
  name: '',
  content: '',
  description: '',
  app: '',
  id: '',
  createdAt: ''
});

// State for dropdown visibility and positioning
const showDropdown = ref(false);
const dropdownTrigger = ref<HTMLElement | null>(null);
const dropdownStyle = computed(() => {
  if (!dropdownTrigger.value) return {};

  const rect = dropdownTrigger.value.getBoundingClientRect();
  return {
    top: `${rect.bottom + 5}px`,
    left: `${rect.left - 160 + rect.width}px`
  };
});

const openDropdown = ref<number | null>(null);
const toggleDropdown = (id: number) => {
  openDropdown.value = openDropdown.value === id ? null : id;
};

const handleClickOutside = (event: MouseEvent) => {
  const dropdownId = `drop-options-${openDropdown.value}`;
  const dropdownButton = document.getElementById(dropdownId);
  if (dropdownButton && !dropdownButton.contains(event.target as Node)) {
    openDropdown.value = null;
  }
};


// Toggle dropdown visibility
const toggleDropdowns = (event: Event) => {
  event.stopPropagation();
  // Close all other dropdowns by emitting a custom event
  window.dispatchEvent(new CustomEvent('closeAllDropdowns', { detail: { id: props.id } }));
  showDropdown.value = !showDropdown.value;
};


// Close dropdown if clicked outside
const handleClickOutsides = (event: MouseEvent) => {
  if (dropdownTrigger.value && !dropdownTrigger.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

// Listen for close all dropdowns event
const handleCloseAllDropdowns = (event: CustomEvent) => {
  if (event.detail.id !== props.id) {
    showDropdown.value = false;
  }
};

// Action handlers
const viewPolicy = () => {
  console.log('View policy');
  const policyObj = { ...props }
  localStorage.setItem('selected-policy', JSON.stringify(policyObj))
  router.push(`/dashboard/settings/policy/${props.id}`)
  showDropdown.value = false;
};

const editPolicy = () => {
  console.log('Edit policy', props);
  // const paylaod = {
  //   title: props.title,
  //   audience: props.audience,
  //   lastUpdated: props.lastUpdated,
  //   type: props.type,
  //   name: props.name,
  //   content: props.content,
  //   description: props.description,
  //   app: props.app,
  //   id: props.id,
  //   createdAt: props.createdAt
  // }
  localStorage.setItem('selected-policy', JSON.stringify(props))
  showDropdown.value = false;
  router.push(`/dashboard/settings/policy/${props.id}/edit`)
};

const downloadPolicy = async () => {
  console.log(props.content, 'here')
  // Advanced usage with options
  // const htmlContent = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Terms of Use - Black Country</title><style>body{font-family:Arial,sans-serif;line-height:1.6;margin:20px;padding:20px;background-color:#f9f9f9}h1,h2,h3{color:#333}p{color:#555}</style></head><body><h1>Terms of Use of Black Country</h1><p>This document governs the use of our website and any other related agreement or legal relationship with us in a legally binding way. You must read this document carefully.</p><p><strong>Our website is provided by:</strong><br>Black Country, [Company Address]<br><strong>Contact email:</strong> <a href="mailto:contact@blackcountry.com">contact@blackcountry.com</a></p><h2>1. Acceptance of Terms</h2><p>By accessing or using the Black Country platform, you agree to comply with these Terms of Use. If you do not agree to these terms, please refrain from using our services.</p><h2>2. User Accounts</h2><p>To access certain features of the platform, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p><h2>3. Use of the Platform</h2><p>You agree to use the Black Country platform only for lawful purposes and in accordance with these Terms. You must not use the platform in any way that violates any applicable federal, state, local, or international law or regulation.</p><h2>4. Intellectual Property</h2><p>All content on the Black Country platform, including text, graphics, logos, and software, is the property of Black Country or its licensors and is protected by copyright laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.</p><h2>5. User Conduct</h2><p>You agree not to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the platform, or that may harm Black Country or users of the platform.</p><h2>6. Termination</h2><p>We reserve the right to terminate your access to our platform at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the platform.</p><h2>7. Limitation of Liability</h2><p>To the fullest extent permitted by law, Black Country shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform.</p><h2>8. Governing Law</h2><p>These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law principles.</p><h2>9. Changes to Terms</h2><p>We may revise these Terms from time to time at our discretion. Any changes will be effective immediately upon posting on this page. Your continued use of the platform after changes are made constitutes your acceptance of the new Terms.</p><h2>10. Contact Information</h2><p>For q here`
await downloadHtmlAsPdf(props.content, {
  fileName: props.name,
  orientation: 'p',
  pageSize: 'a4',
  margins: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },
  scaling: 2
});
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('closeAllDropdowns', handleCloseAllDropdowns as EventListener);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('closeAllDropdowns', handleCloseAllDropdowns as EventListener);
});
</script>