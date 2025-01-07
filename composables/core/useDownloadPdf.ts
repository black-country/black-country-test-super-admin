import { ref, unref } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useCustomToast } from '@/composables/core/useCustomToast';
const { showToast } = useCustomToast();

/**
 * Ensures all images inside the given element are loaded.
 * @param {HTMLElement} element - The element containing the images.
 * @returns {Promise<void>}
 */
const ensureImagesLoaded = (element: HTMLElement): Promise<void> => {
  const imgElements = Array.from(element.querySelectorAll('img'));
  const imgPromises = imgElements.map((img) => {
    return new Promise<void>((resolve, reject) => {
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
      }
    });
  });
  return Promise.all(imgPromises).then(() => undefined);
};

/**
 * Composable to download an HTML element as a PDF with loading state.
 */
export function useDownloadPdf() {
  const isDownloading = ref(false); // Loading state

  /**
   * downloadPdf
   * @param {HTMLElement | Vue.Ref} elementRef - The DOM element or ref to convert to PDF
   * @param {string} fileName - The name of the downloaded PDF file
   * @param {string} orientation - Page orientation, 'p' for portrait and 'l' for landscape (default: 'p')
   * @param {string} pageSize - Page size, e.g., 'a4', letter (default: 'a4')
   */
  const downloadPdf = async (
    elementRef: HTMLElement | Vue.Ref<HTMLElement | null>,
    fileName: string = 'document',
    orientation: 'p' | 'l' = 'p',
    pageSize: 'a4' | 'a3' | 'a5' | 'letter' | 'legal' = 'a4'
  ) => {
    isDownloading.value = true; // Set loading to true at the start

    try {
      // Unwrap the ref if it's a Vue ref
      const element = unref(elementRef);
      if (!element || !(element instanceof HTMLElement)) {
        showToast({
          title: "Error",
          message: "Element not found for PDF generation",
          toastType: "error",
          duration: 3000,
        });
        return;
      }

      // Ensure all images are loaded
      await ensureImagesLoaded(element);

      // Use html2canvas with useCORS option enabled to capture the element as an image
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: false,
      });

      const imgData = canvas.toDataURL('image/png');

      // Create a new jsPDF instance
      const doc = new jsPDF(orientation, 'mm', pageSize);

      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If content height exceeds the page height, we split the content into multiple pages
      const pageHeight = doc.internal.pageSize.getHeight();
      let heightLeft = pdfHeight;
      let position = 0;

      // Add the first page
      doc.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // While there's still content to add, create new pages
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight; // Move to the next page position
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }

      // Save the generated PDF
      doc.save(`${fileName}.pdf`);

      showToast({
        title: "Success",
        message: `${fileName}.pdf has been downloaded successfully.`,
        toastType: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error(error); // Log the actual error
      showToast({
        title: "Error",
        message: "Error generating PDF",
        toastType: "error",
        duration: 3000,
      });
    } finally {
      isDownloading.value = false; // Set loading to false after the process
    }
  };

  return { downloadPdf, isDownloading };
}
