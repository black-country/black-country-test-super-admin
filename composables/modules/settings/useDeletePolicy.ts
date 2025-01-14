// // import { settings_api } from '@/api_factory/modules/settings'
// // import { useCustomToast } from '@/composables/core/useCustomToast'
// // import { useFetchPolicy } from '@/composables/modules/settings/useFetchPolicy'
// // const { showToast } = useCustomToast();
// // const { fetchPolicy } = useFetchPolicy()
// // const loading = ref(false)
// // const route = useRoute();
// // const router = useRouter();

// // const payload = ref({
// //     ids: []
// //  })
// // export const useDeletePolicy = () => {
// //     const deletePolicy = async () => {
// //         loading.value = true
// //         const res = await  settings_api.$_batch_delete_policy({
// //             "ids": ["31b8c606-9913-4152-876d-83d37fc87c40"]
// //          }) as any

// //         if (res.type !== 'ERROR') {
// //             showToast({
// //                 title: "Success",
// //                 message: "Policies was deleted successfully",
// //                 toastType: "success",
// //                 duration: 3000
// //               });
// //               fetchPolicy()
// //               window.location.reload();
// //         }
// //         loading.value = false
// //     }

// //     const setPayload = (data: any) => {
// //         payload.value.ids = data
// //     }

// //     return { deletePolicy, loading, setPayload }
// // }


// import axios from 'axios';
// import { ref } from 'vue';
// import { useCustomToast } from '@/composables/core/useCustomToast'
// import { useFetchPolicy } from '@/composables/modules/settings/useFetchPolicy'
// const { fetchPolicy } = useFetchPolicy()

// export const useDeletePolicy = () => {
//   const loading = ref(false);
//   const payload = ref({ ids: [] });
//   const { showToast } = useCustomToast()

//   const deletePolicy = async () => {
//     loading.value = true;

//     axios.request({
//         method: 'DELETE',
//         url: 'https://dev.api.blackcountry.africa//v1/policies/batch',
//         data: {
//           key: 'value'
//         }
//       }).then(response => {
//         console.log(response.data);
//       }).catch(error => {
//         console.error(error);
//       });

//     // try {
//     //   const response = await axios.delete('https://example.com/api/delete-policy', {
//     //     data: { ids: payload.value.ids }, // Pass the payload in the `data` field
//     //   });

//     //   if (response.data.type !== 'ERROR') {
//     //     showToast({
//     //       title: "Success",
//     //       message: "Policies were deleted successfully",
//     //       toastType: "success",
//     //       duration: 3000,
//     //     });

//     //     fetchPolicy(); // Assuming `fetchPolicy` is available in your context
//     //     window.location.reload();
//     //   } else {
//     //     console.error('Error response:', response.data);
//     //   }
//     // } catch (error: any) {
//     //   console.error('Error deleting policies:', error.response?.data || error.message);
//     // } finally {
//     //   loading.value = false;
//     // }
//   };

//   const setPayload = (data: any) => {
//     payload.value.ids = data;
//   };

//   return { deletePolicy, loading, setPayload };
// };


import axios from 'axios';
import { ref } from 'vue';
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useFetchPolicy } from '@/composables/modules/settings/useFetchPolicy'
import { useUser } from "@/composables/auth/user";
const { fetchPolicy } = useFetchPolicy()
const { token } = useUser();

export const useDeletePolicy = () => {
  const loading = ref(false);
  const payload = ref({ ids: [] });
  const { showToast } = useCustomToast()

  const deletePolicy = async () => {
    loading.value = true;

    try {
        const response = await axios.request({
          method: 'DELETE',
          url: 'https://dev.api.blackcountry.africa/v1/policies/batch', // Removed extra `/` in the URL
          headers: {
            Authorization: `Bearer ${token.value}`, // Ensure token is properly passed
          },
          data: {
            ids: payload.value.ids, // Pass the payload as data
          },
        });
      
        console.log(response.data);
      
        if (response.data.type !== 'ERROR') {
          showToast({
            title: "Success",
            message: "Policies were deleted successfully",
            toastType: "success",
            duration: 3000,
          });
      
          if (typeof fetchPolicy === "function") {
            fetchPolicy(); // Ensure fetchPolicy exists before calling it
          } else {
            console.warn("fetchPolicy function is not defined.");
          }
      
        //   window.location.reload();
        } else {
          console.error('Error response:', response.data);
        }
      } catch (error) {
        console.error('Error deleting policies:', error.response?.data || error.message);
      } finally {
        loading.value = false;
      }
      
  };

  const setPayload = (data: any) => {
    payload.value.ids = data;
  };

  return { deletePolicy, loading, setPayload };
};
