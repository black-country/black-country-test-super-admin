<template>
    <div class="bg-white rounded-lg mt-3">
      <h2 class="text-sm font-medium mb-4 text-[#1D2739]">Signature</h2>
  
      <!-- Signature Method Selector -->
      <section class="flex justify-between items-center">
        <div class="flex space-x-6 border-b">
          <button
            @click="setMode('draw')"
            :class="{ 'border-[#1D2739] text-[#1D2739]': mode === 'draw' }"
            class="pb-2 text-sm border-b-2 border-transparent"
          >
            Draw
          </button>
          <button
            @click="setMode('type')"
            :class="{ 'border-[#1D2739] text-[#1D2739]': mode === 'type' }"
            class="pb-2 text-sm border-b-2 border-transparent"
          >
            Type
          </button>
          <button
            @click="setMode('upload')"
            :class="{ 'border-[#1D2739] text-[#1D2739]': mode === 'upload' }"
            class="pb-2 text-sm border-b-2 border-transparent"
          >
            Upload
          </button>
        </div>
  
        <div class="flex items-center space-x-2">
          <div
            v-for="color in colors"
            :key="color"
            :style="{ backgroundColor: color }"
            class="w-6 h-6 rounded-full cursor-pointer border-4"
            :class="{
              'border-gray-300': selectedColor !== color,
              'border-black': selectedColor === color
            }"
            @click="selectColor(color)"
          ></div>
        </div>
      </section>
  
      <!-- Draw Mode -->
      <div v-if="mode === 'draw'" class="mb-4 border-[0.5px] rounded-lg">
        <Vue3Signature
          ref="signaturePad"
          class="bg-[#F0F2F5]"
          :sigOption="{ ...state.option, penColor: selectedColor }"
          :w="'600px'"
          :h="'100px'"
        />
        <div class="flex space-x-4 mt-2 p-3">
          <button :disabled="loading" @click="saveSignature('image/jpeg')" class="bg-black disabled:cursor-not-allowed disabled:opacity-25 text-white text-xs px-4 py-2 rounded-sm"> {{loading ? 'saving..' : 'Save Drawing'}}</button>
          <button @click="clearSignature" class="bg-black text-white text-xs px-4 py-2 rounded-sm">Clear</button>
          <button @click="undoSignature" class="bg-black text-white text-xs px-4 py-2 rounded-sm">Undo</button>
        </div>
      </div>
  
      <!-- Type Mode -->
      <div v-if="mode === 'type'" class="mb-4 rounded-b-lg border-[0.5px] border-gray-100 bg-[#F0F2F5]">
        <input
          v-model="typedSignature"
          placeholder="Type your signature"
          class="w-full p-2 py-10 outline-none text-center bg-[#F0F2F5] rounded"
          :style="{ fontFamily: 'Cursive', fontSize: '24px', color: selectedColor }"
        />
        <div class="m-3">
          <button :disabled="loading" @click="saveTypedSignatureAsImage" class="mt-2 bg-black disabled:cursor-not-allowed disabled:opacity-25 text-white text-xs px-3 py-2.5 rounded-md">{{loading ? 'saving..' : 'Save Typed Signature'}} </button>
        </div>
        <canvas ref="canvas" class="hidden"></canvas>
      </div>
  
      <!-- Upload Mode -->
      <div v-if="mode === 'upload'" class="mb-4 border-[0.5px] border-gray-100 py-10 bg-[#F0F2F5] rounded-b-lg flex justify-center items-center">
        <div v-if="!previewImage" class="text-center py-8">
          <p class="text-sm text-gray-500">Supports <span class="text-black">jpg, png</span> <span class="text-sm text-gray-500">Size</span> <span class="text-black">20 MB</span></p>
          <label class="cursor-pointer text-black font-medium text-sm">
            <input type="file" @change="handleFileUpload" accept="image/*" class="hidden text-sm" />
            Select Image
          </label>
        </div>
        <div v-else class="mt-4">
          <img :src="previewImage" alt="Preview" class="max-w-xs h-32 w-32 object-cover border rounded-md" />
        </div>
        <button :disabled="loading" v-if="previewImage" @click="saveUploadedSignature" class="mt-2 ml-3 bg-black  disabled:cursor-not-allowed disabled:opacity-25 text-white text-xs px-3 py-2.5 rounded-md">{{loading ? 'saving..' : 'Save Uploaded Signature'}}</button>
      </div>
  
      <!-- Display the saved signature -->
      <div v-if="!loading">
        <div v-if="savedSignature" class="mt-6 p-4 rounded-lg border border-gray-50 bg-[#F0F2F5]">
          <h3 class="text-sm font-medium mb-2">Saved Signature:</h3>
          <div v-if="mode === 'draw' || mode === 'upload'" class="f">
            <img :src="savedSignature" alt="Signature" class="border p-2 h-32 w-full object-cover rounded max-w-xs" />
          </div>
          <div v-if="mode === 'type'" class="typed-signature">
            <img :src="savedSignature" alt="Typed Signature Image" class="border p-2 h-32 w-full object-cover rounded max-w-xs" />
          </div>
        </div>
      </div>
      <section v-else>
          <div class="animate-pulse flex space-x-4 h-20 bg-gray-100 rounded-md p-4 w-full mx-auto mt-10"></div>
      </section>
  
  
      <p class="text-gray-600 mt-4 text-xs">
        By signing this document with an electronic signature, I agree that such signature will be as valid as handwritten signatures.
      </p>
    </div>
  </template>
  
  <!-- <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import Vue3Signature from 'vue3-signature'
  
  const mode = ref('type') // Default mode
  const typedSignature = ref('')
  const savedSignature = ref<string | null>(null)
  const uploadedSignature = ref<File | null>(null)
  const previewImage = ref<string | null>(null) // Holds the preview image for uploaded signatures
  const selectedColor = ref('#0000FF') // Default signature color (blue)
  const colors = ['#000000', '#0000FF', '#FF0000'] // Available colors for signature
  
  const state = reactive({
    option: {
      backgroundColor: "rgb(255,255,255)"
    }
  })
  const signaturePad = ref(null)
  const canvas = ref<HTMLCanvasElement | null>(null)
  
  const setMode = (newMode: string) => {
    mode.value = newMode
  }
  
  const emit = defineEmits(['signature'])
  
  // Save the drawn signature
  const saveSignature = (type: string) => {
    if (signaturePad.value) {
      const signatureData = signaturePad.value.save(type)
      console.log(signatureData, 'signature data')
      savedSignature.value = signatureData
      emit('signature', savedSignature.value)
    }
  }


