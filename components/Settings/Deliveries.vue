<!-- <script setup lang="ts">
interface User {
  id: number;
  name: string;
  notificationDelivered: boolean;
  selected: boolean;
}

const users = ref<User[]>([
  { id: 1, name: 'Conrad Lebsack', notificationDelivered: true, selected: false },
  { id: 2, name: 'Olive Lubowitz', notificationDelivered: false, selected: false },
  { id: 3, name: 'Teresa Kilback', notificationDelivered: true, selected: false },
  { id: 4, name: 'Armando Koch', notificationDelivered: true, selected: false },
  { id: 5, name: 'Rufus Sipes', notificationDelivered: true, selected: false },
  { id: 6, name: 'Kelly Koch', notificationDelivered: false, selected: false },
  { id: 7, name: 'Samantha Corwin', notificationDelivered: true, selected: false },
  { id: 8, name: 'Leon Keeling-Cremin', notificationDelivered: true, selected: false },
]);

const selectedUsers = computed(() => {
  return users.value.filter(user => user.selected && !user.notificationDelivered);
});

const canResend = computed(() => selectedUsers.value.length > 0);

const toggleUser = (user: User) => {
  if (!user.notificationDelivered) {
    user.selected = !user.selected;
  }
};

const resendNotifications = () => {
  // Handle resending notifications to selected users
  console.log('Resending notifications to:', selectedUsers.value);
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 bg-white rounded-lg">

    <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-medium text-[#1D2739]">Notification Delivery</h2>
              <button
                @click="resendNotifications"
        :disabled="!canResend"
              class="text-gray-400  enabled:bg-gray-800 enabled:text-white hover:text-gray-600 bg-[#F0F2F5] disabled:opacity-50 disabled:cursor-not-allowed text-[#545454] px-4 py-2.5 text-sm rounded-lg">Resend</button>
            </div>

    <div class="space-y-4">
      <div
        v-for="user in users"
        :key="user.id"
        class="flex items-center justify-between space-x-3 py-2"
      >
        <div class="flex items-center space-x-3">
            <div
          @click="toggleUser(user)"
          class="w-5 h-5 rounded border border-gray-300 flex items-center justify-center cursor-pointer"
          :class="{
            'bg-white': !user.selected && !user.notificationDelivered,
            'bg-gray-50': user.notificationDelivered,
            'bg-green-50': user.selected && !user.notificationDelivered
          }"
        >
          <svg
            v-if="user.selected || user.notificationDelivered"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            :class="{
              'text-gray-400': user.notificationDelivered,
              'text-green-500': user.selected && !user.notificationDelivered
            }"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <span class="text-gray-800 text-sm">{{ user.name }}</span>
        </div>

       <div>
        <svg v-if="!user.notificationDelivered" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.16797 12.082C4.16797 12.082 5.41797 12.082 7.08464 14.9987C7.08464 14.9987 11.717 7.35981 15.8346 5.83203" stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <svg v-if="user.notificationDelivered" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.2">
            <path d="M4.16797 12.082C4.16797 12.082 5.41797 12.082 7.08464 14.9987C7.08464 14.9987 11.717 7.35981 15.8346 5.83203" stroke="#326543" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            </svg>

       </div>

      </div>
    </div>
  </div>
</template> -->

<script setup lang="ts">
import { useFetchSchedules } from '@/composables/modules/settings/useFetchDeliveries'

interface Attachment {
  path: string;
  filename: string;
}

interface Recipient {
  email: string;
  userId: string;
  userType: string;
}

interface Sender {
  name: string;
  id: string;
}

interface Metadata {
  attachments: Attachment[];
  propertyName: string;
  propertyAddress: string;
  houseId: string;
  house: null;
  subject: string;
  htmlContent: string;
  coverImageUrl: string;
  firstName: string;
  lastName: string;
  type: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface NotificationDelivery {
  id: string;
  notificationId: string;
  channel: string;
  recipient: Recipient;
  retryCount: number;
  template: string;
  sender: Sender;
  metadata: Metadata;
  status: 'failed' | 'successful' | 'pending';
  response: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  selected?: boolean;
}

const { loadingDeliveries, deliveriesList } = useFetchSchedules()

const notifications = computed(() => {
  return deliveriesList.value.map(delivery => ({
    ...delivery,
    selected: false
  }));
});

const selectedNotifications = computed(() => {
  return notifications.value.filter(
    notification => notification.selected && notification.status === 'failed'
  );
});

const canResend = computed(() => selectedNotifications.value.length > 0);

const toggleNotification = (notification: NotificationDelivery) => {
  if (notification.status === 'failed') {
    notification.selected = !notification.selected;
  }
};

const resendNotifications = async () => {
  try {
    const notificationsToResend = selectedNotifications.value;
    console.log('Resending notifications to:', notificationsToResend);
    
    // Replace with your actual resend logic
    // await Promise.all(
    //   notificationsToResend.map(notification =>
    //     fetch(`/api/notifications/${notification.id}/resend`, {
    //       method: 'POST'
    //     })
    //   )
    // );
  } catch (error) {
    console.error('Error resending notifications:', error);
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 bg-white rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-base font-medium text-[#1D2739]">Notification Delivery</h2>
      <button
        @click="resendNotifications"
        :disabled="!canResend"
        class="text-gray-400 enabled:bg-gray-800 enabled:text-white hover:text-gray-600 bg-[#F0F2F5] disabled:opacity-50 disabled:cursor-not-allowed text-[#545454] px-4 py-2.5 text-sm rounded-lg"
      >
        Resend
      </button>
    </div>

    <div v-if="loadingDeliveries" class="flex justify-center py-4">
      <span class="text-gray-500">Loading...</span>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="flex items-center justify-between space-x-3 py-2"
      >
        <div class="flex items-center space-x-3">
          <div
            @click="toggleNotification(notification)"
            class="w-5 h-5 rounded border border-gray-300 flex items-center justify-center"
            :class="{
              'cursor-pointer': notification.status === 'failed',
              'cursor-not-allowed': notification.status !== 'failed',
              'bg-white': !notification.selected && notification.status === 'failed',
              'bg-gray-50': notification.status !== 'failed',
              'bg-green-50': notification.selected && notification.status === 'failed'
            }"
          >
            <svg
              v-if="notification.selected || notification.status === 'successful'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              :class="{
                'text-gray-400': notification.status !== 'failed',
                'text-green-500': notification.selected && notification.status === 'failed'
              }"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <span class="text-gray-800 text-sm">{{ notification.user.firstName }} {{ notification.user.lastName }}</span>
        </div>

        <div>
          <svg
            v-if="notification.status === 'failed'"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.16797 12.082C4.16797 12.082 5.41797 12.082 7.08464 14.9987C7.08464 14.9987 11.717 7.35981 15.8346 5.83203"
              stroke="#326543"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <svg
            v-if="notification.status === 'successful'"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.2">
              <path
                d="M4.16797 12.082C4.16797 12.082 5.41797 12.082 7.08464 14.9987C7.08464 14.9987 11.717 7.35981 15.8346 5.83203"
                stroke="#326543"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>