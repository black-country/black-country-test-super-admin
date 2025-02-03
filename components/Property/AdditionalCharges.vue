<!-- <script setup lang="ts">
import { useGetAdditionalCharges } from '@/composables/modules/property/useFetchAdditionalCharges'
import { ref, watch, defineProps, computed, onMounted } from 'vue';

const { loading, additionalChargesList } = useGetAdditionalCharges();
const props = defineProps({
    runtimePayload: Object,
});

const isCautionEnabled = ref(false);
const isServiceEnabled = ref(false);
const serviceFrequency = ref('Monthly');
const additionalCharges = ref<Record<string, number>>({});

const formatCurrency = (value: string) => {
    return value.replace(/\D/g, '') // Remove non-numeric characters
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas for thousands
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
            amount: additionalCharges.value[charge.id] || 0,
        }))
        .filter(charge => { 
            if (orderedCharges.value.find(c => c.name === 'Caution Fee')?.id === charge.additionalChargeId) return isCautionEnabled.value;
            if (orderedCharges.value.find(c => c.name === 'Service Charge')?.id === charge.additionalChargeId) return isServiceEnabled.value;
            return true;
        });
});

const storedAdditionalCharges = JSON.parse(localStorage.getItem("additional_charges") || "[]");

const localAdditionalCharges = (Array.isArray(props.runtimePayload?.additionalCharges?.value) && props.runtimePayload.additionalCharges.value.length > 0)
  ? props.runtimePayload.additionalCharges.value
  : storedAdditionalCharges;

watch(mappedAdditionalCharges, (newValue) => {
    props.runtimePayload.additionalCharges.value = newValue;
    localStorage.setItem("additional_charges", JSON.stringify(newValue));
}, { deep: true });
</script>

<template>
    <div class="w-full space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="charge in orderedCharges" :key="charge.id" class="space-y-1">
                <template v-if="charge.name === 'Caution Fee'">
                    <div class="flex flex-col space-y-2">
                        <div class="flex justify-between items-center">
                            <label class="block text-[#1D2739] font-medium text-sm">{{ charge.name }}</label>
                            <button @click="isCautionEnabled = !isCautionEnabled"
                                :class="isCautionEnabled ? 'bg-green-600' : 'bg-gray-300'"
                                class="w-10 h-6 rounded-full transition duration-300 relative">
                                <span :class="isCautionEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-500'"
                                    class="block w-5 h-5 rounded-full transition-transform"></span>
                            </button>
                        </div>
                        <p class="text-sm text-[#667185]">Enable or disable caution fee</p>
                        <input v-model="additionalCharges[charge.id]" type="text" placeholder="e.g 80000" 
                            :disabled="!isCautionEnabled"
                            @input="additionalCharges[charge.id] = formatCurrency(additionalCharges[charge.id])"
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
                            <input v-model="additionalCharges[charge.id]" type="text" placeholder="80000"
                                :disabled="!isServiceEnabled" class="w-full px-3 py-3.5 border-l-0 bg-[#F0F2F5] outline-none rounded-r-lg text-gray-900 disabled:opacity-50">
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="flex flex-col space-y-1">
                        <label class="block text-sm font-medium text-[#1D2739]">{{ charge.name }}</label>
                        <input v-model="additionalCharges[charge.id]" type="text" placeholder="e.g 80000" 
                            @input="additionalCharges[charge.id] = formatCurrency(additionalCharges[charge.id])"
                            class="w-full px-3 py-3.5 bg-[#F0F2F5] border-[0.5px] border-gray-100 outline-none rounded-lg text-gray-900">
                    </div>
                </template>
            </div>
        </div>
    </div>
</template> -->


<script setup lang="ts">
import { useGetAdditionalCharges } from '@/composables/modules/property/useFetchAdditionalCharges'
import { ref, watch, defineEmits, computed } from 'vue';

const { loading, additionalChargesList } = useGetAdditionalCharges();
const emit = defineEmits(["update:additionalCharges"]);

const isCautionEnabled = ref(false);
const isServiceEnabled = ref(false);
const serviceFrequency = ref('Monthly');
const additionalCharges = ref<Record<string, number>>({});

const formatCurrency = (value: string) => {
    return value.replace(/\D/g, '') // Remove non-numeric characters
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas for thousands
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
            amount: additionalCharges.value[charge.id] || 0,
        }))
        .filter(charge => { 
            if (orderedCharges.value.find(c => c.name === 'Caution Fee')?.id === charge.additionalChargeId) return isCautionEnabled.value;
            if (orderedCharges.value.find(c => c.name === 'Service Charge')?.id === charge.additionalChargeId) return isServiceEnabled.value;
            return true;
        });
});

watch(mappedAdditionalCharges, (newValue) => {
    emit("update:additionalCharges", newValue);
}, { deep: true });
</script>

<template>
    <div class="w-full space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="charge in orderedCharges" :key="charge.id" class="space-y-1">
                <template v-if="charge.name === 'Caution Fee'">
                    <div class="flex flex-col space-y-2">
                        <div class="flex justify-between items-center">
                            <label class="block text-[#1D2739] font-medium text-sm">{{ charge.name }}</label>
                            <button @click="isCautionEnabled = !isCautionEnabled"
                                :class="isCautionEnabled ? 'bg-green-600' : 'bg-gray-300'"
                                class="w-10 h-6 rounded-full transition duration-300 relative">
                                <span :class="isCautionEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-500'"
                                    class="block w-5 h-5 rounded-full transition-transform"></span>
                            </button>
                        </div>
                        <p class="text-sm text-[#667185]">Enable or disable caution fee</p>
                        <input v-model="additionalCharges[charge.id]" type="text" placeholder="e.g 80000" 
                            :disabled="!isCautionEnabled"
                            @input="additionalCharges[charge.id] = formatCurrency(additionalCharges[charge.id])"
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
                            <input v-model="additionalCharges[charge.id]" type="text" placeholder="80000"
                                :disabled="!isServiceEnabled" class="w-full px-3 py-3.5 border-l-0 bg-[#F0F2F5] outline-none rounded-r-lg text-gray-900 disabled:opacity-50">
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="flex flex-col space-y-1">
                        <label class="block text-sm font-medium text-[#1D2739]">{{ charge.name }}</label>
                        <input v-model="additionalCharges[charge.id]" type="text" placeholder="e.g 80000" 
                            @input="additionalCharges[charge.id] = formatCurrency(additionalCharges[charge.id])"
                            class="w-full px-3 py-3.5 bg-[#F0F2F5] border-[0.5px] border-gray-100 outline-none rounded-lg text-gray-900">
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
