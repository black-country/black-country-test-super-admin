
<template>
  <Layout class="flex flex-col justify-between h-screen min-h-screen bg-gray-25 relative">
    <template #header-content>
      <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
        <div class="flex items-center gap-x-4">
          <button @click="router.back()" class="text-[#1D2739] flex items-center gap-x-3 px-4 py-3 text-sm bg-gray-50 rounded-md">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 5C12.5 5 7.50001 8.68242 7.5 10C7.49999 11.3177 12.5 15 12.5 15" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back</button>
        </div>
      </div>
    </template>
    <main>  
      <div class="flex flex-col justify-between">
        <div class="max-w-3xl mx-auto p-6 w-full">
          <div class="text-gray-500 flex-col">
            <h2 class="text-xl font-semibold text-[#1D2739] pt-3">Profile Information</h2>
            <!-- {{profileObj}} -->
            
          </div>
          <div class="space-y-6">
            <div class="">
              <div class="mt-6 bg-[#F0F2F5] rounded-lg p-6 justify-center text-center flex items-center">
                <div id="image-preview" class="mb-4 pr-10">
                  <img v-if="profileObj.profilePicture" :src="profileObj.profilePicture" class="h-16 w-16 rounded-full" />
                  <img
                    v-else
                    src="@/assets/icons/avatar.svg"
                    alt="Profile Preview"
                    class="h-20 w-20 rounded-full object-cover"
                  />
                </div>
                <div class="">
                  <div class="flex justify-center items-center">
                    <button :disabled="uploading && updatingImageProfile" @click="triggerFileUpload" class="bg-[#5B8469] disabled:cursor-not-allowed disabled:opacity-25 text-white py-2 px-4 rounded-md flex items-center">
                      <svg v-if="!uploading" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2V10" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M2 6H10" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <span v-if="uploading">Uploading...</span>
                      <span v-if="updatingImageProfile">updating profile</span>
                      <span v-if="!uploading && !updatingImageProfile">{{ profileObj?.profilePicture ? 'Change' : 'Add' }} photo</span>
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
            </div>
            <div>
              <label for="full-name" class="text-[#1D2739] text-sm">Full Name</label>
              <input name="full-name" id="full-name" v-model="fullName" type="text" class="w-full p-2 mt-1 outline-none focus-within:border-2 focus-within:border-[#5B8469] border-[0.5px] text-sm rounded-md bg-[#E4E7EC] py-4">
            </div>
            <div>
              <label for="email" class="text-[#1D2739] text-sm">Email</label>
              <input name="email" id="email" v-model="credential.email" type="email" class="w-full p-2 mt-1 disabled:bg-gray-[#E4E7EC] cursor-not-allowed outline-none focus-within:border-2 focus-within:border-[#5B8469] border-[0.5px] text-sm rounded-md bg-[#E4E7EC] py-4" disabled />
            </div>
            <div>
              <label name="role" class="text-[#1D2739] text-sm">Role</label>
              <input name="role" id="role" v-model="credential.role" type="text" class="w-full p-2 mt-1 disabled:bg-gray-[#E4E7EC] cursor-not-allowed outline-none focus-within:border-2 focus-within:border-[#5B8469] border-[0.5px] text-sm rounded-md bg-[#E4E7EC] py-4" disabled />
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <div class="flex justify-between p-4 mt-6 max-w-3xl mx-auto w-full">
          <button @click="router.push('/dashboard/profile')" class="text-[#292929] border rounded-md px-4 py-3 hover:bg-gray-100">Cancel</button>
          <button :disabled="updating" @click="handleSave" class="text-white disabled:opacity-25 disabled:cursor-not-allowed font-medium rounded-md px-6 py-3 bg-[#292929]">{{updating ? 'Processing..' : 'Save'}}</button>
        </div>
      </div>
    </main>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/layouts/dashboard.vue';
import { ref, watch, onMounted } from 'vue';
import { useHopBack } from '@/composables/core/useHopBack';
import { use_update_profile } from '@/composables/auth/updateProfile';
import { useRouter, useRoute } from 'vue-router';
import { useUser } from '@/composables/auth/user';
import { useUploadFile } from '@/composables/core/upload';
import { use_admin_profile } from '@/composables/auth/getProfile';

const { profileObj } = use_admin_profile(); // Extract the profile object
const { hopBack } = useHopBack();
const { user } = useUser();
const { credential, updateProfile, loading: updating } = use_update_profile();
const router = useRouter();
const route = useRoute();
const updatingImageProfile = ref(false)

const fullName = ref(`${credential.value.firstName || ''} ${credential.value.lastName || ''}`); 

// Watch for changes in credential and update fullName
watch(
  () => [credential.value.firstName, credential.value.lastName],
  ([firstName, lastName]) => {
    fullName.value = `${firstName || ''} ${lastName || ''}`.trim();
  }
);

// Profile image state and file input ref
const profileImage = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

// Placeholder image URL
const placeholderImage = 'path/to/placeholder-image.png'; // Update this with the actual path to your placeholder image

// Function to trigger file upload
const triggerFileUpload = () => {
  fileInput.value?.click();
};

// Import upload composable and initialize loading state
const { uploadFile, loading, uploadResponse } = useUploadFile();
const uploading = ref(false);
const onFileSelected = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];

  // Ensure the file is valid before proceeding
  if (file && file instanceof Blob) {
    // Preview the image locally
    const reader = new FileReader();
    reader.onload = () => {
      profileImage.value = reader.result as string;
    };
    reader.readAsDataURL(file); // For preview purposes

    // Set uploading state to true
    uploading.value = true;

    // Upload the file using the composable
    try {
      await uploadFile(file); // Pass the file directly

      // Check if the upload was successful
      if (uploadResponse.value?.url) {
        // Update the profile image with the secure URL after upload
        profileImage.value = uploadResponse.value.url;

        const uploadPayload = { profilePicture: uploadResponse.value.url };
        updatingImageProfile.value = true
        await updateProfile(uploadPayload)
        updatingImageProfile.value = false 
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      // Set uploading state to false after completion
      // uploading.value = false;
      router.push('/dashboard/profile')
    }
  } else {
    console.error('Invalid file selected');
  }
};

// Function to handle saving the full name
const handleSave = async () => {
  const [firstName, ...lastNameParts] = fullName.value.trim().split(' ');
  const payload = {
    firstName: firstName || '',
    lastName: lastNameParts.join(' ') || '',
  };
  await updateProfile(payload);
  router.push('/dashboard/profile')
};

// On mounted, check if profileObj has a profilePicture
onMounted(() => {
  profileImage.value = profileObj.value?.profilePicture || placeholderImage; // Set the initial profile image
});

// Function to go back to the previous step
const goBack = () => {
  router.push('/profile/profile-settings');
};

definePageMeta({
     middleware: 'auth'
})
</script>
