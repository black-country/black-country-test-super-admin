// composables/usePdfExtractor.ts
import { ref } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

export function usePdfExtractor() {
  const extractedText = ref<string | null>(null);
  const loading = ref(false);

  const extractTextFromPDF = async (file: File) => {
    try {
      loading.value = true;

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = async (event) => {
        if (event.target?.result) {
          const pdfData = new Uint8Array(event.target.result as ArrayBuffer);
          const pdfDocument = await pdfjsLib.getDocument(pdfData).promise;
          let textContent = '';

          for (let i = 1; i <= pdfDocument.numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const text = await page.getTextContent();
            const pageText = text.items.map((item: any) => item.str).join(' ');
            textContent += pageText + '\n';
          }

          extractedText.value = textContent;
        }
      };
    } catch (error) {
      console.error('Error extracting text:', error);
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
