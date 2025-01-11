<template>
    <div class="p-4 bg-white shadow rounded-lg">
      <div class="lg:flex justify-between items-center lg:pl-4 space-y-3">
        <div class="text-sm first:lg:text-xl font-">Occupancy rate</div>
        <div class="flex space-x-4">
          <select class="text-sm outline-none font-medium bg-gray-50 rounded-md px-2.5 py-2">
            <option>Month</option>
            <option>Year</option>
          </select>
          <select v-if="!loadingProperties" v-model="selectedProperty" class="text-sm outline-none font-medium bg-gray-50 rounded-md px-2.5 py-2">
            <option value="all">All properties</option>
            <option v-for="property in  propertiesList" :key="property" :value="property.id">{{ property.name }}</option>
          </select>
        </div>
      </div>
      <client-only>
        <div class="mt-4">
          <apexchart width="100%" height="300" type="line" :options="chartOptions" :series="series"></apexchart>
        </div>
      </client-only>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import { useGetProperties } from '@/composables/modules/property/fetchProperties'
  const {
    loadingProperties,
    propertiesList,
   } = useGetProperties()
  
  const props = defineProps({
    chatInfo: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  });
  
  const chartOptions = ref({
    chart: {
      id: 'vuechart-example',
      toolbar: { show: false },
      type: 'line',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [],
      title: {
        text: 'Today',
        style: {
          color: '#6B7280',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val}%`,
      },
      title: {
        text: 'Occupancy rate',
        style: {
          color: '#6B7280',
        },
      },
    },
    tooltip: {
      theme: 'light',
      fillSeriesColor: false,
    },
    colors: ['#10B981'],
    grid: {
      borderColor: '#E5E7EB',
    },
  });
  
  const series = ref([
    {
      name: 'Occupancy rate',
      data: [],
    },
  ]);
  
  // Update chart data when chatInfo changes
  watch(
    () => props.chatInfo,
    (newValue) => {
      if (newValue && newValue.length) {
        const categories = newValue.map((item) => item.period);
        const data = newValue.map((item) => parseFloat(item.occupancyRate));
  
        chartOptions.value.xaxis.categories = categories;
        series.value[0].data = data;
      }
    },
    { immediate: true }
  );
  </script>
  
  <style scoped></style>
  