// composables/usePdfExtractor.ts
import { ref } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export function usePdfExtractor() {
  const extractedText = ref<string | null>(null);
  const loading = ref(false);

  const extractTextFromPDF = async (file: File) => {
    loading.value = true;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = new Uint8Array(arrayBuffer);
      const pdfDocument = await pdfjsLib.getDocument(pdfData).promise;
      let textContent = '';

      // Loop through each page of the PDF
      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const text = await page.getTextContent();
        const pageText = text.items.map((item: any) => item.str).join(' ');
        textContent += pageText + '\n';
      }

      extractedText.value = textContent;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    extractedText,
    loading,
    extractTextFromPDF,
  };
}
