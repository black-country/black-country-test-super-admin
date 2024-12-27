<template>
    <Layout>
      <template #header-content>
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between">
          <div class="flex items-center gap-x-4">
            <h4 class="text-[#1D2739] text-lg">Over Due payments</h4>
          </div>
        </div>
      </template>
     <OverduePayment :show-header="false" />
    </Layout>
  </template>
  
  <script setup lang="ts">
  import { useUser } from '@/composables/auth/user'
  const { user } = useUser()
  import Layout from '@/layouts/dashboard.vue';
  definePageMeta({
       middleware: 'auth'
  })
  
  </script>
  