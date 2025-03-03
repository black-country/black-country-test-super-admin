<template>
  <div class="bg-white rounded-lg w-full">
    <!-- {{property}} -->
    <CoreVue3Signature
      @savedSignature="handleUploadedSignature"
      @signature="handleSignature"
      class="w-full"
    />
    <div class="mt-6 flex justify-between gap-x-6 pb-4">
      <button
        @click="emit('close')"
        class="bg-[#EBE5E0] text-[#292929] w-full text-sm px-6 py-3 rounded-lg"
      >
        Reset
      </button>
      <button
        type="button"
        :disabled="loading"
        @click="submitSignature"
        class="bg-[#292929] disabled:cursor-not-allowed disabled:opacity-25 w-full text-sm text-white px-6 py-3 rounded-lg"
      >
        {{ loading ? "signing...." : "Submit" }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSignLease } from "@/composables/modules/lease/sign";
import { useUser } from "@/composables/auth/user";
import { useCustomToast } from "@/composables/core/useCustomToast";
import { use_update_profile } from '@/composables/auth/updateProfile';
const { user } = useUser();
const { signLeaseAgreement, loading } = useSignLease();
const { showToast } = useCustomToast();
const signatureObj = ref({}) as any;
const { credential, updateProfile, loading: updating } = use_update_profile();


const payload = ref({
  signature: "",
  signatureObj: ""
});

const property = JSON.parse(localStorage.getItem("selected-property"));

//   const props = defineProps({
//   property: {
//     type: Object
//   }
// })

const emit = defineEmits(["close", "agreementData"]);

// const submitSignature = () => {
//   console.log(payload.value, 'ooo')
//   emit('agreementData', payload.value)
//   emit('close')
// }

const submitSignature = async () => {
  emit("agreementData", payload.value);
  emit('close');
  // try {
  //   // Create the payload object with optional signee name and signature URL
  //   // const payloadObj = {
  //   //   houseOwnerSigneeName:
  //   //     `${user?.value?.firstName} ${user?.value?.lastName}` || "",
  //   //   houseOwnerSignatureUrl: signatureObj?.value?.url || "",
  //   // };

  //   const adminSignPayload = {
  //     // leaseAgreement: "<html></html>",
  //     isPublished: true,
  //     houseOwnerSigneeName:  `${user?.value?.firstName} ${user?.value?.lastName}` || "",
  //     houseOwnerSignatureUrl: signatureObj?.value?.url || ""
  //   };

  //   // Check if the signature URL is valid before proceeding
  //   if (!payloadObj.landlordSignatureUrl) {
  //     showToast({
  //       title: "Error",
  //       message: "Signature URL is missing",
  //       toastType: "error",
  //       duration: 3000,
  //     });
  //   }

  //   // Ensure the rentalLeaseAgreement ID exists before making the API call
  //   const rentalLeaseAgreementId =
  //     property?.rentalApplication?.rentalLeaseAgreement?.id;
  //   if (!rentalLeaseAgreementId) {
  //     showToast({
  //       title: "Error",
  //       message: "Rental Lease Agreement ID is missing",
  //       toastType: "error",
  //       duration: 3000,
  //     });
  //   }

  //   // Perform the API call to sign the lease agreement
  //   signLeaseAgreement(rentalLeaseAgreementId, payloadObj)
  //     .then((res) => {
  //       console.log(res);
  //       if (res.type !== "ERROR") {
  //         emit("agreementData", payload.value);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error, "error here");
  //     });
  //   // emit('agreementData', payload.value)
  //   // Emit the 'close' event after a successful submission
  //   // emit('close');
  // } catch (error) {
  //   showToast({
  //     title: "Error",
  //     message: "Error submitting signature",
  //     toastType: "error",
  //     duration: 3000,
  //   });
  // }
};

const handleSignature = (data: any) => {
  payload.value.signature = data;
};

const handleUploadedSignature = (data: any) => {
  console.log(data.url, "uploaded sign data");
  localStorage.setItem('lease-signature-url', data.url)
  payload.value.signatureObj = data;
  updateProfile({
    signatureUrl : data.url
  })
};
</script>

<style scoped>
canvas {
  border: 1px solid #ddd;
}
</style>
