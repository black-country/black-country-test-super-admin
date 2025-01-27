<script setup>
import { VPdfViewer } from '@vue-pdf-viewer/viewer'
</script>
<template>
  <div :style="{ width: '1028px', height: '700px' }">
    <VPdfViewer
      src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
    />
    <!-- https://blackcountrystorage.blob.core.windows.net/blackcountry-dev/documents/1737747548792-edited-lease.pdf -->
  </div>
</template>