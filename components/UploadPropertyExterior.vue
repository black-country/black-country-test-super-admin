

   <template>
    <main>
      <div class="flex flex-col flex-start items-start">
        <p class="text-gray-800 mb-1">
          Please upload images of the building's exterior and the surrounding street. This will help potential tenants understand the environment.
        </p>
        <p class="text-gray-500 text-sm mb-6">
          Accepts jpg & png | 2MB size max/each
        </p>
      </div>
  
      <div class="w-full h-full bg-[#F9F7F5] rounded-lg p-8">
        <!-- Image Preview Grid -->
        <div v-if="images.length > 0" class="grid grid-cols-2 gap-4 mb-6">
          <div v-for="(image, index) in images" :key="index" class="relative group border rounded-lg overflow-hidden">
            <img :src="image" alt="Uploaded Image" class="w-full h-44 object-cover object-cover transition-transform duration-200 ease-in-out" />
  
            <!-- Remove Button -->
            <button @click="removeImage(index)" class="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full focus:outline-none transition-opacity duration-200 ease-in-out opacity-0 group-hover:opacity-100">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="20" height="20" rx="10" fill="black" fill-opacity="0.5" />
                <path d="M14 7L7 14M7 7L14 14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>
  
        <!-- Progress Bar -->
        <div v-if="loading" class="w-full h-4 rounded-lg bg-gray-200 mb-6">
          <div :class="{'bg-red-500': uploadFailed, 'bg-green-500': uploadSuccess, 'bg-[#292929]': !uploadFailed && !uploadSuccess}"
            :style="{ width: `${progress}%` }"
            class="h-full transition-all duration-300 ease-in-out rounded-lg">
          </div>
        </div>
  
        <!-- Drag and Drop Area -->
        <div
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="handleDrop"
          class="flex flex-col justify-center items-center w-full h-64 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer relative"
        >
          <div v-if="loading" class="absolute animate-pulse inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            
          </div>
  
          <!-- Upload Placeholder -->
          <div v-if="images.length === 0 && !loading" class="flex flex-col items-center justify-center">
            <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-16 h-16 mb-3" />
            <p class="text-gray-700">Drag and drop photos here</p>
            <p class="text-gray-500 mb-4">or</p>
            <button @click="triggerFileUpload" class="bg-[#292929] text-white py-3 px-6 rounded-md">Upload from computer</button>
          </div>
  
          <!-- Image Upload Icon with Button -->
          <div v-if="images.length > 0 && !loading" class="flex flex-col items-center justify-center">
            <img src="@/assets/img/image-02.png" alt="Placeholder" class="w-16 h-16 mb-3" />
            <p class="text-gray-700">Drag and drop more photos here</p>
            <p class="text-gray-500 mb-4">or</p>
            <button @click="triggerFileUpload" class="bg-[#292929] text-white py-3 px-6 rounded-md">Upload from computer</button>
          </div>
        </div>
  
        <input type="file" accept="image/png, image/jpeg" multiple ref="fileInput" @change="handleFileUpload" class="hidden" />
      </div>
      <slot name="action-buttons"></slot>
    </main>
  </template>
  
  <script setup lang="ts">
  import { useBatchUploadFile } from '@/composables/core/batchUpload';
  import { ref, reactive, onMounted, watch } from 'vue';
  import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
  
  const { uploadFiles, uploadResponse, loading } = useBatchUploadFile();
  
  const fileInput = ref<HTMLInputElement | null>(null);
  const images = reactive<string[]>([]);
  const dragging = ref(false);
  const progress = ref(1);  // Initial progress set to 1%
  const uploadFailed = ref(false);
  const uploadSuccess = ref(false);
  
  const props = defineProps({
    payload: {
      type: Object,
      default: () => ({ images: [] })
    }
  });
  
  const emit = defineEmits(['updateImages']);
  
  onMounted(() => {
    if (Array.isArray(props.payload.images.value)) {
      images.push(...props.payload.images.value);
    } else {
      console.error("props.payload.images is not an array");
    }
  });
  
  watch(images, (newImages) => {
    emit('updateImages', newImages);
  }, { deep: true });
  
  function triggerFileUpload() {
    if (fileInput.value) {
      fileInput.value.click();
    }
  }
  
  async function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files.length > 0) {
      await uploadSelectedFiles(target.files);
    }
  }
  
  async function handleDrop(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      await uploadSelectedFiles(event.dataTransfer.files);
      dragging.value = false;
    }
  }
  
  async function uploadSelectedFiles(fileList: FileList) {
    try {
      progress.value = 1;  // Reset progress
      uploadFailed.value = false;
      uploadSuccess.value = false;
      
      const files = Array.from(fileList);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        if (progress.value < 100) {
          progress.value += 10;
        }
      }, 300);
  
      await uploadFiles(files);  // Upload files
      
      clearInterval(interval);
      progress.value = 100;
      uploadSuccess.value = true;
  
      const uploadedUrls = uploadResponse.value.map(response => response.url);
      images.push(...uploadedUrls);
  
      if (Array.isArray(props.payload.images.value)) {
        props.payload.images.value = [...images];
        showToast({
          title: "Success",
          message: "Property  Exterior and Street View Images was uploaded successfully!",
          toastType: "success",
          duration: 3000
        });
      } else {
        props.payload.images.value = uploadedUrls;
      }
    } catch (error) {
      progress.value = 100;
      uploadFailed.value = true;
      showToast({
          title: "Error",
          message: error || 'Something went wrong',
          toastType: "error",
          duration: 3000
        });
    }
  }
  
  function removeImage(index: number) {
    images.splice(index, 1);
  
    if (Array.isArray(props.payload.images.value)) {
      props.payload.images.value = [...images];
    }
  }
  </script>
  
  <style scoped>
    .loader {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #333;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  </style>
  