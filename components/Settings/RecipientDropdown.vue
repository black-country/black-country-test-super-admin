<template>
    <div class="container mx-auto">  
      <SettingsRecipientDropdownList v-model="selectedRecipients" :options="recipients" />
  
      <div class="mt-4 grid grid-cols-4 gap-4">
        <SettingsRecipientChip v-for="recipient in selectedRecipients" :key="recipient" :recipient="recipient" @remove="removeRecipient" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  
  const recipients = [
    'All Tenants',
    'Lorenzo Connelly',
    'Garry Moore',
    'Lorenzo Connelly',
    'Garry Moore',
    'Jean Kirlin',
    'Elsa Nikolaus',
    'Peter Price',
    'Daniel Hermann',
    'Velma Nitzsche',
    'Robyn Fadel'
    // ... other recipients
  ];
  
  const selectedRecipients = ref([]);
  
  const removeRecipient = (recipient: string) => {
    selectedRecipients.value = selectedRecipients.value.filter(r => r !== recipient);
  };
  </script>