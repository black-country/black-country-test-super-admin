<template>
  <div class="border-t bg-white p-3 sm:p-4 flex-shrink-0 sticky bottom-0 left-0 right-0 z-20">
    <!-- Error message -->
    <div v-if="uploadError" class="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
      <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
      </svg>
      <div class="flex-1">
        <p class="text-sm text-red-700">{{ uploadError }}</p>
      </div>
      <button @click="uploadError = ''" class="text-red-400 hover:text-red-600">
        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>

    <!-- Input container -->
    <div class="relative flex items-center gap-2">
      <!-- File upload button -->
      <button
        @click="triggerFileUpload"
        :disabled="isUploading || isSending || !isConnected"
        class="flex-shrink-0 p-2.5 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Attach file">
        <svg v-if="!isUploading" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 5v10M5 10h10" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <svg v-else class="animate-spin w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </button>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        @change="handleFileSelect"
        class="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      <!-- Message input -->
      <input
        v-model="localMessage"
        @keydown.enter="handleSend"
        :disabled="isUploading || isSending || !isConnected"
        type="text"
        class="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 rounded-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#5B8469] disabled:opacity-50 disabled:cursor-not-allowed"
        :placeholder="getPlaceholder"
      />

      <!-- Send button -->
      <button
        @click="handleSend"
        :disabled="!canSend"
        class="flex-shrink-0 p-2.5 sm:p-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :class="canSend ? 'bg-[#5B8469] hover:bg-[#4a6d56]' : 'bg-gray-300'">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M18 2L9 11M18 2l-5 16-4-7-7-4 16-5z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUploadFile } from '@/composables/core/upload';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  isSending: {
    type: Boolean,
    default: false
  },
  isConnected: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'sendMessage']);

const { uploadFile, loading: isUploading, uploadResponse } = useUploadFile();

const localMessage = ref(props.modelValue);
const fileInput = ref<HTMLInputElement | null>(null);
const uploadError = ref('');

watch(() => props.modelValue, (val) => {
  localMessage.value = val;
});

watch(localMessage, (val) => {
  emit('update:modelValue', val);
});

const getPlaceholder = computed(() => {
  if (!props.isConnected) return 'Not connected...';
  if (isUploading.value) return 'Uploading file...';
  if (props.isSending) return 'Sending...';
  return 'Type a message...';
});

const canSend = computed(() => {
  const hasText = localMessage.value.trim().length > 0;
  const notBusy = !isUploading.value && !props.isSending && props.isConnected;
  return hasText && notBusy;
});

const triggerFileUpload = () => {
  if (!isUploading.value && !props.isSending && props.isConnected) {
    uploadError.value = '';
    fileInput.value?.click();
  }
};

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  // Validate file size (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    uploadError.value = 'File must be smaller than 10MB';
    target.value = '';
    return;
  }

  try {
    await uploadFile(file);
    
    if (uploadResponse.value?.url) {
      uploadError.value = '';
      await sendFile();
    }
  } catch (error: any) {
    uploadError.value = error.message || 'Failed to upload file';
    console.error('Upload error:', error);
  } finally {
    target.value = '';
  }
};

const sendFile = async () => {
  if (!uploadResponse.value) return;

  const content = JSON.stringify({
    type: 'file',
    file: {
      url: uploadResponse.value.url,
      fileName: uploadResponse.value.fileName,
      mimetype: uploadResponse.value.mimetype
    },
    message: localMessage.value.trim()
  });

  emit('sendMessage', content);
  localMessage.value = '';
  uploadResponse.value = null;
};

const handleSend = () => {
  if (!canSend.value) return;
  
  const message = localMessage.value.trim();
  if (!message) return;

  emit('sendMessage', message);
  localMessage.value = '';
};
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>