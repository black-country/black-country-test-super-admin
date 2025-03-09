// import { settings_api } from '@/api_factory/modules/settings'
// import { useCustomToast } from '@/composables/core/useCustomToast';
// const { showToast } = useCustomToast();
// const loading = ref(false);

// const savingAsDraft = ref(false)

// const createPayload = ref({
//     subject: "",
//     notificationType: "", // immediate | reminder | scheduled
//     scheduleStartDate: "", // optional
//     recipientType: "", // TENANT | AGENT | SERVICE_PROVIDER
//     recipients: [
//         ""
//     ], 
//     message: {
//         coverImageUrl: "",
//         subject: "",
//         htmlContent: "",
//         attachments: []
//     },
//     metadata: {
//         houseId: ""
//     },
//     status: "" // draft | pending | sent
// })

// export const useCreateSchedule = () => {
    
//     const  createSchedule = async () => {
//         loading.value = true;
//         const res = await settings_api.$_create_schedules(createPayload.value) as any
//         if(res.type !== 'ERROR'){
//            showToast({
//                 title: "Success",
//                 message: 'Schedule was created successfully',
//                 toastType: "success",
//                 duration: 3000
//             });
//            window.location.href = "/dashboard/settings"
//         } else {
//             showToast({
//                 title: "Error",
//                 message: res.data.error ?? 'Something went wrong while saving schedule',
//                 toastType: "error",
//                 duration: 3000
//             });  
//         }
//         loading.value = false;

//     };

//     const  saveAndExitSchedule = async () => {
//         savingAsDraft.value = true;
//         const res = await settings_api.$_create_schedules(createPayload.value) as any
//         if(res.type !== 'ERROR'){
//            showToast({
//                 title: "Success",
//                 message: 'Schedule was successfully saved as draft',
//                 toastType: "success",
//                 duration: 3000
//             });
//            window.location.href = "/dashboard/settings"
//         } else {
//             showToast({
//                 title: "Error",
//                 message: res.data.error ?? 'Something went wrong while saving schedule',
//                 toastType: "error",
//                 duration: 3000
//             });  
//             window.location.href = "/dashboard/settings"
//         }
//         savingAsDraft.value = false;

//     };

//     const setPayload = (data: any) => {
//         createPayload.value.subject = data.subject ?? ''
//         createPayload.value.notificationType = data.notificationType ?? ''
//         createPayload.value.scheduleStartDate = data.scheduleStartDate ?? ''
//         createPayload.value.recipientType = data.recipientType ?? ''
//         createPayload.value.recipients = data.recipients ?? []
//         createPayload.value.message = data.message ?? {}
//         createPayload.value.metadata = data.metadata ?? {}
//         createPayload.value.status = data.status ?? ''
//     }

//     return { createSchedule, savingAsDraft, saveAndExitSchedule,  setPayload, loading, createPayload };
// };

import { settings_api } from '@/api_factory/modules/settings'
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useRoute } from 'vue-router';
const { showToast } = useCustomToast();
const loading = ref(false);

const savingAsDraft = ref(false);

const createPayload = ref({
    subject: "",
    notificationType: "", // immediate | reminder | scheduled
    scheduleStartDate: "", // optional
    recipientType: "", // TENANT | AGENT | SERVICE_PROVIDER
    recipients: [
        ""
    ],
    message: {
        coverImageUrl: "",
        subject: "",
        htmlContent: "",
        attachments: []
    },
    metadata: {
        houseId: ""
    },
    status: "" // draft | pending | sent
});

export const useCreateSchedule = () => {
    const route = useRoute();

    const preparePayload = () => {
        const payload = { ...createPayload.value };
        if (route.query.notification === "immediate") {
            delete payload.scheduleStartDate; // Remove scheduleStartDate for immediate notifications
        }
        return payload;
    };

    const createSchedule = async () => {
        loading.value = true;
        const payload = preparePayload();
        const res = await settings_api.$_create_schedules(payload) as any;
        if (res.type !== 'ERROR') {
            showToast({
                title: "Success",
                message: 'Schedule was created successfully',
                toastType: "success",
                duration: 3000
            });
            window.location.href = "/admin/dashboard/settings/notification-success";
        } else {
            showToast({
                title: "Error",
                message: res.data.error ?? 'Something went wrong while saving schedule',
                toastType: "error",
                duration: 3000
            });
        }
        loading.value = false;
    };

    const saveAndExitSchedule = async () => {
        savingAsDraft.value = true;
        const payload = preparePayload();
        const res = await settings_api.$_create_schedules(payload) as any;
        if (res.type !== 'ERROR') {
            showToast({
                title: "Success",
                message: 'Schedule was successfully saved as draft',
                toastType: "success",
                duration: 3000
            });
            window.location.href = "/dashboard/settings";
        } else {
            showToast({
                title: "Error",
                message: res.data.error ?? 'Something went wrong while saving schedule',
                toastType: "error",
                duration: 3000
            });
            window.location.href = "/dashboard/settings";
        }
        savingAsDraft.value = false;
    };

    const setPayload = (data: any) => {
        createPayload.value.subject = data.subject ?? '';
        createPayload.value.notificationType = data.notificationType ?? '';
        createPayload.value.scheduleStartDate = data.scheduleStartDate ?? '';
        createPayload.value.recipientType = data.recipientType ?? '';
        createPayload.value.recipients = data.recipients ?? [];
        createPayload.value.message = data.message ?? {};
        createPayload.value.metadata = data.metadata ?? {};
        createPayload.value.status = data.status ?? '';
    };

    return { createSchedule, savingAsDraft, saveAndExitSchedule, setPayload, loading, createPayload };
};
