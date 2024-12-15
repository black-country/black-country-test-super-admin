<template>
    <CoreMultiSelect
      v-model="selected"
      :items="items"
      label="Select Users"
      placeholder="Search users..."
      :loading="isLoading"
      @search="handleSearch"
      @select="handleSelect"
      @remove="handleRemove"
      @change="handleChange"
    >
      <!-- Optional: Custom selected item template -->
      <template #selected-item="{ item, remove }">
        <div class="custom-selected-item">
          {{ item.name }}
          <button @click="remove(item)">×</button>
        </div>
      </template>
    </CoreMultiSelect>
  </template>
  
  <script setup lang="ts">
  const selected = ref([])
  const items = ref([
    { id: 1, name: 'John Doe', image: '/path/to/image.jpg' },
    { id: 2, name: 'Jane Smith', image: '/path/to/image.jpg' }
  ])
  
  const handleSearch = (query: string) => {
    // Handle search
  }
  
  const handleChange = (items: any[]) => {
    console.log('Selected items:', items)
  }
  </script>