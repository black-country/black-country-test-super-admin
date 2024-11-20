<template>
    <div class="pdf-container flex flex-col items-center space-y-4">
      <!-- PDF Upload Input -->
      <input
        type="file"
        accept="application/pdf"
        @change="handleFileUpload"
        class="border border-gray-300 rounded-md p-2"
      />
  
      <!-- PDF Rendering Area -->
      <div v-if="pdfPages.length > 0" class="pdf-pages w-full max-w-4xl">
        <canvas
          v-for="(page, index) in pdfPages"
          :key="index"
          ref="canvasRefs"
          class="mb-4 shadow-lg"
        ></canvas>
      </div>
      <p v-else>No PDF loaded. Upload a file to view it.</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useNuxtApp } from '#app'
  
  const pdfPages = ref<HTMLCanvasElement[]>([])
  const canvasRefs = ref<HTMLCanvasElement[]>([])
  
  const { $pdfjs } = useNuxtApp()
  
  const handleFileUpload = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
  
    if (file) {
      const fileReader = new FileReader()
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer)
        await renderPdf(typedArray)
      }
      fileReader.readAsArrayBuffer(file)
    }
  }
  
  const renderPdf = async (typedArray: Uint8Array) => {
    const pdfDoc = await $pdfjs.getDocument({ data: typedArray }).promise
    const numPages = pdfDoc.numPages
  
    pdfPages.value = []
  
    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDoc.getPage(i)
      const viewport = page.getViewport({ scale: 1.5 })
  
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d') as CanvasRenderingContext2D
      canvas.height = viewport.height
      canvas.width = viewport.width
  
      const renderTask = page.render({ canvasContext: context, viewport })
      await renderTask.promise
  
      pdfPages.value.push(canvas)
    }
  }
  </script>
  
  <style scoped>
  .pdf-container {
    @apply mx-auto mt-8;
  }
  </style>
  