//   const onFileSelected = async (event: Event) => {
//   const file = (event.target as HTMLInputElement).files?.[0];
//   if (file) {
//     // Preview the image locally
//     const reader = new FileReader();
//     reader.onload = () => {
//       profileImage.value = reader.result as string;
//     };
//     reader.readAsDataURL(file);

//     // Upload the file using the composable
//     await uploadFile(file);

//     if (uploadResponse.value?.secure_url) {
//       // Update profile with the secure URL after upload
//       const uploadPayload = { profilePicture: uploadResponse.value.secure_url }
//       await updateProfile(uploadPayload);
//     }
//   }
// };
  
  // Clear the drawn signature
  const clearSignature = () => {
    signaturePad.value?.clear()
  }
  
  // Undo the last action in the drawn signature
  const undoSignature = () => {
    signaturePad.value?.undo()
  }
  
  // Save the typed signature as an image using canvas
  const saveTypedSignatureAsImage = () => {
    if (!typedSignature.value || !canvas.value) return
  
    const ctx = canvas.value.getContext('2d')
    if (ctx) {
      canvas.value.width = 600
      canvas.value.height = 100
  
      ctx.fillStyle = 'rgb(255, 255, 255)' // Background color
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
      ctx.font = '24px Cursive'
      ctx.fillStyle = selectedColor.value
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(typedSignature.value, canvas.value.width / 2, canvas.value.height / 2)
  
      savedSignature.value = canvas.value.toDataURL('image/png')
      emit('signature', savedSignature.value)
    }
  }
  
  // Handle file upload for signature and preview it
  const handleFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0] || null
    uploadedSignature.value = file
  
    // Generate preview image
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Save the uploaded signature (same as preview image)
  const saveUploadedSignature = () => {
    if (previewImage.value) {
      savedSignature.value = previewImage.value
      emit('signature', savedSignature.value)
    }
  }
  
  // Change the signature color
  const selectColor = (color: string) => {
    selectedColor.value = color
  }
  </script>
   -->

   <script setup lang="ts">
