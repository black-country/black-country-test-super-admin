<template>
  <Layout>
    <template #header-content>
      <div
        class="container mx-auto flex items-center justify-between py-3 rounded-lg"
      >
        <div class="flex items-center justify-between gap-x-2 w-full">
          <div class="flex items-center gap-x-2">
            <button
              @click="router.back()"
              class="flex items-center text-gray-500 bg-[#F9FAFB] border-[0.5px] rounded-md py-3 px-3 hover:text-gray-700"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 5C12.5 5 7.50001 8.68242 7.5 10C7.49999 11.3177 12.5 15 12.5 15"
                  stroke="#292929"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="ml-2 text-[#292929]">Back</span>
            </button>
            <h1 class="text-base pl-3 font-semibold">New role</h1>
          </div>
          <div>
            <button
              @click="submitForm"
              :disabled="!permissions?.length"
              class="bg-[#292929] disabled:cursor-not-allowed disabled:opacity-25 text-white px-4 py-3 rounded-lg"
            >
              {{ creating ? "saving.." : "Create New Role" }}
            </button>
          </div>
        </div>
      </div>
    </template>
    <div v-if="permissions.length && !fetching" class="mx-auto p-3 bg-white border-[0.5px] border-gray-25 rounded-lg">
      <div class="p-4">
        <h2 class="text-lg font-semibold mb-4">Create New Role</h2>

        <!-- Role Name Input -->
        <div class="mb-4 space-y-2">
          <label for="role-title" class="block text-base">Role Title</label>
          <input
            id="role-title"
            v-model="roleTitle"
            placeholder="e.g Property manager"
            class="w-2/4 px-4 py-3 border-[0.5px] text-sm border-gray-300 outline-none rounded-md"
          />
        </div>

        <!-- Enable All Permissions Toggle -->
        <!-- <div class="flex items-center mb-4">
          <label class="text-[#667185] text-base  flex items-center mr-3">Enable all super admin permissions</label>
          <input
            type="checkbox"
            v-model="enableAllPermissions"
            @change="toggleAllPermissions"
            class="w-5 h-5"
          />
        </div> -->
        <div class="custom-checkbox-container mb-4">
            <label>
              <input
                type="checkbox"
                v-model="enableAllPermissions"
                @change="toggleAllPermissions"
                class="hidden-checkbox"
              />
              <span class="custom-checkbox"></span>
              <span class="checkbox-label">Enable all super admin permissions</span>
            </label>
          </div>

        <!-- Permissions List -->
        <div class="grid grid-cols-3 gap-8">
          <div
            v-for="(module, index) in groupedPermissions"
            :key="index"
            class="mb-4"
          >
            <h3 class="text-[#667185] text-base flex items-center font-semibold mb-2 uppercase">{{ module.name }}</h3>
            <div class="space-y-3">
              <label class="custom-checkbox-container ml-4">
                <input
                  type="checkbox"
                  @change="selectAllPermissions(module)"
                  :checked="isModuleFullySelected(module)"
                  class="hidden-checkbox"
                />
                Select all
                <span class="custom-checkbox"></span>
              </label>
              <div
                v-for="permission in module.permissions"
                :key="permission.id"
                class="ml-4"
              >
              <label class="custom-checkbox-container">
                {{ permission.name }}
                <input
                  type="checkbox"
                  v-model="selectedPermissions"
                  :value="permission.id"
                  class="hidden-checkbox"
                />
                <span class="custom-checkbox"></span>
              </label>     
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section v-else-if="fetching && !permissions.length">
        <div class="rounded-md p-4 w-full mx-auto">
          <div class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-6 py-1">
              <div class="h-44 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
       </section>
       <section v-else class="flex flex-col justify-between items-center space-y-2 mt-10">
        <svg width="152" height="124" viewBox="0 0 152 124" fill="none" xmlns="http://www.w3.org/2000/svg">
       <circle cx="76" cy="58" r="52" fill="#EAEAEA"/>
       <circle cx="21" cy="25" r="5" fill="#BDBDBD"/>
       <circle cx="18" cy="109" r="7" fill="#BDBDBD"/>
       <circle cx="145" cy="41" r="7" fill="#BDBDBD"/>
       <circle cx="134" cy="14" r="4" fill="#BDBDBD"/>
       <g filter="url(#filter0_b_6853_118795)">
       <rect x="52" y="34" width="48" height="48" rx="24" fill="#9D9D9D"/>
       <path d="M85.9598 56.9707C86.0134 57.8009 86.0134 58.6607 85.9598 59.4909C85.6856 63.7332 82.3536 67.1125 78.1706 67.3905C76.7435 67.4854 75.2536 67.4852 73.8294 67.3905C73.339 67.3579 72.8044 67.2409 72.344 67.0513C71.8318 66.8403 71.5756 66.7348 71.4454 66.7508C71.3153 66.7668 71.1264 66.9061 70.7487 67.1846C70.0827 67.6757 69.2437 68.0285 67.9994 67.9982C67.3703 67.9829 67.0557 67.9752 66.9148 67.7351C66.774 67.495 66.9494 67.1626 67.3002 66.4978C67.7867 65.5758 68.095 64.5203 67.6279 63.6746C66.8234 62.4666 66.1401 61.036 66.0402 59.4909C65.9866 58.6607 65.9866 57.8009 66.0402 56.9707C66.3144 52.7284 69.6464 49.3491 73.8294 49.0711C75.0318 48.9911 75.2812 48.9786 76.5 49.0337" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M72.5 61H79.5M72.5 56H76" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
       <path d="M86 51.5C86 53.433 84.433 55 82.5 55C80.567 55 79 53.433 79 51.5C79 49.567 80.567 48 82.5 48C84.433 48 86 49.567 86 51.5Z" stroke="white" stroke-width="1.5"/>
       </g>
       <defs>
       <filter id="filter0_b_6853_118795" x="44" y="26" width="64" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
       <feFlood flood-opacity="0" result="BackgroundImageFix"/>
       <feGaussianBlur in="BackgroundImageFix" stdDeviation="4"/>
       <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_6853_118795"/>
       <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_6853_118795" result="shape"/>
       </filter>
       </defs>
       </svg>
       <h2 class="text-[#1D2739]">No Roles and Permissions found</h2>
       <p class="text-[#667185]">You have not created any roles</p>
 </section>
  </Layout>
