<template>
    <div class="w-full">
      <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
      </label>
  
      <div class="relative">
        <!-- {{ agentsList }} -->
        <Multiselect
          v-model="selectedValue"
          :options="formattedOptions"
          :multiple="multiple"
          :close-on-select="!multiple"
          :clear-on-select="false"
          :preserve-search="true"
          :placeholder="placeholder"
          :track-by="'id'"
          :label="'name'"
          :searchable="searchable"
          :loading="loading"
          :disabled="disabled"
          @select="handleSelect"
          @remove="handleRemove"
          @search-change="handleSearchChange"
          class="multiselect-tailwind"
        >
          <template v-slot:option="{ option }">
            <div class="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100">
              <div class="flex items-center space-x-2">
                <img
                  :src="option.profilePicture || defaultProfilePicture"
                  alt="Agent profile picture"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p class="text-gray-900 font-medium">{{ option.name }}</p>
                  <p class="text-gray-500 text-xs">{{ option.email }} • {{ option.phone }}</p>
                </div>
              </div>
            </div>
          </template>
  
          <template v-slot:noResult>
            <div class="text-center py-2 px-3 text-gray-500 text-sm">No agents found</div>
          </template>
  
          <template v-slot:noOptions>
            <div class="text-center py-2 px-3 text-gray-500 text-sm">No agents available</div>
          </template>
        </Multiselect>
      </div>
  
      <span v-if="error" class="text-red-500 text-sm mt-1 block">
        {{ error }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
import { computed, ref } from "vue";
import Multiselect from "vue-multiselect";
import { useFetchAgents } from "@/composables/modules/agents/fetch";

// Default profile picture (if agent has no profile picture)
const defaultProfilePicture = "https://via.placeholder.com/100?text=Agent";

// Fetch agents using composable
const { agentsList, loading } = useFetchAgents();

// Props definition
defineProps({
  modelValue: {
    type: [Array, Object, String, Number],
    default: null
  },
  label: {
    type: String,
    default: "Select an Agent"
  },
  placeholder: {
    type: String,
    default: "Search agents..."
  },
  multiple: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: () => `multiselect-${Math.random().toString(36).substr(2, 9)}`
  }
});

// Emits definition
const emit = defineEmits(["update:modelValue", "select", "remove", "search-change"]);

// ✅ Ensure agentsList is always an array (Prevents `find` from breaking)
const formattedOptions = computed(() => {
  return Array.isArray(agentsList.value)
    ? agentsList.value.map(agent => ({
        id: agent.id,
        name: `${agent.firstName} ${agent.lastName}`,
        email: agent.email,
        phone: agent.phoneNumber || "No phone",
        profilePicture: agent.profilePicture || defaultProfilePicture
      }))
    : [];
});

// ✅ Ensure `selectedValue` doesn't break if `agentsList.value` is not an array
const selectedValue = computed({
  get: () => {
    return Array.isArray(agentsList.value)
      ? agentsList.value.find(a => a.id === agentsList.value.id) || null
      : null;
  },
  set: (value) => emit("update:modelValue", value)
});

// Handles search changes dynamically
const handleSearchChange = (query: string) => {
  emit("search-change", query);
};

// Selection handlers
const handleSelect = (option: any) => emit("select", option);
const handleRemove = (option: any) => emit("remove", option);
</script>
