<!-- <template>
    <div class="w-full">
      <h2 class="text-lg font-medium my-4 lg:mb-4">Compose the policy content</h2>
      {{formData}}

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
          :disabled="!content || loading"
          class="px-6 py-2.5 rounded-lg bg-[#101828] text-white disabled:opacity-25 disabled:cursor-not-allowed"
          :class="content ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400'"
        >
        {{ loading ? 'processing' : 'Submit' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { QuillEditor } from '@vueup/vue-quill'

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
    },
  })
  
  const content = ref('')
  const description = ref('')
  
  const editorOptions = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'header': [1, 2, false] }],
        ['link'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ]
    },
    placeholder: 'Enter message'
  }
  
  const emit = defineEmits(['back', 'submit'])
  
  function handleBack() {
    emit('back')
  }
  
  function handleSubmit() {
    if (content.value) {
      emit('submit', { content: content.value, description: description.value})
    }
  }

  onMounted(() => {
    // Object.assign(form, props.formData);
    content.value = props.formData.content
    description.value = props.formData.description
  });


  watch(
    () => props.formData,
    (newFormData) => {
      content.value = newFormData.content
      description.value = newFormData.description
      // Object.assign(form, newFormData);
    }
  );


  </script> -->


  <template>
    <div class="w-full">
      <h2 class="text-lg font-medium my-4 lg:mb-4">Compose the policy content</h2>
      <!-- {{formData}} -->

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
          :disabled="!content || loading"
          class="px-6 py-2.5 rounded-lg bg-[#101828] text-white disabled:opacity-25 disabled:cursor-not-allowed"
          :class="content ? 'bg-gray-900 text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-400'"
        >
        {{ loading ? 'processing' : 'Submit' }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import { QuillEditor } from '@vueup/vue-quill';

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      required: true,
    },
  });
  
  const content = ref('');
  const description = ref('');
  
  const editorOptions = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'header': [1, 2, false] }],
        ['link'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
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

  onMounted(() => {
    const localPolicy = localStorage.getItem('selected-policy');
    if (localPolicy) {
      const parsedPolicy = JSON.parse(localPolicy);
      content.value = parsedPolicy.content || '';
      description.value = parsedPolicy.description || '';
    } else {
      content.value = props.formData.content || '';
      description.value = props.formData.description || '';
    }
  });

  watch(
    () => props.formData,
    (newFormData) => {
      content.value = newFormData.content || '';
      description.value = newFormData.description || '';
    }
  );

  watch(
    () => localStorage.getItem('selected-policy'),
    (newLocalPolicy) => {
      if (newLocalPolicy) {
        const parsedPolicy = JSON.parse(newLocalPolicy);
        content.value = parsedPolicy.content || '';
        description.value = parsedPolicy.description || '';
      }
    }
  );
  </script>

  <style scoped>
  /* Add custom styles if needed */
  </style>