</template>

<script lang="ts" setup>
import Layout from "@/layouts/dashboard.vue";
import { useCreateRole } from '@/composables/modules/roles/create'
import { useFetchPermissions } from "@/composables/modules/permission-mgt/fetch-permissions";

const { permissions, loading: fetching } = useFetchPermissions();
const { createRole, loading, payload } = useCreateRole()

const router = useRouter()
// State for role form
const roleTitle = ref("");
const enableAllPermissions = ref(false);
const selectedPermissions = ref<string[]>([]);

// Group permissions by accessModule
const groupedPermissions = computed(() => {
  const groups = permissions.value.reduce((acc: any, permission: any) => {
    const module = permission.accessModule.name;
    if (!acc[module]) {
      acc[module] = { name: module, permissions: [] };
    }
    acc[module].permissions.push(permission);
    return acc;
  }, {});
  return Object.values(groups);
});

// Select All Permissions for a Module
const selectAllPermissions = (module: any) => {
  const modulePermissions = module.permissions.map((perm: any) => perm.id);
  if (isModuleFullySelected(module)) {
    selectedPermissions.value = selectedPermissions.value.filter(
      (permId: string) => !modulePermissions.includes(permId)
    );
  } else {
    selectedPermissions.value.push(
      ...modulePermissions.filter(
        (permId: string) => !selectedPermissions.value.includes(permId)
      )
    );
  }
};

