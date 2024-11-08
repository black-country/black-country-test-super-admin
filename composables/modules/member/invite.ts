import { member_api } from "@/api_factory/modules/member";
import { useRouter, useNuxtApp } from '#imports';

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
            $toast.error('Please add at least one member to invite.', {
                autoClose: 5000,
                dangerouslyHTMLString: true,
            });
            return;
        }

        loading.value = true;

        try {
            const response = await member_api.$_invite_member({ invitees: memberList.value });
            
            if (response?.type !== "ERROR") {
                $toast.success('Invite was sent successfully', {
                    autoClose: 5000,
                    dangerouslyHTMLString: true,
                });
                router.push("/dashboard/members/invite-success");
                window.location.href = "/dashboard/members/invite-success"
            } else {
                // Handle API error response
                $toast.error('Failed to send invites. Please try again.', {
                    autoClose: 5000,
                    dangerouslyHTMLString: true,
                });
            }
        } catch (error: any) {
            if (error.response) {
                const errorMessage = error.response.data?.message || 'An error occurred while sending the invites.';
                const errorDetails = error.response.data?.errors || [];
                $toast.error(errorMessage, {
                    autoClose: 5000,
                    dangerouslyHTMLString: true,
                });
            } else if (error.request) {
                console.error('No response received:', error.request);
                $toast.error('No response from the server. Please check your network connection.', {
                    autoClose: 5000,
                    dangerouslyHTMLString: true,
                });
            } else {
                console.error('Error:', error.message);
                $toast.error(`Unexpected error: ${error.message}`, {
                    autoClose: 5000,
                    dangerouslyHTMLString: true,
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
