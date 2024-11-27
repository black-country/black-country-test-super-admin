<!--<template>-->
<!--    <div>-->
<!--      <div id="webViewer" ref="viewerDiv" style="height: 800px; width: 100%; border: 1px solid #ddd;"></div>-->
<!--    </div>-->
<!--  </template>-->
<!--  -->
<!--  <script setup lang="ts">-->
<!--  import { ref, onMounted } from 'vue';-->
<!--  import WebViewer from '@pdftron/webviewer';-->
<!--  -->
<!--  const viewerDiv = ref<HTMLElement | null>(null);-->
<!--  const viewerInstance = ref<any>(null);-->
<!--  -->
<!--  onMounted(() => {-->
<!--    if (viewerDiv.value) {-->
<!--      WebViewer(-->
<!--        {-->
<!--          path: '/webviewer', // Ensure this points to the correct WebViewer assets folder-->
<!--        },-->
<!--        viewerDiv.value-->
<!--      )-->
<!--        .then((instance) => {-->
<!--          viewerInstance.value = instance;-->
<!--          console.log('WebViewer initialized:', instance);-->
<!--  -->
<!--          // Load the PDF URL into the WebViewer-->
<!--          const pdfUrl = 'https://res.cloudinary.com/demo/image/multi/topic.pdf';-->
<!--          viewerInstance.value-->
<!--            .loadDocument(pdfUrl)-->
<!--            .then(() => console.log('PDF loaded successfully!'))-->
<!--            .catch((err: Error) => console.error('Error loading PDF:', err));-->
<!--        })-->
<!--        .catch((err: Error) => {-->
<!--          console.error('Error initializing WebViewer:', err);-->
<!--        });-->
<!--    } else {-->
<!--      console.error('Viewer container not found.');-->
<!--    }-->
<!--  });-->
<!--  </script>-->
<!-- -->
<!--<template>-->
<!--<main>-->
<!--  <CoreWebViewer initial-doc="https://pdfobject.com/pdf/sample.pdf" />-->
<!--</main>-->
<!--</template>-->

<template>
  <main>
    <CoreWebViewer />
  </main>
</template>
