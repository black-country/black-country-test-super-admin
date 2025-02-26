<script setup lang="ts">
import { useGetAdditionalCharges } from '@/composables/modules/property/useFetchAdditionalCharges'
import { ref, watch, defineEmits, defineProps, computed, onMounted } from 'vue';

interface AdditionalChargeData {
  id: string;
  category: string;
  chargeType: string;
  name: string;
  optional: boolean;
  description: string;
  createdAt: string;
}

interface ChargeItem {
  id: string;
  amount: string;
  frequency: string | null;
  additionalCharge: AdditionalChargeData;
}

const props = defineProps({
  value: {
    type: Array as () => ChargeItem[],
    required: true,
    default: () => []
  }
});

const { loading, additionalChargesList } = useGetAdditionalCharges();
const emit = defineEmits(["update:additionalCharges"]);

const isCautionEnabled = ref(false);
const isServiceEnabled = ref(false);
const serviceFrequency = ref('Monthly');
const additionalCharges = ref<Record<string, string>>({});

onMounted(() => {
  props.value.forEach(item => {
    if (item.additionalCharge && item.additionalCharge.id) {
      const chargeId = item.additionalCharge.id;
      additionalCharges.value[chargeId] = formatCurrency(item.amount);
      
      // Set toggle states based on charge name
      if (item.additionalCharge.name === 'Caution Fee') {
        isCautionEnabled.value = true;
      }
      if (item.additionalCharge.name === 'Service Charge') {
        isServiceEnabled.value = true;
      }
    }
  });
});

watch(additionalChargesList, () => {
  additionalChargesList.value.forEach(charge => {
    if (!additionalCharges.value[charge.id]) {
      additionalCharges.value[charge.id] = '0';
    }
  });
}, { immediate: true });

const formatCurrency = (value: string) => {
  if (!value) return '';
  return value.replace(/\D/g, '') // Remove non-numeric characters
    .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas for thousands
};

const unformatCurrency = (value: string): number => {
  return parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
};

const orderedCharges = computed(() => {
  return additionalChargesList.value.sort((a, b) => {
    const order = ["Agent Fee", "Legal Fee", "Caution Fee", "Service Charge"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });
});

const mappedAdditionalCharges = computed(() => {
  return orderedCharges.value
    .map(charge => ({
      additionalChargeId: charge.id,
      amount: unformatCurrency(additionalCharges.value[charge.id] || '0')
    }))
    .filter(charge => {
      const chargeType = additionalChargesList.value.find(c => c.id === charge.additionalChargeId)?.name;
      if (chargeType === 'Caution Fee') return isCautionEnabled.value;
      if (chargeType === 'Service Charge') return isServiceEnabled.value;
      return true;
    });
});

// Update parent when changes occur
watch([mappedAdditionalCharges, isCautionEnabled, isServiceEnabled], () => {
  emit("update:additionalCharges", mappedAdditionalCharges.value);
}, { deep: true });

const handleInputChange = (chargeId: string, value: string) => {
  additionalCharges.value[chargeId] = formatCurrency(value);
};
</script>

<template>
  <div class="w-full space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="charge in orderedCharges" :key="charge.id" class="space-y-1">
        <template v-if="charge.name === 'Caution Fee'">
          <div class="flex flex-col space-y-2">
            <div class="flex justify-between items-center">
              <label class="block text-[#1D2739] font-medium text-sm capitalize">{{ charge.name }}</label>
              <button @click="isCautionEnabled = !isCautionEnabled"
                :class="isCautionEnabled ? 'bg-green-600' : 'bg-gray-300'"
                class="w-10 h-6 rounded-full transition duration-300 relative">
                <span :class="isCautionEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-500'"
                  class="block w-5 h-5 rounded-full transition-transform"></span>
              </button>
            </div>
            <p class="text-sm text-[#667185]">Enable or disable caution fee</p>
            <input :value="additionalCharges[charge.id]" type="text" placeholder="e.g 80000" 
              :disabled="!isCautionEnabled"
              @input="handleInputChange(charge.id, $event.target.value)"
              class="w-full px-3 py-3.5 bg-[#F0F2F5] border-[0.5px] border-gray-100 outline-none rounded-lg text-gray-900 disabled:opacity-50">
          </div>
        </template>
        <template v-else-if="charge.name === 'Service Charge'">
          <div class="flex flex-col space-y-2">
            <div class="flex justify-between items-center">
              <label class="block text-[#1D2739] font-medium text-sm">{{ charge.name }}</label>
              <button @click="isServiceEnabled = !isServiceEnabled"
                :class="isServiceEnabled ? 'bg-green-600' : 'bg-gray-300'"
                class="w-10 h-6 rounded-full transition duration-300 relative">
                <span :class="isServiceEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-500'"
                  class="block w-5 h-5 rounded-full transition-transform"></span>
              </button>
            </div>
            <p class="text-sm text-[#667185]">Enable or disable service charge</p>
            <div class="flex items-center">
              <select v-model="serviceFrequency" class="px-3 rounded-l-lg py-3.5 border-r-0 outline-none text-gray-900 bg-[#F0F2F5]">
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
              <input :value="additionalCharges[charge.id]" type="text" placeholder="80000"
                :disabled="!isServiceEnabled" 
                @input="handleInputChange(charge.id, $event.target.value)"
                class="w-full px-3 py-3.5 border-l-0 bg-[#F0F2F5] outline-none rounded-r-lg text-gray-900 disabled:opacity-50">
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col space-y-1">
            <label class="block text-sm font-medium text-[#1D2739]">{{ charge.name }}</label>
            <input :value="additionalCharges[charge.id]" type="text" placeholder="e.g 80000" 
              @input="handleInputChange(charge.id, $event.target.value)"
              class="w-full px-3 py-3.5 bg-[#F0F2F5] border-[0.5px] border-gray-100 outline-none rounded-lg text-gray-900">
          </div>
        </template>
      </div>
    </div>
  </div>
</template>