
<template>
    <div class="space-y-6 pb-20">
      <h2 class="text-lg font-semibold mt-4">Compose the message</h2>
      <!-- {{ props}} -->
      
      <!-- Cover Image Section -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Cover image (Optional)</label>
        <div v-if="!coverImageUrl" class="border-[0.5px] border-dashed bg-[#F0F2F5] rounded-lg p-8 text-center">
          <button 
            type="button"
            @click="triggerCoverImageUpload" 
            class="px-4 text-sm py-2.5 bg-[#5B8469] text-white rounded-md hover:bg-[#4A7358]"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Uploading...
            </span>
            <span v-else>+ Cover photo</span>
          </button>
          <p class="text-sm text-gray-500 mt-2">Accepts jpg & png 2MB size max/each</p>
          <input
            ref="coverImageInput"
            type="file"
            accept="image/jpeg,image/png"
            class="hidden"
            @change="handleCoverImageUpload"
          />
        </div>
        
        <!-- Cover Image Preview -->
        <div v-else class="relative w-full">
          <img 
            :src="coverImageUrl" 
            alt="Cover" 
            class="w-full h-[200px] object-cover rounded-lg"
          />
          <div class="absolute top-4 right-4 flex space-x-2">
            <!-- <button 
              @click="triggerCoverImageUpload"
              class="p-2 bg-[#5B8469] text-white rounded-md hover:bg-[#4A7358] transition-colors"
            >
              Change
            </button> -->
            <button 
              type="button"
              @click="removeCoverImage"
              class="p-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Subject Input -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Subject</label>
        <input
          type="text"
          v-model="subject"
          placeholder="Enter notification subject"
          class="w-full text-sm outline-none border py-4 pl-5 placeholder:text-[#98A2B3] bg-[#F0F2F5] rounded-md border-gray-25"
        />
      </div>
  
      <!-- Notification Content -->
      <div class="space-y-1 pb-24">
        <label class="block text-sm font-medium text-gray-700">Notification content</label>
        <CoreQuill class="h-[100px]" v-model="content" />
      </div>
  
      <!-- File Upload Section -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Upload file</label>
        
        <!-- File Upload Grid -->
        <div :class="[uploadedFiles?.length ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : '']" class="">
          <!-- Uploaded Files -->
          <template v-for="(file, index) in uploadedFiles" :key="index">
            <div class="bg-white rounded-lg border-[0.5px] border-gray-100 p-4">
              <div v-if="file.type === 'pdf'" class="flex flex-col items-center">
                <img src="@/assets/img/pdf-file.png" alt="PDF" class="w-12 h-12 mb-2" />
                <p class="text-sm text-gray-900 truncate w-full text-center">{{file.name}}</p>
                <p class="text-xs text-gray-500">{{formatFileSize(file.size)}}</p>
              </div>
              <div v-else-if="isImage(file)" class="flex flex-col items-center">
                <img :src="file.url" alt="Preview" class="w-full h-32 object-cover rounded-lg mb-2" />
                <p class="text-sm text-gray-900 truncate w-full text-center">{{file.name}}</p>
                <p class="text-xs text-gray-500">{{formatFileSize(file.size)}}</p>
              </div>
            </div>
          </template>
  
          <!-- Upload Button Card -->
          <div 
            class="border-[0.5px] border-dashed bg-[#F0F2F5] rounded-lg flex flex-col items-center justify-center p-4"
            :class="{'h-full': uploadedFiles.length === 0, 'h-40': uploadedFiles.length > 0}"
          >
            <button 
              @click="triggerFileUpload" 
              type="button"
              class="px-4 text-sm py-2.5 bg-[#5B8469] text-white rounded-md hover:bg-[#4A7358]"
              :disabled="uploading"
            >
              <span v-if="uploading" class="flex items-center">
                <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Uploading...
              </span>
              <span v-else>+ Add file</span>
            </button>
            <p class="text-sm text-gray-500 text-center mt-2">Accepts pdf, doc, jpg & png</p>
            <p class="text-sm text-gray-500 text-center">2MB size max/each</p>
            <input
              ref="fileInput"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              class="hidden"
              @change="handleFileUpload"
              multiple
            />
          </div>
        </div>
      </div>
  
      <div class="border-t border-gray-25 bg-white flex justify-between  lg:px-32 items-center space-x-4 p-4 fixed bottom-0 left-0 w-full">
      <button
        @click="$emit('prev')"
        class="px-6 py-2.5 border rounded-md text-[#292929] bg-[#EBE5E0]"
      >
        Previous
      </button>
      <button
         :disabled="!isValid || processing"
         @click="emitData()"
        class="px-6 py-2.5 disabled:cursor-not-allowed disabled:opacity-25 rounded-md bg-[#292929] text-white"
      >
        <span v-if="!processing">{{  isLastStep ? 'Submit' : 'Next' }}</span>
        <span v-else>{{ processing ? 'processing' : '' }}</span>
      </button>
    </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useUploadFile as useImageUpload } from '@/composables/core/upload';
  import { useUploadFile as usePdfUpload } from '@/composables/core/uploadPdf';
  import { useCreateSchedule } from '@/composables/modules/settings/useCreateSchedule'
  const { loading: processing } = useCreateSchedule()
  
  const text = ref<string>("");
  const subject = ref('');
  const content = ref('');
  const coverImageInput = ref<HTMLInputElement | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);
  const uploadedFiles = ref<Array<{
    name: string;
    size: number;
    type: string;
    url: string;
  }>>([]);
  
  // Image upload composable
  const { 
    uploadFile: uploadImage, 
    loading, 
    uploadResponse: imageUploadResponse 
  } = useImageUpload();

  const props = defineProps({
    isLastStep: Boolean
  })
  
  // PDF upload composable
  const { 
    pdfUploadFile, 
    uploadResponse: pdfUploadResponse, 
    loading: uploading, 
    // processing: assigning 
  } = usePdfUpload();
  
  const coverImageUrl = computed(() => imageUploadResponse.value?.url || null);
  
  // Cover Image Functions
  const triggerCoverImageUpload = () => {
    coverImageInput.value?.click();
  };
  
  const handleCoverImageUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should not exceed 2MB');
        return;
      }
      
      try {
        await uploadImage(file);
      } catch (error) {
        console.error('Error uploading cover image:', error);
        alert('Failed to upload cover image');
      }
    }
  };
  
  const removeCoverImage = () => {
    if (coverImageInput.value) {
      coverImageInput.value.value = '';
    }
    // Reset upload response
    imageUploadResponse.value = null;
  };
  
  // File Upload Functions
  const triggerFileUpload = () => {
    fileInput.value?.click();
  };
  
  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const newFiles = Array.from(target.files);
      
      // Validate file sizes
      const invalidFiles = newFiles.filter(file => file.size > 2 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        alert('Some files exceed the 2MB size limit');
        return;
      }
      
      for (const file of newFiles) {
        try {
          if (file.type === 'application/pdf') {
            await pdfUploadFile(file, );
            if (pdfUploadResponse.value) {
              uploadedFiles.value.push({
                name: file.name,
                size: file.size,
                type: 'pdf',
                url: pdfUploadResponse.value.url
              });
            }
          } else if (file.type.startsWith('image/')) {
            await uploadImage(file);
            if (imageUploadResponse.value) {
              uploadedFiles.value.push({
                name: file.name,
                size: file.size,
                type: 'image',
                url: imageUploadResponse.value.url
              });
            }
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          alert(`Failed to upload ${file.name}`);
        }
      }
    }
  };
  
  // Utility Functions
  const isImage = (file: { type: string }) => {
    return file.type === 'image';
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };


  const isValid = computed(() => subject.value.trim() !== '' && content.value.trim() !== '' && uploadedFiles.value !== []);
  const emit = defineEmits(['next'])

  const emitData = () => {
  if (isValid.value) {
    emit('next', { coverImage: coverImageUrl.value,  subject: subject.value, content: content.value, files: uploadedFiles.value });
  }
};
  </script>