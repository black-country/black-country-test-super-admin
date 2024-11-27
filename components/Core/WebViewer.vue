<template>
  <div>
    <div class="bg-gray-100">
  <!-- Header with back button and template title -->
  <div class="flex flex-wrap justify-between items-center bg-white p-4 shadow px-3 lg:px-10">
    <!-- Back button and title -->
    <div class="flex items-center space-x-4">
      <button
        @click="router.back()"
        class="flex items-center text-gray-600 bg-gray-100 text-sm py-2 px-4 rounded-md hover:bg-gray-200 hover:text-black"
      >
        <span>&larr;</span>
        <span class="ml-2">Back</span>
      </button>
      <h1 class="text-lg font-semibold">{{ payload?.documentName }}</h1>
    </div>
    <!-- Styled file input -->
    <button class="flex items-center px-4 text-sm py-3 text-sm bg-blue-500 text-white text-sm font-medium gap-x-3 rounded-md shadow-md cursor-pointer hover:bg-blue-600" v-if="isDocumentEdited" @click="submitLeaseDocument">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17l5-5-5-5"/><path d="M13.8 12H3m9 10a10 10 0 1 0 0-20"/></svg>
      Submit Lease
    </button>
    <label class="flex items-center px-4 text-sm py-3 text-sm bg-blue-500 text-white text-sm font-medium gap-x-3 rounded-md shadow-md cursor-pointer hover:bg-blue-600">
      <input
        type="file"
        class="hidden"
        @change="handleFileUpload"
        accept="application/pdf"
      />
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21"/><path d="M16 16l-4-4-4 4"/></svg>
      Upload Lease
    </label>
  </div>
</div>


    <!-- PDF Viewer -->
    <div id="webViewer" ref="viewerDiv"></div>

    <!-- Submit Button -->


    <!-- Feedback -->
    <p v-if="submissionMessage">{{ submissionMessage }}</p>
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import WebViewer from "@pdftron/webviewer";
import { useFetch } from "#app";
import { useCreateLeaseTemplate } from '@/composables/modules/lease/create'
const {  createLeaseTemplate, loading, payload, setPayloadObj } = useCreateLeaseTemplate()

export default {
  name: "LeaseDocument",
  setup() {
    const viewerDiv = ref(null);
    const instance = ref(null);
    const isDocumentEdited = ref(false);
    const submissionMessage = ref("");

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
      if (instance.value) {
        try {
          const docViewer = instance.value.getDocument();
          const xfdfString = await instance.value.getAnnotationManager().exportAnnotations();

          // Use the xfdfString to include annotations
          const options = {
            xfdfString,
          };

          const fileData = await docViewer.getFileData(options); // This returns a Uint8Array
          const blob = new Blob([fileData], { type: "application/pdf" });

          // Convert Blob to FormData
          const formData = new FormData();
          formData.append("file", blob);

          // Use Nuxt's `useFetch` to send the form data to the server
          const { data, error } = await useFetch("/api/upload", {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (error.value) {
            submissionMessage.value = "Error submitting document. Please try again.";
            console.error("Submission Error:", error.value);
          } else {
            submissionMessage.value = "Document submitted successfully!";
            console.log("Server Response:", data.value);
          }
        } catch (error) {
          console.error("Error submitting document:", error);
          submissionMessage.value = "An unexpected error occurred.";
        }
      }
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
