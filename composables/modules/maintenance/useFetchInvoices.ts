// import { ref } from 'vue'
// import { maintenance_api } from '@/api_factory/modules/maintenance'

// export const useFetchInvoices = () => {
//   const fetching = ref(false)
//   const invoicesList = ref([])

//   const metadata = ref({
//     page: 1,
//     perPage: 7,
//     total: 100,
//     pages: 0,
// });

// function debounce(fn: Function, delay: number) {
//     let timeoutId: number | undefined;
//     const debounced = function (...args: any) {
//         if (timeoutId) {
//             clearTimeout(timeoutId);
//         }
//         timeoutId = setTimeout(() => {
//             fn(...args);
//         }, delay);
//     };

//     debounced.cancel = () => {
//         if (timeoutId) {
//             clearTimeout(timeoutId);
//         }
//     };

//     return debounced;
// }

//   const fetchInvoices = async () => {
//     fetching.value = true
  
//       const res = await maintenance_api.$_fetch_all_invoices(
//         metadata.value.page,
//         metadata.value.perPage,
//       ) as any

//       console.log(res, 'here')

//       if (res.type !== 'ERROR') {
//         invoicesList.value = res?.data?.result || []
//         metadata.value = res?.data?.metadata;
//     }
//     fetching.value = false

//   }

//       // Debounced version of getTransactions to avoid multiple API calls
//       const debouncedGetTransactions = debounce(fetchInvoices, 300); // 300ms delay

//       // Watch for changes in filters and metadata.page/perPage
//       watch(metadata, () => {
//           if (metadata.value.page !== 1) {
//               setPaginationObj(1); // Reset to the first page when search query changes
//           }
//           fetching.value = true;
//           fetchInvoices()
//       }, { deep: true });
  
//       watch( [metadata.value.page, metadata.value.perPage], // Watch only page and perPage
//           () => {
//               // debouncedGetTransactions(); // Use the debounced version here
//               fetchInvoices()
//           }
//       );
  
//       const setPaginationObj = (val: number) => {
//           if (metadata.value.page !== val) {
//               metadata.value.page = val;
//           }
//       };

//   onMounted(() => {
//     fetchInvoices()
// })

// onBeforeUnmount(() => {
//     // Clear timeout to avoid memory leaks
//     debouncedGetTransactions.cancel?.();
// });

//   return {
//     fetchInvoices,
//     fetching,
//     invoicesList,
//     metadata
//   }
// }


import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { maintenance_api } from '@/api_factory/modules/maintenance';

export const useFetchInvoices = () => {
  const fetching = ref(false);
  const invoicesList = ref([]);

  const metadata = ref({
    page: 1,
    perPage: 7,
    total: 100,
    pages: 0,
  });

  let updatingMetadata = false; // Prevents infinite loop when updating metadata manually

//   function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
//     let timeoutId: number | undefined;

//     const debounced = (...args: Parameters<T>) => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
//       timeoutId = setTimeout(() => {
//         fn.apply(null, args);
//       }, delay);
//     };

//     debounced.cancel = () => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
//     };

//     return debounced;
//   }

  const fetchInvoices = async () => {
    fetching.value = true;

    try {
      const res = (await maintenance_api.$_fetch_all_invoices(
        metadata.value.page,
        metadata.value.perPage
      )) as any;

      console.log(res, 'here');

      if (res.type !== 'ERROR') {
        invoicesList.value = res?.data?.result || [];
        updatingMetadata = true; // Temporarily prevent watch trigger
        metadata.value = { ...metadata.value, ...res?.data?.metadata };
        updatingMetadata = false;
      }
    } finally {
      fetching.value = false;
    }
  };

  // Debounced version of fetchInvoices
//   const debouncedFetchInvoices = debounce(fetchInvoices, 300);

//   // Watch for changes in filters and reset pagination
//   watch(
//     metadata,
//     (newVal, oldVal) => {
//       if (updatingMetadata) return; // Prevent infinite loop

//       if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
//         setPaginationObj(1); // Reset to first page if filter changes
//       }
//     },
//     // { deep: true }
//   );

  // Watch only for page and perPage changes
//   watch(
//     () => [metadata.value.page, metadata.value.perPage],
//     () => {
//       debouncedFetchInvoices(); // Use debounced function
//     },
//     { deep: true }
//   );

  const setPaginationObj = (val: number) => {
    if (metadata.value.page !== val) {
      metadata.value.page = val;
    }
  };

  onMounted(() => {
    fetchInvoices();
  });

  onBeforeUnmount(() => {
    debouncedFetchInvoices.cancel();
  });

  return {
    fetchInvoices,
    fetching,
    invoicesList,
    metadata,
  };
};