import { ref, reactive } from 'vue'
import Vue3Signature from 'vue3-signature'
import { useUploadFile } from '@/composables/core/upload'
const { uploadFile, loading, uploadResponse } = useUploadFile();
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

const mode = ref('type') // Default mode
const typedSignature = ref('')
const savedSignature = ref<string | null>(null)
const uploadedSignature = ref<File | null>(null)
const previewImage = ref<string | null>(null) // Holds the preview image for uploaded signatures
const selectedColor = ref('#0000FF') // Default signature color (blue)
const colors = ['#000000', '#0000FF', '#FF0000'] // Available colors for signature

const state = reactive({
  option: {
    backgroundColor: "rgb(255,255,255)"
  }
})
const signaturePad = ref(null)
const canvas = ref<HTMLCanvasElement | null>(null)

const setMode = (newMode: string) => {
  mode.value = newMode
}

const emit = defineEmits(['signature', 'savedSignature'])

// Convert base64 data to a File object
const base64ToFile = (base64: string, filename: string) => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || ''
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

// Save the drawn signature
const saveSignature = async (type: string) => {
  if (signaturePad.value) {
    const signatureData = signaturePad.value.save(type)
    savedSignature.value = signatureData
    emit('signature', savedSignature.value)

    const file = base64ToFile(savedSignature.value, 'signature.jpeg')
    await uploadSignatureFile(file)
  }
}

// Clear the drawn signature
const clearSignature = () => {
  signaturePad.value?.clear()
}

// Undo the last action in the drawn signature
const undoSignature = () => {
  signaturePad.value?.undo()
}

// Save the typed signature as an image using canvas
const saveTypedSignatureAsImage = async () => {
  if (!typedSignature.value || !canvas.value) return

  const ctx = canvas.value.getContext('2d')
  if (ctx) {
    canvas.value.width = 600
    canvas.value.height = 100

    ctx.fillStyle = 'rgb(255, 255, 255)' // Background color
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.font = '24px Cursive'
    ctx.fillStyle = selectedColor.value
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(typedSignature.value, canvas.value.width / 2, canvas.value.height / 2)

    savedSignature.value = canvas.value.toDataURL('image/png')
    emit('signature', savedSignature.value)

    const file = base64ToFile(savedSignature.value, 'typed-signature.png')
    await uploadSignatureFile(file)
  }
}

// Handle file upload for signature and preview it
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0] || null
  uploadedSignature.value = file

  // Generate preview image
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// Save the uploaded signature (same as preview image)
const saveUploadedSignature = async () => {
  if (previewImage.value) {
    savedSignature.value = previewImage.value
    emit('signature', savedSignature.value) 
    // uploadResponse

    const file = uploadedSignature.value
    if (file) {
      await uploadSignatureFile(file)
    }
  }
}

// Upload file using FormData
const uploadSignatureFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file) // Append the file to the FormData object

  try {
    // Call the composable to upload the file (implement the logic here)
    await uploadFile(file)
    emit('savedSignature', uploadResponse.value) 
    showToast({
          title: "Success",
          message: 'Signature was uploaded successfully!',
          toastType: "success",
          duration: 3000
        });
  } catch (error) {
    showToast({
          title: "Error",
          message: 'Something went wrong while saving signature',
          toastType: "error",
          duration: 3000
        });
  }
}

// // Simulated upload function to demonstrate FormData usage
// const uploadFile = async (formData: FormData) => {
//   console.log('Uploading file via FormData...', formData.get('file'))
//   // You can implement the actual upload logic using Axios, Fetch, or any other method to send the file to your server or cloud storage
// }
</script>