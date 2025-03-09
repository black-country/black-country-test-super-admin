<template>
  <!-- Modal Backdrop and Modal -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-lg w-[600px] max-w-7xl max-h-[60%] overflow-y-auto custom-scrollbar">
      <h2 class="text-lg font-semibold text-gray-800 mb-6 pl-6 pt-6">Invite member(s)</h2>

      <div class="px-6">
        <!-- Dynamic Email and Role Inputs -->
        <div v-for="(member, index) in members" :key="index" class="mb-4 flex space-x-2">
          <div class="flex-1">
            <label class="block text-[#1D2739] font-medium mb-1 text-sm">Email</label>
            <input type="email" v-model="member.email" @input="validateEmail(index)"
              :class="['w-full px-4 py-3 bg-[#F0F2F5] outline-none border-[0.5px] text-sm rounded-md', invalidEmails[index] ? 'border-red-500' : 'border-gray-100']"
              placeholder="Enter email address" />
          </div>
          <div class="flex-1">
            <label class="block text-[#1D2739] font-medium mb-1 text-sm">Role</label>
            <select v-model="member.role"
              class="w-full px-4 py-3 bg-[#F0F2F5] outline-none border-[0.5px] text-sm border-gray-100 rounded-md">
              <option value="" disabled>Select a role</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="PROPERTY_MANAGER">Property Manager</option>
              <option value="SERVICE_PROVIDER">Service Provider</option>
              <option value="AGENT">Agent</option>
            </select>
          </div>
        </div>

        <!-- Add Member Button -->
        <div class="mb-6">
          <button @click="addMember"
            class="text-[#171717] bg-[#F9FAFB] font-medium flex text-sm py-3 px-3 rounded-lg items-center gap-x-3">
            <img :src="dynamicIcons('gray-add')" alt="Icon" />
            Add member
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="border-t border-gray-100 py-4">
        <div class="px-6 flex justify-between items-center space-x-4">
          <button @click="closeModal"
            class="px-4 py-3.5 font-semibold w-full border-[0.5px] text-sm bg-white text-[#292929] rounded-md">Cancel</button>
          <button @click="handleInvite" :disabled="!isFormValid || loading"
            class="px-4 disabled:cursor-not-allowed disabled:opacity-25 py-3.5 font-semibold w-full text-sm bg-[#292929] text-white rounded-md">
            {{ loading ? 'Processing...' : 'Send Invite' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useInviteMember } from '@/composables/modules/member/invite';
const { setMemberList, memberList, handleInvite, loading } = useInviteMember();
import { dynamicIcons } from '@/utils/assets';

// Props for controlling the modal's visibility
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

// Emit event to close the modal
const emit = defineEmits(['close']);

// Close modal function and clear input fields
const closeModal = () => {
  emit('close');
  members.value = [{ email: '', role: '' }]; // Clear the input fields when modal is closed
  invalidEmails.value = [false]; // Reset the invalid email indicators
  setMemberList(members.value);
};

// Array to store added members
const members = ref<{ email: string; role: string }[]>([
  { email: '', role: '' },
]);

// Reactive state to track invalid email fields
const invalidEmails = ref<boolean[]>([false]);

// Watch for changes in the `members` array and update `memberList` accordingly
watch(members, (newMembers) => {
  setMemberList(newMembers);
}, { deep: true });

// Function to add a new row for a member
const addMember = () => {
  members.value.push({ email: '', role: '' });
  invalidEmails.value.push(false); // Initialize with no error for the new email input
};

// Function to validate email addresses
const validateEmail = (index: number) => {
  const email = members.value[index].email;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  invalidEmails.value[index] = !emailPattern.test(email);
};

// Computed property to check if the form is valid
const isFormValid = computed(() => {
  return members.value.every(member => member.email && member.role) && !invalidEmails.value.includes(true);
});

// Initialize the member list when the component is mounted
setMemberList(members.value);
</script>
<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cccccc #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: #cccccc;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cccccc;
}
</style>
