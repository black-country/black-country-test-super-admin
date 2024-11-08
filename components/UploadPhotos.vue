<template>
    <main>
      <div class="container mx-auto p-4">
        <div class="space-y-2 mb-10">
          <h2 class="text-[#1D2739] font-light">Click to add as as much pictures as you want to for each common area or space.</h2>
          <p class="text-sm">Accepts <span class="font-semibold text-[#1D2739]">jpg</span> & <span class="font-semibold text-[#1D2739]">png</span> <span class="font-semibold text-[#1D2739]">2MB</span> size max/each</p>
        </div>
        <section class="mt-3">
          <div class="grid  lg:grid-cols-2 gap-4">
            <ImageUpload
              @update:images="handleImages"
              v-for="item in commonAreas"
              :key="item.name"
              :label="item.name"
              :payload="payload"
              location="common-areas"
            />
          </div>
        </section>
      </div>
    </main>
  </template>
  
  <script setup lang="ts">
  const commonAreas  = ref<any[]>([]) // Ensuring an array
  
  function handleImages(images: any) {
    console.log(images); // This will log the base64 array of images
  }
  
  const props = defineProps({
    payload: {
      type: Object,
      default: () => ({ commonAreas: [] }) // Default to an empty array if commonAreas is not provided
    }
  })
  
  // Ensure `payload.commonAreas` is handled correctly
  onMounted(() => {
    console.log(props.payload.commonAreas, 'common areas')
    if (props?.payload && Array.isArray(props?.payload?.commonAreas?.value)) {
      commonAreas.value = props?.payload?.commonAreas?.value // Assign the array directly
    }
  })
  
  // ImageUpload Component Logic
  const fileInput = ref<HTMLInputElement | null>(null)
  const images = reactive<{ [key: string]: string[] }>({
    'Bedroom': [],
    'Bathroom/Restroom': [],
    // Add more sections as needed
  })
  const currentImageIndex = ref<{ [key: string]: number }>({
    'Bedroom': 0,
    'Bathroom/Restroom': 0,
    // Add more sections as needed
  })
  
  function triggerFileUpload(section: string) {
    if (fileInput.value) {
      fileInput.value.click()
    }
  }
  
  function handleFileUpload(event: Event, section: string) {
    const target = event.target as HTMLInputElement
    if (target.files) {
      for (const file of Array.from(target.files)) {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            images[section].push(e.target.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }
  
  function prevImage(section: string) {
    if (currentImageIndex.value[section] > 0) {
      currentImageIndex.value[section]--
    }
  }
  
  function nextImage(section: string) {
    if (currentImageIndex.value[section] < images[section].length - 1) {
      currentImageIndex.value[section]++
    }
  }
  
  function removeImage(section: string) {
    images[section].splice(currentImageIndex.value[section], 1)
    if (currentImageIndex.value[section] >= images[section].length) {
      currentImageIndex.value[section] = images[section].length - 1
    }
  }
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  