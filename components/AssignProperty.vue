<!-- <template>
  <main>
      <div class="relative w-full h-44">
          <label class="block text-sm font-medium text-gray-700">Assign property</label>
          <div class="mt-1 relative">
              <select
                  :value="selectedUserId"
                  @change="handleSelectChange($event.target.value)"
                  class="w-full bg-[#F0F2F5] text-sm py-4 px-4 border-[0.5px] outline-none border-gray-100 rounded-md cursor-pointer">
                  <option value="" disabled>Select agent/property manager</option>
                  <option v-for="user in agentList" :key="user.id" :value="user.id">
                      {{ user.firstName }} {{ user.lastName }}
                  </option>
              </select>
          </div>
      </div>
      <slot name="action-buttons"></slot>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Define props with default values
const props = defineProps({
agents: {
  type: Array,
  default: () => []
},
payload: {
  type: Object,
  default: () => ({ agentId: '' }) // Ensure the default payload structure includes agentId
}
});

// Emit events to the parent component
const emit = defineEmits(['update:payload']);

// Reactive variable to track the selected user ID
const selectedUserId = ref(props.payload.agentId);

// Create a computed property that always returns an array of agents
const agentList = computed(() => Array.isArray(props.agents) ? props.agents : []);

// Handle the selection change and emit the updated payload to the parent component
function handleSelectChange(value) {
selectedUserId.value = value;
emit('update:payload', { ...props.payload, agentId: value });
}

// Prefill the selected agent ID on component mount
onMounted(() => {
if (props.payload.agentId) {
  selectedUserId.value = props.payload.agentId;
}
});
</script> -->

<template>
  <main>
      <div class="relative w-full h-44">
          <label class="block text-sm font-medium text-gray-700">Assign property</label>
          <div class="mt-1 relative">
              <select
                  v-model="localSelectedId"
                  class="w-full bg-[#F0F2F5] text-sm py-4 px-4 border-[0.5px] outline-none border-gray-100 rounded-md cursor-pointer">
                  <option value="" disabled>Select agent/property manager</option>
                  <option v-for="user in agentList" :key="user.id" :value="user.id">
                      {{ user.firstName }} {{ user.lastName }}
                  </option>
              </select>
          </div>
      </div>
      <slot name="action-buttons"></slot>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps({
  agents: {
    type: Array,
    default: () => []
  },
  payload: {
    type: Object,
    default: () => ({ agentId: '' })
  }
});

const emit = defineEmits(['update:payload']);

// Create a local ref to handle the selection
const localSelectedId = ref(props.payload.agentId);

// Computed property for agents list
const agentList = computed(() => Array.isArray(props.agents) ? props.agents : []);

// Watch for changes in the local selection
watch(localSelectedId, (newValue) => {
  emit('update:payload', { ...props.payload, agentId: newValue });
});

// Watch for changes in the props
watch(() => props.payload.agentId, (newValue) => {
  localSelectedId.value = newValue;
});
</script>