import { member_api } from "@/api_factory/modules/member";
import { useRouter, useNuxtApp } from '#imports';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

// Define TypeScript interfaces for better type checking
interface Invitee {
    email: string;
    role: "AGENT" | "SERVICE_PROVIDER" | "PROPERTY_MANAGER" | "SUPER_ADMIN";
}

export const useInviteMember = () => {
    const memberList = ref<Invitee[]>([]);
    const loading = ref(false);
    const router = useRouter();
    const { $toast } = useNuxtApp();

    const handleInvite = async () => {
        if (memberList.value.length === 0) {
            showToast({
                title: "Error",
                message: "Please add at least one member to invite.",
                toastType: "error",
                duration: 3000
              });
            return;
        }

        loading.value = true;

        try {
            const response = await member_api.$_invite_member({ invitees: memberList.value });
            
            if (response?.type !== "ERROR") {

                showToast({
                    title: "Success",
                    message: "Invite was sent successfully.",
                    toastType: "success",
                    duration: 3000
                  });
                router.push("/dashboard/members/invite-success");
                window.location.href = "/dashboard/members/invite-success"
            } else {
                showToast({
                    title: "Error",
                    message: "Failed to send invites. Please try again.",
                    toastType: "error",
                    duration: 3000
                  });
            }
        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data?.message || 'An error occurred while sending the invites.';
                showToast({
                    title: "Error",
                    message: errorMessage,
                    toastType: "error",
                    duration: 3000
                  });
            } else if (error.request) {
                showToast({
                    title: "Error",
                    message: 'No response from the server. Please check your network connection.',
                    toastType: "error",
                    duration: 3000
                  });
            } else {
                showToast({
                    title: "Error",
                    message: `Unexpected error: ${error.message}`,
                    toastType: "error",
                    duration: 3000
                  });
            }
        } finally {
            loading.value = false;
        }
    };

    const setMemberList = (data: Invitee[]) => {
        memberList.value = data;
    };

    return { setMemberList, memberList, handleInvite, loading };
};
