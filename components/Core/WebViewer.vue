<template>
  <div>
    <div class="bg-gray-100">
      <div class="flex flex-wrap justify-between items-center bg-white border p-4 shadow px-3 lg:px-10">
        <div class="flex items-center space-x-4">
          <button @click="router.back()"
            class="flex items-center text-gray-600 bg-gray-100 text-sm py-2 px-4 rounded-md hover:bg-gray-200 hover:text-black">
            <span>&larr;</span>
            <span class="ml-2">Back</span>
          </button>
          <h1 class="text-lg font-semibold">{{ payload?.documentName }}</h1>
        </div>
        <button
          class="flex items-center px-4 text-sm py-2.5 text-sm bg-blue-500 text-white text-sm font-medium gap-x-3 rounded-md shadow-md cursor-pointer hover:bg-blue-600"
          v-if="isDocumentEdited" @click="submitLeaseDocument">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 17l5-5-5-5" />
            <path d="M13.8 12H3m9 10a10 10 0 1 0 0-20" />
          </svg>
           {{  uploading ? 'processing' : 'Submit Lease' }}
        </button>
        <label
          class="flex items-center px-4 text-sm py-2.5 text-sm bg-blue-500 text-white text-sm font-medium gap-x-3 rounded-md shadow-md cursor-pointer hover:bg-blue-600">
          <input type="file" class="hidden" @change="handleFileUpload" accept="application/pdf" />
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path
              d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21" />
            <path d="M16 16l-4-4-4 4" />
          </svg>
          Upload Lease
        </label>
      </div>
    </div>
    <div id="webViewer" ref="viewerDiv"></div>
    <p v-if="submissionMessage">{{ submissionMessage }}</p>
    <CoreFullScreenLoader :visible="uploading || assigning" text="Processing lease agreement" logo="/path-to-your-logo.png" />
  </div>
</template>


<script>
import { useUploadFile } from '@/composables/core/pdfUpload'
import { ref, onMounted } from "vue";
import WebViewer from "@pdftron/webviewer";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"; // Use legacy build for better compatibility

export default {
  name: "LeaseDocument",
  setup() {
    const viewerDiv = ref(null);
    const instance = ref(null);
    const isDocumentEdited = ref(false);
    const submissionMessage = ref("");
    const { pdfUploadFile, uploadResponse, loading: uploading, processing: assigning } =  useUploadFile()

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const fileBlob = new Blob([fileReader.result], { type: "application/pdf" });

          // Load the uploaded PDF blob into the WebViewer
          instance.value.loadDocument(fileBlob, { extension: "pdf" });
        };
        fileReader.readAsArrayBuffer(file);
      }
    };


const submitLeaseDocument = async () => {
  if (!instance.value) return

  try {
    const docViewer = instance.value.getDocument()
    const annotManager = instance.value.getAnnotationManager()
    const xfdfString = await annotManager.exportAnnotations()

    // Get the edited PDF file as Uint8Array with annotations
    const fileData = await docViewer.getFileData({
      xfdfString,
      downloadType: 'pdf'
    })

    // Convert Uint8Array to File object
    const pdfBlob = new Blob([fileData], { type: 'application/pdf' })
    const pdfFile = new File([pdfBlob], 'edited-lease.pdf', {
      type: 'application/pdf',
      lastModified: Date.now()
    })

    // Upload the file using our composable
    const { url, error } = await pdfUploadFile(pdfFile)

    if (error) {
      console.error('Upload failed:', error)
    } else if (url) {
      console.log('File uploaded successfully:', url)
    }
  } catch (error) {
    console.error('Error processing document:', error)
    uploadError.value = error instanceof Error ? error.message : 'An unexpected error occurred'
  }
}


/**
 * Converts a PDF file (Blob) into an image (first page).
 * @param {Blob} pdfBlob - PDF file as a Blob.
 * @returns {Promise<File>} - Image file (PNG) converted from the first PDF page.
 */
const convertPdfToImage = async (pdfBlob) => {
  // Configure the worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  // Load the PDF
  const pdf = await pdfjsLib.getDocument({ data: await pdfBlob.arrayBuffer() }).promise;

  // Render the first page
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 }); // Adjust scale for better resolution

  // Create a canvas to draw the PDF page
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;

  // Convert canvas to Blob
  const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));

  // Convert Blob to File
  return new File([imageBlob], "converted-image.png", { type: "image/png" });
};


    onMounted(() => {
      const path = "/webviewer";
      WebViewer({ path }, viewerDiv.value).then((webviewerInstance) => {
        instance.value = webviewerInstance.Core.documentViewer;

        // Listen for annotation changes to track edits
        const annotManager = webviewerInstance.Core.annotationManager;
        annotManager.addEventListener("annotationChanged", () => {
          isDocumentEdited.value = true; // Enable the submit button when edits are detected
        });
      });
    });

    return { viewerDiv, handleFileUpload, submitLeaseDocument, isDocumentEdited, submissionMessage };
  },
};
</script>

<style>
#webViewer {
  height: 100vh;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

p {
  margin-top: 10px;
  font-size: 14px;
  color: green;
}
</style>
