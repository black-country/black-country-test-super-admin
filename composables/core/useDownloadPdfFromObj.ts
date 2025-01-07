import { ref } from 'vue';
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
 * Composable to download dynamically generated PDF content with loading state and iframe handling.
 */
export function useDownloadPdf() {
  const isDownloading = ref(false); // Loading state

  /**
   * downloadPdf
   * @param {string} leaseAgreementContent - The lease agreement HTML content
   * @param {object} leaseData - Contains information about the landlord, tenant, signatures, and dates
   * @param {string} fileName - The name of the downloaded PDF file
   * @param {string} orientation - Page orientation, 'p' for portrait and 'l' for landscape (default: 'p')
   * @param {string} pageSize - Page size, e.g., 'a4', 'letter' (default: 'a4')
   */
  const downloadPdf = async (
    leaseAgreementContent: string,
    leaseData: {
      houseOwnerSigneeName: string;
      signeeName: string;
      signedAt: string;
      houseOwnerSignatureUrl: string;
      tenantSignatureUrl: string;
    },
    fileName: string = 'lease-agreement',
    orientation: 'p' | 'l' = 'p',
    pageSize: 'a4' | 'a3' | 'a5' | 'letter' | 'legal' = 'a4'
  ) => {
    isDownloading.value = true; // Set loading state to true at the start

    try {
      // Dynamically create a div element and set the lease content HTML
      const leaseContentDiv = document.createElement('div');
      leaseContentDiv.innerHTML = leaseAgreementContent;

      // Append landlord, tenant names, and signatures to the lease content
      const signatureSection = `
        <div style="margin-top: 40px;">
          <h3>Signature</h3>
          <p>The parties hereto have executed this Lease Agreement as of the date first above written.</p>

          <div style="margin-bottom: 20px;">
            <h4>Landlord/Property Manager:</h4>
            <p>Full Name: ${leaseData.houseOwnerSigneeName}</p>
            <img src="${leaseData.houseOwnerSignatureUrl}" alt="Landlord Signature" style="width: 200px; height: 60px;"/>
            <p>Date: ${new Date(leaseData.signedAt).toLocaleDateString()}</p>
          </div>

          <div>
            <h4>Tenant:</h4>
            <p>Full Name: ${leaseData.signeeName}</p>
            <img src="${leaseData.tenantSignatureUrl}" alt="Tenant Signature" style="width: 200px; height: 60px;"/>
            <p>Date: ${new Date(leaseData.signedAt).toLocaleDateString()}</p>
          </div>
        </div>
      `;

      // Append the signature section dynamically
      leaseContentDiv.innerHTML += signatureSection;

      // Ensure all images are loaded
      await ensureImagesLoaded(leaseContentDiv);

      // Use html2canvas with useCORS option enabled to capture the element as an image
      const canvas = await html2canvas(leaseContentDiv, {
        useCORS: true,
        allowTaint: false,
        ignoreElements: function (element) {
          // Ignore iframes to avoid cross-origin issues
          return element.tagName === 'IFRAME';
        }
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
        title: 'Success',
        message: `${fileName}.pdf has been downloaded successfully.`,
        toastType: 'success',
        duration: 3000,
      });
    } catch (error) {
      showToast({
        title: 'Error',
        message: 'Error generating PDF',
        toastType: 'error',
        duration: 3000,
      });
    } finally {
      isDownloading.value = false; // Set loading state to false after the process
    }
  };

  return { downloadPdf, isDownloading };
}