// Check if all permissions in a module are selected
const isModuleFullySelected = (module: any) => {
  const modulePermissions = module.permissions.map((perm: any) => perm.id);
  return modulePermissions.every((permId: string) =>
    selectedPermissions.value.includes(permId)
  );
};

// Toggle All Permissions
const toggleAllPermissions = () => {
  if (enableAllPermissions.value) {
    // Select all permissions if "Enable all super admin permissions" is checked
    selectedPermissions.value = permissions.value.map((perm: any) => perm.id);
  } else {
    // Deselect all permissions if unchecked
    selectedPermissions.value = [];
  }
};

// Utility function to format the role name
const formatRoleName = (name: string): string => {
  // Remove invalid characters (anything except letters, numbers, underscores, or hyphens)
  let formattedName = name.replace(/[^a-zA-Z0-9_-]/g, '');

  // Ensure it does not start or end with an underscore or hyphen
  formattedName = formattedName.replace(/^[_-]+|[_-]+$/g, '');

  return formattedName;
};

// Submit Form Function
const submitForm = async () => {
  // Format role name before sending
  const formattedRoleName = formatRoleName(roleTitle.value);

  if (!formattedRoleName) {
    console.error('Invalid role name. Please provide a valid name.');
    return;
  }

  // Prepare payload to match the required structure
  const roleData = {
    role: {
      name: formattedRoleName,
    },
    permissionIds: selectedPermissions.value,
  };

  console.log('Payload:', roleData);
  
  try {
    // Call the API to create a role (replace createRole with your actual API call function)
    await createRole(roleData);
    console.log("Role successfully created.");
  } catch (error) {
    console.error("Error creating role:", error);
  }
};

// Computed property to check if submit button should be disabled
const isSubmitDisabled = computed(() => {
  return roleTitle.value.trim() === '' || selectedPermissions.value.length === 0;
});
</script>

<style scoped>
/* Hide the default checkbox */
.hidden-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

/* Custom checkbox container */
.custom-checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #667185; /* Light text color */
}

/* Custom checkbox style */
.custom-checkbox {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #f0f4f8;
  border-radius: 6px;
  position: relative;
  margin-left: auto;
  transition: all 0.3s ease;
  border: 1px solid #d1d5db;
}

/* Checkmark (green tick) */
.custom-checkbox::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 10px;
  border: solid green;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.2s ease;
}

/* When checkbox is checked, show the green tick */
.hidden-checkbox:checked + .custom-checkbox {
  background-color: #e6ffe6;
  border-color: #34d399; /* Light green */
}

.hidden-checkbox:checked + .custom-checkbox::after {
  transform: translate(-50%, -50%) scale(1);
}

/* Additional styling for text alignment and layout */
.custom-checkbox-container {
  padding: 10px;
}

/* Hide the default checkbox */
.hidden-checkbox {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }
  
  /* Custom checkbox container */
  .custom-checkbox-container {
    display: flex;
    align-items: center;
  }
  
  /* Custom checkbox style */
  .custom-checkbox {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #f0f4f8;
    border-radius: 6px;
    position: relative;
    margin-right: 8px; /* Reduced margin for no large space */
    transition: all 0.3s ease;
    border: 1px solid #d1d5db;
  }
  
  /* Checkmark (green tick) */
  .custom-checkbox::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 10px;
    border: solid green;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s ease;
  }
  
  /* When checkbox is checked, show the green tick */
  .hidden-checkbox:checked + .custom-checkbox {
    background-color: #e6ffe6;
    border-color: #34d399; /* Light green */
  }
  
  .hidden-checkbox:checked + .custom-checkbox::after {
    transform: translate(-50%, -50%) scale(1);
  }
  
  /* Label Styling */
  .checkbox-label {
    font-size: 16px;
    color: #667185; /* Light grey text color */
    vertical-align: middle;
  }
</style>
