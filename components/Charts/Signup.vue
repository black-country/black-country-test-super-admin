<!-- <template>
    <div class="p-4 bg-white shadow rounded-lg">
      {{signupMetricsObj}}
      <div class="flex justify-between items-center pl-4">
        <div class="text-md lg:text-xl font-">Sign ups</div>
        <select class="text-sm outline-none font-medium bg-gray-50 rounded-md px-3.5 py-2.5">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <client-only>
        <div class="mt-4">
          <apexchart width="100%" height="470" type="bar" :options="chartOptions" :series="series"></apexchart>
        </div>
      </client-only>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
   const props = defineProps({
    signupMetricsObj: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
   })
  
  const chartOptions = ref({
    chart: {
      id: 'vuechart-example',
      toolbar: { show: false },
      type: 'bar',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: false,
        columnWidth: '50%',
      },
    },
    colors: ['#1C64F2'],
    xaxis: {
      categories: [2, 4, 8, 10, 12, 16, 18, 20, 22, 24, 26, 28],
      labels: {
        style: {
          colors: '#6B7280',
        },
      },
      title: {
        text: 'Today',
        style: {
          color: '#6B7280',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val}k`,
        style: {
          colors: '#6B7280',
        },
      },
      title: {
        text: 'Users',
        style: {
          color: '#6B7280',
        },
      },
    },
    grid: {
      borderColor: '#E5E7EB',
    },
    tooltip: {
      theme: 'light',
      fillSeriesColor: false,
    },
  })
  
  const series = ref([
    {
      name: 'Users',
      data: [100, 150, 200, 250, 300, 150, 800, 450, 700, 400, 300, 100],
    },
  ])
  </script>
  
  <style scoped></style>
   -->

   <template>
    <div class="p-4 bg-white shadow rounded-lg">
      <!-- {{ signupMetricsObj }} -->
      <div class="flex justify-between items-center pl-4">
        <div class="text-md lg:text-xl font-">Sign ups</div>
        <select class="text-sm outline-none font-medium bg-gray-50 rounded-md px-3.5 py-2.5">
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>
      <client-only>
        <div class="mt-4">
          <apexchart
            width="100%"
            height="470"
            type="bar"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </div>
      </client-only>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  
  const props = defineProps({
    signupMetricsObj: {
      type: Object,
      required: true,
      default: () => ({}),
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
      type: 'bar',
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: false,
        columnWidth: '50%',
      },
    },
    colors: ['#1C64F2'],
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: '#6B7280',
        },
      },
      title: {
        text: 'Period',
        style: {
          color: '#6B7280',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val}`,
        style: {
          colors: '#6B7280',
        },
      },
      title: {
        text: 'Signups',
        style: {
          color: '#6B7280',
        },
      },
    },
    grid: {
      borderColor: '#E5E7EB',
    },
    tooltip: {
      theme: 'light',
      fillSeriesColor: false,
    },
  });
  
  // Compute dynamic chart data
  const series = ref([
    {
      name: 'Signups',
      data: [],
    },
  ]);
  
  // Watch props and update chart data dynamically
  watch(
    () => props.signupMetricsObj,
    (newData) => {
      if (newData) {
        // Extract categories (dates) and data (counts) from the props
        const categories = newData.map((item: { period: string }) => item.period);
        const data = newData.map((item: { count: string }) => Number(item.count));
  
        // Update chart options and series
        chartOptions.value.xaxis.categories = categories;
        series.value[0].data = data;
      }
    },
    { immediate: true }
  );
  </script>
  
  <style scoped></style>
  