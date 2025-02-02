<!-- <script setup lang="ts">
import { useGetAdditionalCharges } from '@/composables/modules/property/useFetchAdditionalCharges'
const { loading, additionalChargesList } = useGetAdditionalCharges()
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
    agentFee: String,
    legalFee: String,
    initialCautionEnabled: Boolean,
    initialServiceEnabled: Boolean,
});

const emit = defineEmits(["update:agentFee", "update:legalFee", "update:cautionFee", "update:serviceCharge", "update:cautionEnabled", "update:serviceEnabled"]);

const agentFee = ref(props.agentFee || '');
const legalFee = ref(props.legalFee || '');
const cautionFee = ref('');
const serviceCharge = ref('');
const isCautionEnabled = ref(props.initialCautionEnabled || false);
const isServiceEnabled = ref(props.initialServiceEnabled || false);
const serviceFrequency = ref('Monthly');

const formatCurrency = (value: string) => {
    return value.replace(/\D/g, '') // Remove non-numeric characters
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas for thousands
};

watch(cautionFee, (newValue) => {
    cautionFee.value = formatCurrency(newValue);
    emit("update:cautionFee", cautionFee.value);
});

watch(serviceCharge, (newValue) => {
    serviceCharge.value = formatCurrency(newValue);
    emit("update:serviceCharge", serviceCharge.value);
});

watch(isCautionEnabled, (newValue) => {
    emit("update:cautionEnabled", newValue);
});

watch(isServiceEnabled, (newValue) => {
    emit("update:serviceEnabled", newValue);
});
</script>

<template>
    <div class="w-full space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
                <label class="block text-sm font-medium text-[#1D2739]">Agent fee</label>
                <input v-model="agentFee" type="text" placeholder="e.g 80000" @input="emit('update:agentFee', agentFee)"
                    class="w-full px-3 bg-[#F0F2F5] border-[0.5px] border-gray-100 py-3.5  outline-none rounded-lg text-gray-900">
            </div>
            <div class="space-y-1">
                <label class="block text-sm font-medium text-[#1D2739]">Legal fee</label>
                <input v-model="legalFee" type="text" placeholder="e.g 80000" @input="emit('update:legalFee', legalFee)"
                    class="w-full px-3 py-3.5 bg-[#F0F2F5] border-[0.5px] border-gray-100 outline-none rounded-lg text-gray-900">
            </div>
        </div>

<section class="grid grid-cols-2 gap-6">
    <div class="space-y-2">
            <div class="flex justify-between items-center">
                <div>
                    <label class="block text-[#1D2739] font-medium text-sm">Caution fee</label>
                    <p class="text-sm text-[#667185] text-sm">Switch the toggle to enable or disable caution fee</p>
                </div>


                <button @click="isCautionEnabled = !isCautionEnabled"
                    :class="isCautionEnabled ? 'bg-green-600' : 'bg-gray-300'"
                    class="w-10 h-6 rounded-full transition duration-300 relative">
                    <span :class="isCautionEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-500'"
                        class="block w-5 h-5 rounded-full transition-transform"></span>
                </button>
            </div>

            <div class="flex items-center gap-2">
                <input v-model="cautionFee" type="text" placeholder="80000" :disabled="!isCautionEnabled"
                    class="w-full px-3 py-3.5 border-[0.5px] bg-[#F0F2F5] rounded-lg outline-none text-gray-90 disabled:opacity-50">
            </div>
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <div>
                    <label class="blocktext-[#1D2739 font-medium text-sm">Service charge</label>
                    <p class="text-sm text-[#667185] text-sm">Switch the toggle to enable or disable service fee</p>
                </div>



                <button @click="isServiceEnabled = !isServiceEnabled"
                    :class="isServiceEnabled ? 'bg-green-600' : 'bg-gray-300'"
                    class="w-10 h-6 rounded-full transition duration-300 relative">
                    <span :class="isServiceEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-500'"
                        class="block w-5 h-5 rounded-full transition-transform"></span>
                </button>
            </div>

            <div class="flex items-center">
                <select v-model="serviceFrequency" class="px-3 rounded-l-lg py-3.5 border-r-0 outline-none text-gray-900 bg-[#F0F2F5]">
                    <option>Monthly</option>
                    <option>Yearly</option>
                </select>
                <input v-model="serviceCharge" type="text" placeholder="80000" :disabled="!isServiceEnabled"
                    class="w-full px-3 py-3.5 border-l-0 bg-[#F0F2F5] outline-none rounded-r-lg text-gray-900 disabled:opacity-50">
            </div>
        </div>
