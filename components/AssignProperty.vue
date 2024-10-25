<template>
    <main>
        <div class="relative w-full h-44">
            <label class="block text-sm font-medium text-gray-700">Assign property</label>
            <div class="mt-1 relative">
                <input type="text" readonly placeholder="Single agent/property manager" v-model="selectedUser"
                    @click="toggleDropdown"
                    class="w-full bg-[#F0F2F5] text-sm py-3 px-4 border-[0.5px] outline-none border-gray-100 rounded-md cursor-pointer" />
                <div v-if="showDropdown" ref="dropdown"
                    class="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-1 h-44">
                    <ul v-if="!loading">
                        <li v-for="user in agents" :key="user.id" @click="selectUser(user)"
                            class="px-4 py-3 text-sm border-b-[0.5px] last:border-b-0 hover:bg-gray-50 cursor-pointer">
                            {{ user.firstName }} {{ user.lastName }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <slot name="action-buttons"></slot>
    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// Define props with default values
const props = defineProps({
  agents: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  payload: {
    type: Object,
    default: () => ({ agentId: '' }) // Ensure the default payload structure includes agentId
  }
});

// Emit events to the parent component
const emit = defineEmits(['update:payload']);

// Reactive variables
const selectedUser = ref('');
const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Create a computed property that always returns an array
const agentList = computed(() => Array.isArray(props.agents) ? props.agents : []);

// Toggles the dropdown visibility
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

// Selects the user and emits the selected value to the parent component
function selectUser(user: any) {
  console.log(user, 'selected');
  // Update payload with the new agentId without modifying the prop directly
  emit('update:payload', { ...props.payload, agentId: user.id });
  selectedUser.value = `${user.firstName} ${user.lastName}`;
  props.payload.agentId.value = user.id
  showDropdown.value = false;
}

// Handle clicks outside the dropdown to close it
function handleClickOutside(event: MouseEvent) {
  const dropdown = dropdownRef.value;
  if (dropdown && !dropdown.contains(event.target as Node)) {
    showDropdown.value = false;
  }
}

const existingAgent = ref({}) as any;

// Computed property to get the selected agent based on agentId in payload
const selected = computed(() => {
  if (!props.agents || !props.payload) {
    console.log('Missing agents or payload:', { agents: props.agents, payload: props.payload });
    return 'No';
  }

  const filteredAgents = props.agents.filter((agent: any) => agent?.id === props.payload?.agentId);

  if (filteredAgents.length === 0) {
    console.log('No agent found with agentId:', props.payload?.agentId);
    return 'No';
  }

  // Return the first matched agent
  return filteredAgents[0];
});

// Prefill the agent data on component mount
onMounted(() => {
  console.log(props.agents, 'agents list');
  console.log(props.payload.agentId, 'already selected agent');

  // Prefill agent details if `props.payload.agentId` is available
  if (props.payload.agentId) {
    const agent = props.agents.find((user: any) => user.id === props.payload.agentId);
    existingAgent.value = agent;
    if (agent) {
      selectedUser.value = `${agent.firstName} ${agent.lastName}`;
    }
  }

  document.addEventListener('click', handleClickOutside);
});

// Clean up event listener on component unmount
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>


<!-- <script setup lang="ts">
const props = defineProps({
  agents: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  payload: {
    type: Object,
    default: () => ({ agentId: '' }) // Ensure the default payload structure includes agentId
  }
});

// Emit events to the parent component
const emit = defineEmits(['update:payload']);

// Reactive variables
const selectedUser = ref('');
const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Create a computed property that always returns an array
const agentList = computed(() => Array.isArray(props.agents) ? props.agents : []);

// Toggles the dropdown visibility
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

// Selects the user and emits the selected value to the parent component
function selectUser(user: any) {
  console.log(user, 'selected')
  props.payload.agentId.value = String(user.id)
  emit('update:payload', { ...props.payload, agentId: user.id }); // Emit the updated payload
  selectedUser.value = `${user.firstName} ${user.lastName}`;
  showDropdown.value = false;
}

// Handle clicks outside the dropdown to close it
function handleClickOutside(event: MouseEvent) {
  const dropdown = dropdownRef.value;
  if (dropdown && !dropdown.contains(event.target as Node)) {
    showDropdown.value = false;
  }
}

const existingAgent = ref({}) as any

const selected = computed(() => {
  if (!props.agents || !props.payload) {
    console.log('Missing agents or payload:', { agents: props.agents, payload: props.payload })
    return 'No'
  }

  const filteredAgents = props.agents.filter((agent: any) => agent?.id === props.payload?.agentId)

  if (filteredAgents.length === 0) {
    console.log('No agent found with agentId:', props.payload?.agentId)
    return 'No'
  }

  // Return the first matched agent
  return filteredAgents[0]
})


// Prefill the agent data on component mount
onMounted(() => {
  console.log(props.agents, 'agents list');
  console.log(props.payload.agentId.value, 'already selected agent');

  // Prefill agent details if `props.payload.agentId` is available
  if (props.payload.agentId) {
    const agent = props.agents.find((user: any) => user.id === props.payload.agentId);
    existingAgent.value = agent
    if (agent) {
      selectedUser.value = `${agent.firstName} ${agent.lastName}`;
    }
  }

  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script> -->

<!-- <template>
  <main>
      <div class="relative w-full h-44">
          <label class="block text-sm font-medium text-gray-700">Assign property</label>
          <div class="mt-1 relative">
              <input type="text" readonly placeholder="Single agent/property manager" v-model="selectedUser"
                  @click="toggleDropdown"
                  class="w-full bg-[#F0F2F5] text-sm py-3 px-4 border-[0.5px] outline-none border-gray-100 rounded-md cursor-pointer" />
              <div v-if="showDropdown" ref="dropdown"
                  class="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-1 h-44">
                  <ul v-if="!loading">
                      <li v-for="user in agentList" :key="user.id" @click="selectUser(user)"
                          class="px-4 py-3 text-sm border-b-[0.5px] last:border-b-0 hover:bg-gray-50 cursor-pointer">
                          {{ user.firstName }} {{ user.lastName }}
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <slot name="action-buttons"></slot>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';

const props = defineProps({
agents: {
  type: Array,
  default: () => []
},
loading: {
  type: Boolean,
  default: false
},
payload: {
  type: Object,
  default: () => ({ agentId: '' })
}
});

// Emit events to the parent component
const emit = defineEmits(['update:payload']);

// Reactive variables
const selectedUser = ref('');
const showDropdown = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Create a computed property that always returns an array
const agentList = computed(() => Array.isArray(props.agents) ? props.agents : []);

// Toggles the dropdown visibility
function toggleDropdown() {
showDropdown.value = !showDropdown.value;
}

// Selects the user and emits the selected value to the parent component
function selectUser(user: any) {
console.log(user, 'selected');
props.payload.agentId = user.id; // Update agentId directly in payload
emit('update:payload', { ...props.payload, agentId: user.id });
selectedUser.value = `${user.firstName} ${user.lastName}`;
showDropdown.value = false;
}

// Handle clicks outside the dropdown to close it
function handleClickOutside(event: MouseEvent) {
const dropdown = dropdownRef.value;
if (dropdown && !dropdown.contains(event.target as Node)) {
  showDropdown.value = false;
}
}

const existingAgent = ref({}) as any;

const selected = computed(() => {
const filteredAgents = agentList.value.filter((agent: any) => agent?.id === props.payload.agentId);

if (filteredAgents.length === 0) {
  console.log('No agent found with agentId:', props.payload.agentId);
  return 'No';
}

return filteredAgents[0];
});

// Prefill the agent data on component mount
onMounted(() => {
console.log(agentList.value, 'agents list');
console.log(props.payload.agentId, 'already selected agent');

if (props.payload.agentId) {
  const agent = agentList.value.find((user: any) => user.id === props.payload.agentId);
  existingAgent.value = agent;
  if (agent) {
    selectedUser.value = `${agent.firstName} ${agent.lastName}`;
  }
}

document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
document.removeEventListener('click', handleClickOutside);
});
</script> -->
