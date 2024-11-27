<script setup lang="ts">
  import { VPdfViewer } from '@vue-pdf-viewer/viewer';
</script>

<template>
  <div :style="{ width: '1028px', height: '700px'}">
    <VPdfViewer src="https://res.cloudinary.com/demo/image/multi/topic.pdf" />
  </div>
</template>