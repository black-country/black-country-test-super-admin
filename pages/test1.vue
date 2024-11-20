<template>
    <div>
      <input type="file" accept="application/pdf" @change="handleFileUpload" class="mb-4 p-2 border rounded" />
      <div ref="viewerDiv" style="height: 800px; width: 100%; border: 1px solid #ddd;"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import WebViewer from '@pdftron/webviewer'
  
  const viewerDiv = ref<HTMLElement | null>(null)
  const viewerInstance = ref<any>(null)
  
  onMounted(() => {
    if (viewerDiv.value) {
      WebViewer(
        {
          path: '/webviewer/lib', // Path to the WebViewer assets
        },
        viewerDiv.value
      )
        .then((instance) => {
          viewerInstance.value = instance
          console.log('WebViewer initialized:', instance)
        })
        .catch((err: Error) => {
          console.error('Error initializing WebViewer:', err)
        })
    } else {
      console.error('Viewer container not found.')
    }
  })
  
  const handleFileUpload = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
  
    if (!file) {
      console.error('No file selected.')
      return
    }
  
    if (!viewerInstance.value) {
      console.error('Viewer instance is not initialized yet.')
      return
    }
  
    console.log('File uploaded:', file)
  
    const reader = new FileReader()
  
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      console.log('ArrayBuffer:', arrayBuffer)
  
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
  
      console.log('Blob URL:', url)
  
      viewerInstance.value
        .loadDocument(url)
        .then(() => console.log('PDF loaded successfully!'))
        .catch((err: Error) => console.error('Error loading PDF:', err))
    }
  
    reader.onerror = (err) => {
      console.error('Error reading file:', err)
    }
  
    reader.readAsArrayBuffer(file)
  }
  </script>
  