<template>
    <div class="w-full h-full flex justify-center items-center">
      <!-- Static PDF Example -->
      <iframe 
        src="`/pdf-viewer/viewer.html?file=test.pdf`" 
        class="w-full h-[660px]"
        allowfullscreen 
        webkitallowfullscreen                                                        
      ></iframe>
      
      <!-- Dynamic PDF Example -->
      <!-- <iframe 
        v-else
        :src="`/pdf-viewer/viewer.html?file=${pdfUrl}`" 
        class="w-full h-[660px]"
        allowfullscreen 
        webkitallowfullscreen
      ></iframe> -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  // URL for the static PDF
  const staticPdfUrl = '/sample-pdf.pdf';
  
  // Boolean to switch between static and dynamic PDFs
  const isStatic = ref(true);
  
  // URL for dynamic PDF
  const pdfUrl = ref('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  
  // Toggle between static and dynamic PDF for testing
//   const togglePdfType = () => {
//     isStatic.value = !isStatic.value;
//   };
  </script>
  
  <style scoped>
  /* Add additional styles if needed */
  </style>
  