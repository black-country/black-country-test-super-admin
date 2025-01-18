<template>
    <div v-if="!fetching" class="w-full pb-10">
      <h2 class="text-lg font-medium my-4 lg:mb-4">Compose the policy content</h2>
    <!-- {{ policyObj.content }} -->
      <!-- {{ policyObj }} -->
      <div class="pb-4">
        <label class="block text-sm text-gray-700 mb-2">
          Brief Description
        </label>
        <textarea
          v-model="description"
          placeholder="Enter message"
          rows="6"
          class="w-full p-4 bg-[#F0F2F5] border-[0.5px] outline-none border-gray-100 text-sm rounded-lg"
        ></textarea>
      </div>
  
      <div class="mb-8">
        <label class="block text-sm text-gray-700 mb-2">
          Policy content
        </label>
        <QuillEditor
          v-model:content="content"
          :options="editorOptions"
          contentType="html"
          theme="snow"
          toolbar="full"
          class="bg-gray-50/50 rounded-md border border-gray-200"
        />
      </div>
  
      <div class="border-t border-[#E4E7EC] bg-white flex justify-between px-8 md:px-32 items-center space-x-4 p-4 fixed bottom-0 left-0 w-full">
        <button
           @click="handleBack"
          class="px-6 py-2.5 border border-[#D0D5DD] rounded-lg text-[#344054] hover:bg-[#F9FAFB]"
        >
        Cancel
        </button>
        <button
         @click="handleSubmit"
          :disabled="!content || updating"
          class="px-6 py-2.5 rounded-lg bg-[#101828] text-white disabled:opacity-25 disabled:cursor-not-allowed"
          :class="content ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400'"
        >
        {{ updating ? 'processing' : 'Submit' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import { QuillEditor } from '@vueup/vue-quill';
  import { useUpdatePolicy } from '@/composables/modules/settings/useUpdatePolicy'
  const { updatePolicy, setUpdatedPayload, loading: updating, updatedPayload } = useUpdatePolicy()
  // import { useFetchPolicyById } from '@/composables/modules/settings/useFetchPolicyById';
  
  // const { loading: fetching, policyObj } = useFetchPolicyById();
  
  const content = ref('');
  const description = ref('');

  const props = defineProps({
    policyObj: {
      type: Object,
      required: true,
    },
  });
  
  const editorOptions = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ header: [1, 2, false] }],
        ['link'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean']
      ]
    },
    placeholder: 'Enter message'
  };
  
  const emit = defineEmits(['back', 'submit']);
  
  function handleBack() {
    emit('back');
  }
  
  function handleSubmit() {
    if (content.value) {
      emit('submit', { content: content.value, description: description.value });
    }
  }
  
  // Populate form on component mount
onMounted(() => {
  if (props.policyObj) {
    content.value = props.policyObj.content || '';
    description.value = props.policyObj.description || '';
  }
});

  // onMounted(() => {
  //   if (policyObj.value) {
  //     content.value = policyObj.value.content || '';
  //     description.value = policyObj.value.description || '';
  //   }
  // });
  
// Watch for changes in policyObj and update form reactively
// watch(
//   () => policyObj.value,
//   (newPolicy) => {
//     if (newPolicy) {
//       content.value = newPolicy.content || '';
//       description.value = newPolicy.description || '';
//     }
//   },
//   { immediate: true } // Run the watcher immediately
// );
// Watch for changes in policyObj and update form reactively
watch(
  () => props.policyObj,
  (newPolicy) => {
    if (newPolicy) {
      content.value = newPolicy.content || '';
      description.value = newPolicy.description || '';
    }
  },
  { immediate: true } // Run the watcher immediately
);
  </script>
  
  <style scoped>
  /* Add custom styles if needed */
  </style>
  