<template>
  <main>
    <div class="container mx-auto space-y-2 mb-4 lg:mb-0">
      <!-- <p class="text-[#1D2739] font-medium text-sm">
        Can you provide references from previous landlords or property managers?
      </p> -->
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="bg-white py-1 relative space-y-4"
      >
        <!-- Short Response -->
        <section>
          <p class="text-sm text-[#1D2739] font-medium py-0 my-0">Enter your question</p>
          <div v-if="question.widgetType === 'input'" class="relative mt-2">
            <input
              v-model="question.question"
              placeholder="Enter your question"
              class="w-full text-sm bg-[#F0F2F5] font-medium py-3.5 outline-none border-[0.5px] mb-4 p-2 border-[#E4E7EC] rounded-md"
            />
          </div>

          <!-- Long Response -->
          <div
            v-else-if="question.widgetType === 'long-response'"
            class="relative mt-2"
          >
            <input
              v-model="question.question"
              placeholder="Enter your question"
              class="w-full text-sm bg-[#F0F2F5] font-medium py-3.5 outline-none border-[0.5px] mb-4 p-2 border-[#E4E7EC] rounded-md"
              type="text"
            />
            <!-- <p class="text-xs text-gray-400">This is a long response type.</p> -->
          </div>

          <!-- Dropdown (Single select) -->
          <div
            v-else-if="question.widgetType === 'select'"
            class="relative mt-2"
          >
            <input
              v-model="question.question"
              placeholder="Enter your question"
              class="w-full text-sm bg-[#F0F2F5] font-medium py-3.5 outline-none border-[0.5px] mb-4 p-2 border-[#E4E7EC] rounded-md"
            />
            <div
              v-for="(option, optIndex) in question.widgetOptions"
              :key="optIndex"
              class="mt-2 flex items-center"
            >
              <input
                v-model="question.widgetOptions[optIndex]"
                placeholder="Option"
                class="w-full text-sm bg-[#F0F2F5] font-medium py-3.5 outline-none border-[0.5px] mb-4 p-2 border-[#E4E7EC] rounded-md"
              />
              <button
                @click="removeOption(index, optIndex)"
                class="text-red-500 ml-2"
              >
                Remove
              </button>
            </div>
            <button
              @click="addOption(index)"
              class="text-[#1D2739] flex items-center gap-x-2 border-[0.5px] px-3 py-2 rounded-md text-sm"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2V10"
                  stroke="#1D2739"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M2 6H10"
                  stroke="#1D2739"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Add option
            </button>
          </div>
        </section>
                <!-- Question Title -->
                <section>
                  <p class="text-sm lg:-mt-5 text-[#1D2739] font-medium">select response type</p>
        
                  <!-- Question Type Selector -->
                  <div
                    id="dropdown"
                    class="relative cursor-pointer border-[0.5px] rounded-lg w-full bg-[#F0F2F5] mt-2"
                  >
                    <select
                      v-model="question.widgetType"
                      class="w-full text-sm py-3 bg-[#F0F2F5] font-medium border-[#E4E7EC] outline-none px-2"
                    >
                      <option value="input">Short response</option>
                      <option value="long-response">Long response</option>
                      <option value="select">Dropdown (single select)</option>
                    </select>
                  </div>
                </section>
      </div>

      <!-- Button to Add New Question -->
      <button
        @click="addQuestion"
        class="text-[#1D2739] flex items-center gap-x-2 border-[0.5px] px-3 py-2 rounded-md text-sm mt-4"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 2V10"
            stroke="#1D2739"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2 6H10"
            stroke="#1D2739"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Add question
      </button>
    </div>

    <slot name="action-buttons"></slot>
  </main>
</template>

<!-- <script setup lang="ts">
import { use_create_property } from '@/composables/modules/property/create'
const {  payload} = use_create_property()

interface Question {
  question: string;
  widgetType: string;
  widgetOptions: string[] | null;
  metadata: any;
}

const props = defineProps({
  payload: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits<{
  (event: 'updateQuestions', questions: Question[]): void;
}>();

const questions = ref<Question[]>([
  { question: '', widgetType: 'input', widgetOptions: null, metadata: {} },
]);

// Watch questions and emit to parent component whenever they change
watch(questions, (newQuestions: any) => {
  // props.payload.questions.value = newQuestions
  console.log(newQuestions, 'Question here')
  props.payload.questions.value = newQuestions
  emit('updateQuestions', newQuestions);
}, { deep: true });

function addQuestion() {
  questions.value.push({ question: '', widgetType: 'input', widgetOptions: null, metadata: {} });
}

function addOption(index: number) {
  if (!questions.value[index].widgetOptions) {
    questions.value[index].widgetOptions = [];
  }
  questions.value[index].widgetOptions.push('');
}

function removeOption(questionIndex: number, optionIndex: number) {
  if (questions.value[questionIndex].widgetOptions) {
    questions.value[questionIndex].widgetOptions.splice(optionIndex, 1);
  }
}
</script> -->

<script setup lang="ts">
import { use_create_property } from "@/composables/modules/property/create";

const { payload } = use_create_property();

// Define the Question interface
interface Question {
  question: string;
  widgetType: string;
  widgetOptions: string[] | null;
  metadata: any;
}

const props = defineProps({
  payload: {
    type: Object,
    default: () => ({ questions: [] }), // Ensure there's a default structure
  },
});

const emit = defineEmits<{
  (event: "updateQuestions", questions: Question[]): void;
}>();

// State for the questions
const questions = ref<Question[]>([
  { question: "", widgetType: "input", widgetOptions: null, metadata: {} },
]);

// Prefill questions on component mounted
onMounted(() => {
  console.log(props?.payload?.questions.value, "qUESTIONS HEREssssss");
  if (
    Array.isArray(props?.payload?.questions?.value) &&
    props.payload?.questions?.value?.length > 0
  ) {
    questions.value = props?.payload?.questions?.value;
  }
});

// Watch questions and emit to parent component whenever they change
watch(
  questions,
  (newQuestions: any) => {
    props.payload.questions.value = newQuestions; // Update the payload object
    emit("updateQuestions", newQuestions);
  },
  { deep: true }
);

// Add a new question to the list
function addQuestion() {
  questions.value.push({
    question: "",
    widgetType: "input",
    widgetOptions: null,
    metadata: {},
  });
}

// Add an option to a specific question
function addOption(index: number) {
  if (!questions.value[index].widgetOptions) {
    questions.value[index].widgetOptions = [];
  }
  questions.value[index].widgetOptions.push("");
}

// Remove an option from a specific question
function removeOption(questionIndex: number, optionIndex: number) {
  if (questions.value[questionIndex].widgetOptions) {
    questions.value[questionIndex].widgetOptions.splice(optionIndex, 1);
  }
}
</script>
