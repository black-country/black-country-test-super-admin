<template>
 <main>
  <QuillEditor v-model:content="innerContent"  contentType="html"
          theme="snow"
          toolbar="full" />
 </main>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default defineComponent({
  name: "CoreQuill",
  components: {
    QuillEditor
  },
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const innerContent = ref<string>(props.modelValue);

    // Watch for changes in the parent value
    watch(
      () => props.modelValue,
      (newValue) => {
        if (newValue !== innerContent.value) {
          innerContent.value = newValue;
        }
      }
    );

    // Emit changes back to the parent
    watch(innerContent, (newValue) => {
      emit("update:modelValue", newValue);
    });

    return {
      innerContent,
    };
  },
});
</script>