</section>
    </div>
</template> -->

<script setup lang="ts">
import { useGetAdditionalCharges } from '@/composables/modules/property/useFetchAdditionalCharges'
import { ref, watch, defineProps, defineEmits, computed, onMounted } from 'vue';

const { loading, additionalChargesList } = useGetAdditionalCharges();
const props = defineProps({
    initialCautionEnabled: Boolean,
    initialServiceEnabled: Boolean,
});
const emit = defineEmits(["update:additionalCharges", "update:cautionEnabled", "update:serviceEnabled"]);

const isCautionEnabled = ref(props.initialCautionEnabled || false);
const isServiceEnabled = ref(props.initialServiceEnabled || false);
const serviceFrequency = ref('Monthly');
const additionalCharges = ref<Record<string, number>>({});

const formatCurrency = (value: string) => {
    return value.replace(/\D/g, '') // Remove non-numeric characters
        .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas for thousands
};

const mappedAdditionalCharges = computed(() => {
    return additionalChargesList.value.map(charge => ({
        additionalChargeId: charge.id,
        amount: additionalCharges.value[charge.id] || 0,
    }));
});

watch(mappedAdditionalCharges, (newValue) => {
    emit("update:additionalCharges", newValue);
}, { deep: true });

watch(isCautionEnabled, (newValue) => {
    emit("update:cautionEnabled", newValue);
});

watch(isServiceEnabled, (newValue) => {
    emit("update:serviceEnabled", newValue);
});
</script>

<template>
    <div class="w-full space-y-6">
        {{ additionalChargesList }}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="charge in additionalChargesList" :key="charge.id" class="space-y-1">
                <label class="block text-sm font-medium text-[#1D2739]">{{ charge.name }}</label>
                <input v-model="additionalCharges[charge.id]" type="text" placeholder="e.g 80000" 
                    @input="additionalCharges[charge.id] = formatCurrency(additionalCharges[charge.id])"
                    class="w-full px-3 py-3.5 bg-[#F0F2F5] border-[0.5px] border-gray-100 outline-none rounded-lg text-gray-900">
            </div>
        </div>

        <section class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <div>
                        <label class="block text-[#1D2739] font-medium text-sm">Caution fee</label>
                        <p class="text-sm text-[#667185] text-sm">Switch the toggle to enable or disable caution fee</p>
                    </div>
                    <button @click="isCautionEnabled = !isCautionEnabled"
                        :class="isCautionEnabled ? 'bg-green-600' : 'bg-gray-300'"
                        class="w-10 h-6 rounded-full transition duration-300 relative">
                        <span :class="isCautionEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-500'"
                            class="block w-5 h-5 rounded-full transition-transform"></span>
                    </button>
                </div>
            </div>

            <div class="space-y-2">
                <div class="flex justify-between items-center">
                    <div>
                        <label class="block text-[#1D2739] font-medium text-sm">Service charge</label>
                        <p class="text-sm text-[#667185] text-sm">Switch the toggle to enable or disable service fee</p>
                    </div>
                    <button @click="isServiceEnabled = !isServiceEnabled"
                        :class="isServiceEnabled ? 'bg-green-600' : 'bg-gray-300'"
                        class="w-10 h-6 rounded-full transition duration-300 relative">
                        <span :class="isServiceEnabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-gray-500'"
                            class="block w-5 h-5 rounded-full transition-transform"></span>
                    </button>
                </div>

                <div class="flex items-center">
                    <select v-model="serviceFrequency" class="px-3 rounded-l-lg py-3.5 border-r-0 outline-none text-gray-900 bg-[#F0F2F5]">
                        <option>Monthly</option>
                        <option>Yearly</option>
                    </select>
                    <input v-model="additionalCharges['f409454d-70b0-4331-a2aa-0af795b61991']" type="text" placeholder="80000"
                        :disabled="!isServiceEnabled" class="w-full px-3 py-3.5 border-l-0 bg-[#F0F2F5] outline-none rounded-r-lg text-gray-900 disabled:opacity-50">
                </div>
            </div>
        </section>
    </div>
</template>
