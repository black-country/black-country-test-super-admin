import { ref, unref } from 'vue';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useCustomToast } from '@/composables/core/useCustomToast';

const { showToast } = useCustomToast();

interface PDFOptions {
  fileName?: string;
  orientation?: 'p' | 'l';
  pageSize?: 'a4' | 'a3' | 'a5' | 'letter' | 'legal';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  scaling?: number;
}

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
 * Creates a temporary container for the HTML content
 * @param {string} htmlContent - The HTML content to process
 * @returns {HTMLElement} The temporary container element
 */
const createTempContainer = (htmlContent: string): HTMLElement => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '794px'; // A4 width in pixels at 96 DPI
  container.style.maxWidth = '794px';
  container.innerHTML = htmlContent;
  
  // Apply base styles for better PDF rendering
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.lineHeight = '1.6';
  container.style.color = '#333';
  
  // Add custom styles for different elements
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    h1, h2, h3, h4, h5, h6 { margin-bottom: 1rem; color: #333; }
    p { margin-bottom: 1rem; color: #555; }
    ul, ol { margin-bottom: 1rem; padding-left: 2rem; }
    img { max-width: 100%; height: auto; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    a { color: #0066cc; text-decoration: none; }
  `;
  container.appendChild(styleElement);
  
  document.body.appendChild(container);
  return container;
};

/**
 * Composable to convert HTML content to PDF and download it
 */
export function useHtmlToPdf() {
  const isDownloading = ref(false);

  /**
   * Convert HTML content to PDF and download it
   * @param {string} htmlContent - The HTML content to convert
   * @param {PDFOptions} options - PDF generation options
   */
  const downloadHtmlAsPdf = async (
    htmlContent: string,
    options: PDFOptions = {}
  ) => {
    const {
      fileName = 'document',
      orientation = 'p',
      pageSize = 'a4',
      margins = { top: 10, right: 10, bottom: 10, left: 10 },
      scaling = 2
    } = options;

    isDownloading.value = true;

    try {
      // Create temporary container
      const container = createTempContainer(htmlContent);

      // Ensure all images are loaded
      await ensureImagesLoaded(container);

      // Generate PDF
      const canvas = await html2canvas(container, {
        scale: scaling,
        useCORS: true,
        allowTaint: false,
        logging: false,
        windowWidth: container.scrollWidth
      });

      // Remove temporary container
      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF(orientation, 'mm', pageSize);

      // Calculate dimensions
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth() - (margins.left + margins.right);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const pageHeight = doc.internal.pageSize.getHeight() - (margins.top + margins.bottom);

      // Handle multi-page content
      let heightLeft = pdfHeight;
      let position = margins.top;
      let page = 1;

      // Add first page
      doc.addImage(
        imgData,
        'PNG',
        margins.left,
        position,
        pdfWidth,
        pdfHeight
      );

      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - pdfHeight + margins.top;
        doc.addPage();
        doc.addImage(
          imgData,
          'PNG',
          margins.left,
          position,
          pdfWidth,
          pdfHeight
        );
        heightLeft -= pageHeight;
        page++;
      }

      // Save the PDF
      doc.save(`${fileName}.pdf`);

      showToast({
        title: "Success",
        message: `${fileName}.pdf has been downloaded successfully.`,
        toastType: "success",
        duration: 3000,
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      showToast({
        title: "Error",
        message: "Error generating PDF. Please try again.",
        toastType: "error",
        duration: 3000,
      });
    } finally {
      isDownloading.value = false;
    }
  };

  return {
    downloadHtmlAsPdf,
    isDownloading
  };
}