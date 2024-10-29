<!-- components/PdfUploader.vue -->
<template>
  <div>
    <h1>Upload a PDF and Extract Text</h1>
    <input type="file" accept="application/pdf" @change="handleFileUpload" />
    <div v-if="loading">Extracting text, please wait...</div>
    <pre v-else>{{ extractedText }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { usePdfExtractor } from '@/composables/usePdfExtractor';

const { extractedText, loading, extractTextFromPDF } = usePdfExtractor();

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && file.type === 'application/pdf') {
    extractTextFromPDF(file);
  } else {
    alert('Please upload a PDF file.');
  }
};
</script>
