

   <template>
    <main>
      <TopNavBar />
      <div class="max-w-2xl mx-auto p-6">
        <h2 class="text- font-medium text-[#1D2739]">
          <span class="text-[#667185]">Profile</span> |
          <span class="font-medium">Profile Settings</span>
        </h2>
        <p class="mt-2 text-[#1D2739]">Set your profile picture</p>  
        <div class="mt-6 bg-[#F0F2F5] rounded-lg p-6 border-dashed border-2 border-[#F0F2F5] justify-center text-center flex items-center">
          <div id="image-preview" class="mb-4">
            <img
              v-if="user.profilePicture || profileImage"
              :src="profileImage || user.profilePicture"
              alt="Profile Preview"
              class="h-20 w-20 rounded-full object-cover"
            />
          </div>
  
          <!-- Add photo button is always visible -->
          <div class="flex justify-center items-center flex-col w-full">
            <div class="flex justify-center items-center">
              <button @click="triggerFileUpload" class="bg-[#5B8469] text-white py-2 px-4 rounded-md flex items-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 2V10" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M2 6H10" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span v-if="loading">Uploading...</span>
                <span v-else>Add photo</span>
              </button>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                ref="fileInput"
                @change="onFileSelected"
              />
            </div>
            <p class="text-[#1D2739] text-sm mt-2">Accepts jpg & png, 2MB size max/each</p>
          </div>
        </div>
  
        <div class="mt-8">
          <div class="space-y-1">
            <div class="border-[0.5px] border-gray-50 rounded-md bg-white">
              <NuxtLink
                v-for="(item, idx) in accountSettings"
                :key="idx"
                :to="item.path"
                class="flex items-center cursor-pointer justify-between p-4 rounded-lg"
              >
                <div class="flex items-center justify-between w-full">
                  <div class="flex items-center space-x-3">
                    <img :src="dynamicIcons(item.icon)" alt="" />
                    <span class="text-sm font- text-[#1D2739]">{{ item.label }}</span>
                  </div>
                  <div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.00003 4C6.00003 4 10 6.94593 10 8C10 9.05413 6 12 6 12"
                        stroke="#667185"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { dynamicIcons } from "@/utils/assets";
  import { useUser } from '@/composables/auth/user';
  import { useUploadFile } from '@/composables/core/upload'
  import { use_update_profile } from '@/composables/auth/updateProfile'
  
  const { user } = useUser();
  const { uploadFile, loading, uploadResponse } = useUploadFile();
  const { credential, updateProfile, loading: updating } = use_update_profile();
  
  // Profile image state
  const profileImage = ref<string | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);
  
  // Function to trigger file upload
  const triggerFileUpload = () => {
    fileInput.value?.click();
  };
  const router = useRouter();

  // Function to handle file selection and upload
const onFileSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    // Preview the image locally
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.value = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Upload the file using the composable
    await uploadFile(file);

    if (uploadResponse.value?.url) {
      // Update profile with the secure URL after upload
      const uploadPayload = { profilePicture: uploadResponse.value.url }
      await updateProfile(uploadPayload);
      router.push('/dashboard/profile')
    }
  }
};
  
  // Account settings for the menu
  const accountSettings = ref([
    {
      label: "Profile settings",
      icon: "profile",
      path: "/profile/personal-information",
    },
    {
      label: "Payment Information",
      icon: "payment",
      path: "/profile/payment-information",
    },
    {
      label: "Notification Preference",
      icon: "notification",
      path: "/profile/notification-preferences",
    },
    {
      label: "Login and Security",
      icon: "login",
      path: "/profile/login-security",
    },
  ]);

  definePageMeta({
     middleware: 'auth'
})
  </script>
  
  <style scoped></style>
  