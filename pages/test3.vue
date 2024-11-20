<script setup lang="ts">
import { ref } from 'vue'
import { PDFDocument } from 'pdf-lib'

const pdfContent = ref<string | null>(null)

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfDoc.getPages()
    pdfContent.value = pages.map((page) => page.getTextContent()).join('\n')
  }
}
</script>

<template>
  <div>
    <input type="file" accept="application/pdf" @change="handleFileUpload" />
    <pre v-if="pdfContent">{{ pdfContent }}</pre>
  </div>
</template>
