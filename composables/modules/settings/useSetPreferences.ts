import { settings_api } from "@/api_factory/modules/settings";
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
const loading = ref(false)
const payload = ref({
    notifications: {
        listingCreated: false,
        listingUpdated: true,
        visitationScheduled: true,
        visitationReminder: true,
        rentalApplication: true,
        maintenanceRequest: true,
        userRegistration: true,
        newMessage: true,
        pushAndInappNotification: true
    }
})

export const useSetPreferences = () => {
	const setPreferences = async () => {
		loading.value = true
		const res = await  settings_api.$_create_notification_preferences(payload.value) as any
		console.log(res, 'bank accounts here')
        if (res.type !== 'ERROR') {
            showToast({
                title: "Success",
                message: 'Notification preference was updated successfully.',
                toastType: "success",
                duration: 3000
              });
        }
        loading.value = false
	}

    const setPayload = (data: any) => {
       payload.value.notifications = data.notifications
    }


	return { setPreferences, loading, payload, setPayload }
}
