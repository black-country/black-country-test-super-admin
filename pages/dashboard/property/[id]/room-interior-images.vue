<template>
  <Layout>
    <template #header-content>
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
          <div class="flex items-center gap-x-4">
            <button @click="router.back()" class="text-[#1D2739] flex items-center gap-x-3 px-4 py-3 text-sm bg-gray-50 rounded-md">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 5C12.5 5 7.50001 8.68242 7.5 10C7.49999 11.3177 12.5 15 12.5 15" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              Back</button>
          </div>
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <NuxtLink to="/dashboard/notification" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative">
              <span class="sr-only">View notifications</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            <div v-if="notificationCount > 0" class="h-2 w-2 bg-red-600 absolute rounded-full top-2.5 right-2.5"></div>
            </NuxtLink>
            <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true"></div>
            <div class="relative">
              <button type="button" class="-m-1.5 flex items-center p-1.5" id="user-menu-button" aria-expanded="false"
                aria-haspopup="true">
                <span class="sr-only">Open user menu</span>
                <p class="bg-gray-900 text-white p-3 font-semibold rounded-lg">{{initials}}</p>
  
                <span class="hidden lg:flex lg:items-center">
                  <div>
                      <span v-if="user"
                      class="ml-4 text-sm py-0 my-0 font-semibold block leading-6 text-gray-900"
                      aria-hidden="true"
                      > {{user?.firstName}}  {{user?.lastName}}</span
                    >
                    <span class="text-sm py-0 my-0 font-light text-[#667185] block">Super admin</span>
                  </div>
                  <svg @click="router.push('/dashboard/profile')" class="cursor-pointer" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="#1D2739" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
  
                </span>
              </button>
            </div>
          </div>
        </div>
      </template>
  <main>
    <section class="grid grid-cols-3 gap-6 max-w-10xl mx-auto">
      <section v-for="(image, index) in previewImages" :key="index" :src="image">
        <div>
          <CoreImageZoom class="cursor-pointer" :src="image" />
        </div>
      </section>
    </section>
  </main>
</Layout>
</template>

<script setup lang="ts">
import { useUserInitials } from '@/composables/core/useUserInitials';
import { useUser } from '@/composables/auth/user';
import Layout from '@/layouts/dashboard.vue';
import { useFetchProperty } from "@/composables/modules/property/fetchProperty";
import { useRouter } from 'vue-router';
import { useFetchNotificationCount } from '~/composables/modules/notification/fetchCount';
const router = useRouter();

const { propertyObj, loading } = useFetchProperty();
const allImages = computed(() => extractImages(propertyObj.value));
const {notificationCount} = useFetchNotificationCount();
const { user } = useUser();

definePageMeta({
  middleware: 'auth'
});

const initials = ref('');
const previewImages = ref<string[]>([]);

onMounted(() => {
  const { getInitials } = useUserInitials(user.value);
  initials.value = getInitials.value;
  const storedImages = localStorage.getItem('selectedImages');
  if (storedImages) {
    previewImages.value = JSON.parse(storedImages);
  }
});
</script>


<style scoped>
.preview-image {
  width: 200px;
  height: auto;
  margin: 10px;
}
</style>
