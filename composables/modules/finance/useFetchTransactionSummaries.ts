import { ref } from 'vue'
import { finance_api } from '@/api_factory/modules/finance'

export const useFetchTransactionSummaries = () => {
  const loading = ref(false)
  const transactionSummaries = ref({})

  const fetchTransactionSummaries = async () => {
    loading.value = true
  
      const res = await finance_api.$_fetch_fianance_summaries() as any
        console.log(res, 'tes here')
      if (res.type !== 'ERROR') {
        transactionSummaries.value = res?.data || {}
    }
    loading.value = false

  }

  onMounted(() => {
    fetchTransactionSummaries()
})

  return {
    fetchTransactionSummaries,
    loading,
    transactionSummaries
  }
}
