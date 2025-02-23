<script setup lang="ts">
import { useCurrencyFormatter } from '@/composables/core/useCurrencyFormatter'
const { formatCurrency } = useCurrencyFormatter()
import { ref } from 'vue';

interface Fee {
    name: string;
    amount: string;
    frequency: string;
    description: string;
}

const props = defineProps({
    additionalChargesList: {
        type: Array,
        default: () => []
    }
})

const selectedFee = ref<Fee | null>(null);
const isModalOpen = ref(false);

function openModal(fee: Fee) {
    selectedFee.value = fee;
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
    selectedFee.value = null;
}
</script>

<template>
    <div class="mx-auto bg-white rounded-xl ">
        <!-- {{  additionalChargesList }} -->
        <h2 class="text-base font-medium mb-4 pl-6 border-[0.5px] border-gray-100 my-6 py-4 rounded-lg">Rental Fees Breakdown</h2>
       <div class="rounded-xl bg-white border-[0.5px] border-gray-50">
        <div v-for="fee in additionalChargesList" :key="fee?.id"
            class="flex justify-between px-6 border-[0.5px] space-y-6 items-center border-gray-50  py-4">
            <div class="flex items-center justify-between space-x-2 w-full">
               <div class="space-y-2">
                <span class="text-[#475367]">{{ fee?.additionalCharge?.name }}</span>
                <div>
                    <span class="text-[#1D2739] font-medium">{{ formatCurrency(fee.amount) }}</span>
                    <span class="text-sm text-[#475367] pl-2"> {{ fee?.frequency }}</span>
                </div>
               </div>
                <div>
                    <button v-if="fee?.additionalCharge?.description" @click="openModal(fee)" class="text-blue-500">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.3327 9.99935C18.3327 5.39697 14.6017 1.66602 9.99935 1.66602C5.39697 1.66602 1.66602 5.39697 1.66602 9.99935C1.66602 14.6017 5.39697 18.3327 9.99935 18.3327C14.6017 18.3327 18.3327 14.6017 18.3327 9.99935Z"
                                fill="#1A47C5" stroke="#1A47C5" stroke-width="1.5" />
                            <path
                                d="M10.2025 14.166V9.99935C10.2025 9.60652 10.2025 9.4101 10.0804 9.28802C9.95839 9.16602 9.76197 9.16602 9.36914 9.16602"
                                stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9.99414 6.66602H10.0016" stroke="white" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
       </div>

        <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-[#F9FAFB] rounded-lg shadow-lg max-w-md w-full pb-6">
                <div>
                <div class="flex justify-between items-center bg-white p-4 rounded-t-xl">
                    <h3 class="text-lg font-medium text-[#1D2739] mb-2">{{ fee?.additionalCharge?.name }}</h3>
                    <button @click="closeModal" class="">
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 5.5L5 19.5M5 5.5L19 19.5" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                </div>

                <div class="bg-white p-4 m-6 rounded-lg">
                    <p class="text-gray-700 mb-4 text-sm leading-snug">{{ selectedFee?.additionalCharge?.description }}</p>
                 <div class="flex justify-between items-center tetx-sm">
                    <p class="text-[#667185]">Amoount</p>
                    <p class="text-[#475367]"><span class="text-[#1D2739]">{{ formatCurrency(selectedFee?.amount) }}</span> {{ selectedFee?.frequency }}</p>
                 </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 640px) {
    .max-w-lg {
        max-width: 100%;
        padding: 16px;
    }
}
</style>
