import { auth_api } from "@/api_factory/modules/auth";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app"; // Use this to show toast notifications
import { useUser } from '@/composables/auth/user'
import { use_admin_profile } from '@/composables/auth/getProfile';
const { profileObj} = use_admin_profile();

export const use_update_profile = () => {
  const Router = useRouter();
  const { updateUser } = useUser()
  

  const credential = ref({
    firstName: "",
    lastName: "",
    profilePicture: "",
    email: "",
    role: ""
  }) as any;

  const loading = ref(false);
  const error = ref(null); // Track error messages

  const updateProfile = async (profilePayload: any) => {
    loading.value = true;
    error.value = null;

    try {
      const res = (await auth_api.$_update_profile(profilePayload)) as any;

      loading.value = false;

      if (res.type !== "ERROR") {
        useNuxtApp().$toast.success("Profile was updated successfully.", {
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
        console.log(res.data, 'update res')
        // Router.push('/dashboard/profile')
        updateUser(res.data)
        return res;
      } else {
        // If API returns an error, set the error state
        error.value = res.message || "An error occurred while updating the profile.";
        return Promise.reject(error.value);
      }
    } catch (err) {
      loading.value = false;
      error.value = err.message || "An unexpected error occurred while updating the profile.";
      useNuxtApp().$toast.error(error.value, {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
      return Promise.reject(error.value); // Return the error to the calling function
    }
  };

  // Prefill user credentials from localStorage when the component is mounted
  onMounted(() => {
    console.log(profileObj.value, 'from here')
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Update the credential object with data from local storage
        credential.value.firstName = parsedUser.firstName || "";
        credential.value.lastName = parsedUser.lastName || "";
        credential.value.profilePicture = parsedUser.profilePicture || "";
        credential.value.role = parsedUser.role || "";
        credential.value.email = parsedUser.email || "";
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  });

  return { credential, updateProfile, loading, error };
};
