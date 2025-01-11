<template>
    <div class="p-4 bg-white shadow rounded-lg">
      <section class="lg:flex justify-between items-center lg:pl-4">
        <div class="flex justify-between items-center gap-x-5">
          <div class="text-sm lg:text-xl font-medium">Revenue</div>
          <div class="text-sm lg:text-xl font-medium">{{ totalRevenue }}</div>
        </div>
        <div class="flex justify-between mt-4 space-x-4">
          <select v-model="selectedPeriod" class="text-sm outline-none font-medium bg-gray-50 rounded-md px-2.5 py-2">
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          <select v-if="!loadingProperties" v-model="selectedProperty" class="text-sm outline-none font-medium bg-gray-50 rounded-md px-2.5 py-2">
            <option value="all">All properties</option>
            <option v-for="property in  propertiesList" :key="property" :value="property.id">{{ property.name }}</option>
          </select>
        </div>
      </section>
      <client-only>
        <div class="mt-4">
          <apexchart width="100%" height="300" type="line" :options="chartOptions" :series="series"></apexchart>
        </div>
      </client-only>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useGetProperties } from '@/composables/modules/property/fetchProperties'
  const {
    loadingProperties,
    propertiesList,
   } = useGetProperties()
  import { ref, computed, watch } from 'vue';
  
  const props = defineProps({
    chatInfo: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  });
  
  const selectedPeriod = ref('month');
  const selectedProperty = ref('all');
  const properties = ref(['Property 1', 'Property 2']);
  
  const totalRevenue = computed(() => {
    if (!Array.isArray(props.chatInfo)) return 0;
    return props.chatInfo.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
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
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val}k`,
      },
    },
    tooltip: {
      theme: 'light',
      fillSeriesColor: false,
    },
    colors: ['#10B981', '#F59E0B'],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  });
  
  const series = ref([
    {
      name: 'Revenue',
      data: [],
    }
  ]);
  
  const updateChart = () => {
    if (!Array.isArray(props.chatInfo)) {
      console.error('Invalid chatInfo data. Expected an array.');
      return;
    }
  
    const categories = props.chatInfo.map(item => item.period);
    const data = props.chatInfo.map(item => parseFloat(item.total || 0));
  
    chartOptions.value.xaxis.categories = categories;
    series.value[0].data = data;
  };
  
  watch(
    () => props.chatInfo,
    (newValue) => {
      if (Array.isArray(newValue)) {
        updateChart();
      } else {
        console.error('chatInfo is not an array.');
      }
    },
    { immediate: true }
  );
  </script>
  
  <style scoped>
  </style>
  