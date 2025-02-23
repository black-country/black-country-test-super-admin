<template>
  <div class="relative rounded-lg border-[0.5px] border-gray-50">
    <div class="block bg-yellow-200 rounded-t-lg">
      <div>
        <img v-if="type === 'privacy_policy'" src="@/assets/img/privacy-policy.png" alt="Privacy Policy" />
        <img v-if="type === 'terms_of_use'" src="@/assets/img/terms-condition.png" alt="Terms of Use" />
      </div>
      <div class="text-sm text-gray-600 space-y-1 p-4 bg-white relative">
        <div class="flex justify-between items-center">
          <p class="text-lg text-gray-800">{{ name === 'terms_of_use' ? 'Terms Of Use' : name === 'privacy_policy' ? 'Privacy Policy' : '' }}</p>
          <div class="relative">
            <button 
              @click="toggleDropdown"
              class="focus:outline-none p-2 hover:bg-gray-50 rounded-full"
              :aria-expanded="isOpen"
              aria-haspopup="true"
              :id="dropdownId"
            >
              <span class="sr-only">More options</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            <div 
              v-show="isOpen"
              class="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-50 origin-top-right"
              :class="{
                'lg:right-0 lg:left-auto': !isMobileScreen,
                'right-0 left-auto': isMobileScreen
              }"
              @click.stop
            >
              <div class="py-1">
                <button
                  class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
                  @click="viewPolicy"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.9527 9.20547C18.206 9.56072 18.3327 9.73839 18.3327 10.0013C18.3327 10.2642 18.206 10.4419 17.9527 10.7971C16.8143 12.3935 13.907 15.8346 9.99935 15.8346C6.09167 15.8346 3.18443 12.3935 2.04605 10.7971C1.79269 10.4419 1.66602 10.2642 1.66602 10.0013C1.66602 9.73839 1.79269 9.56072 2.04605 9.20547C3.18443 7.60917 6.09167 4.16797 9.99935 4.16797C13.907 4.16797 16.8143 7.60917 17.9527 9.20547Z" stroke="#326543" stroke-width="1.5" />
                    <path d="M12.5 10C12.5 8.61925 11.3807 7.5 10 7.5C8.61925 7.5 7.5 8.61925 7.5 10C7.5 11.3807 8.61925 12.5 10 12.5C11.3807 12.5 12.5 11.3807 12.5 10Z" stroke="#326543" stroke-width="1.5" />
                  </svg>
                  View
                </button>
                <button
                  class="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
                  @click="editPolicy"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5111 4.15199L14.6792 2.98386C15.3244 2.33871 16.3703 2.33871 17.0155 2.98386C17.6606 3.629 17.6606 4.67498 17.0155 5.32012L15.8473 6.48826M13.5111 4.15199L9.14952 8.51358C8.27846 9.38467 7.8429 9.82016 7.54632 10.3509C7.24974 10.8817 6.95135 12.1349 6.66602 13.3333C7.86442 13.048 9.11768 12.7496 9.64843 12.453C10.1792 12.1564 10.6147 11.7209 11.4858 10.8498L15.8473 6.48826M13.5111 4.15199L15.8473 6.48826" stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M17.5 10C17.5 13.5355 17.5 15.3033 16.4017 16.4017C15.3033 17.5 13.5355 17.5 10 17.5C6.46447 17.5 4.6967 17.5 3.59835 16.4017C2.5 15.3033 2.5 13.5355 2.5 10C2.5 6.46447 2.5 4.6967 3.59835 3.59835C4.6967 2.5 6.46447 2.5 10 2.5" stroke="#326543" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  Edit
                </button>
                <button 
                  :disabled="isDownloading"
                  class="flex items-center disabled:cursor-not-allowed disabled:opacity-25 gap-2 w-full px-4 py-3 text-sm text-[#1D2739] hover:bg-gray-50 focus:outline-none"
                  @click="downloadPolicy"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.99935 12.0833V3.75M9.99935 12.0833C9.41585 12.0833 8.32562 10.4214 7.91602 10M9.99935 12.0833C10.5828 12.0833 11.6731 10.4214 12.0827 10" stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M16.6673 13.75C16.6673 15.8183 16.2357 16.25 14.1673 16.25H5.83398C3.76565 16.25 3.33398 15.8183 3.33398 13.75" stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  {{ isDownloading ? 'downloading' : 'Download'}}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          Policy Audience:
          <span class="font-medium text-gray-900">{{ app == 'tenant-app' ? 'Tenant' : app == 'agent-app' ? 'Agents' : app == 'service-providers-app' ? 'Service providers' : '' }}</span>
        </div>
        <div>
          Last updated:
          <span class="font-medium text-gray-900">{{ moment(createdAt).format('DD MMMM YYYY, HH:mm:ss A') ?? 'Nil' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import { useHtmlToPdf } from '@/composables/core/useDownloadHtmlPdf';

const { downloadHtmlAsPdf, isDownloading } = useHtmlToPdf();
const router = useRouter();

// Props definition
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

// Dropdown state management
const isOpen = ref(false);
const dropdownId = computed(() => `dropdown-${props.id}`);
const isMobileScreen = ref(false);

// Check screen size
const checkScreenSize = () => {
  isMobileScreen.value = window.innerWidth < 768;
};

// Close all other dropdowns when one is opened
const closeOtherDropdowns = (event: CustomEvent) => {
  if (event.detail.id !== props.id && isOpen.value) {
    isOpen.value = false;
  }
};

// Toggle current dropdown
const toggleDropdown = () => {
  // Close other dropdowns first
  window.dispatchEvent(new CustomEvent('closeDropdown', { 
    detail: { id: props.id }
  }));
  isOpen.value = !isOpen.value;
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const dropdown = document.getElementById(dropdownId.value);
  if (dropdown && !dropdown.contains(target) && isOpen.value) {
    isOpen.value = false;
  }
};

// Action handlers
const viewPolicy = () => {
  const policyObj = { ...props };
  localStorage.setItem('selected-policy', JSON.stringify(policyObj));
  router.push(`/dashboard/settings/policy/${props.id}`);
  isOpen.value = false;
};

const editPolicy = () => {
  localStorage.setItem('selected-policy', JSON.stringify(props));
  isOpen.value = false;
  router.push(`/dashboard/settings/policy/${props.id}/edit`);
};

const downloadPolicy = async () => {
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
  window.addEventListener('closeDropdown', closeOtherDropdowns as EventListener);
  window.addEventListener('resize', checkScreenSize);
  checkScreenSize(); // Initial check
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('closeDropdown', closeOtherDropdowns as EventListener);
  window.removeEventListener('resize', checkScreenSize);
});
</script>