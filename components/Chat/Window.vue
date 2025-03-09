<!-- <template>
  <div class="flex-1 z-10 overflow-y-auto p-4 space-y-3 bg-white">
    <div v-for="(msg, index) in sortedMessagesWithHeaders" :key="msg.id || msg.dateHeader">
      <div v-if="msg.isHeader" class="text-center my-6">
        <span class="bg-[#F0F2F5] rounded-full font-semibold px-3 py-2 text-xs text-[#1D2739]">
          {{ msg.dateHeader }}
        </span>
      </div>
      <ChatMessageBubble
        v-else
        :message="msg"
        :isMine="msg.senderId === user.id"
        :status="msg.status"
        :messages="messages"
      />
    </div>
    <div ref="scrollAnchor"></div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';
import { useUser } from "@/composables/auth/user";

const { user } = useUser();
const props = defineProps({
  messages: Array,
  roomChats: Array
});

const chatContainer = ref(null);
const scrollAnchor = ref(null);
const isInitialRender = ref(true);

// Merge messages and roomChats, then sort and add date headers
const sortedMessagesWithHeaders = computed(() => {
  const allMessages = [...props.messages, ...props.roomChats];
  const sorted = allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const messagesWithHeaders = [];
  let lastDateHeader = '';

  sorted.forEach((msg) => {
    const messageDate = formatMessageDate(msg.createdAt);

    // Add a date header if it differs from the last one
    if (messageDate !== lastDateHeader) {
      messagesWithHeaders.push({ isHeader: true, dateHeader: messageDate });
      lastDateHeader = messageDate;
    }
    messagesWithHeaders.push(msg);
  });

  return messagesWithHeaders;
});

// Helper to format dates into "Today", "Yesterday", or a full date
const formatMessageDate = (date: string): string => {
  const today = moment().startOf('day');
  const messageDate = moment(date);

  if (messageDate.isSame(today, 'day')) {
    return 'Today';
  } else if (messageDate.isSame(today.clone().subtract(1, 'days'), 'day')) {
    return 'Yesterday';
  } else {
    return messageDate.format('MMMM D, YYYY');
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (scrollAnchor.value) {
    scrollAnchor.value.scrollIntoView({ behavior: 'auto' });
  }
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    requestAnimationFrame(() => {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    });
  }
};

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  await scrollToBottom();
  setTimeout(async () => {
    await scrollToBottom();
    isInitialRender.value = false;
  }, 500);
});

watch(() => [...(props.messages || []), ...(props.roomChats || [])], async () => {
  if (isInitialRender.value) return;
  await scrollToBottom();
}, { deep: true });

watch(() => sortedMessagesWithHeaders.value.length, async () => {
  if (isInitialRender.value) return;
  await scrollToBottom();
});
</script> -->


<template>
  <div class="flex-1 z-10 overflow-y-auto p-4 space-y-3 bg-white">
    <div v-for="(msg, index) in sortedMessagesWithHeaders" :key="msg.id || msg.dateHeader">
      <!-- Display date headers -->
      <div v-if="msg.isHeader" class="text-center my-6">
        <span class="bg-[#F0F2F5] rounded-full font-semibold px-3 py-2 text-xs text-[#1D2739]">
          {{ msg.dateHeader }}
        </span>
      </div>
      
      <!-- Display chat messages -->
      <ChatMessageBubble
        v-else
        :message="msg"
        :isMine="msg.senderId === user.id"
        :status="msg.status"
        :messages="messages"
      />
    </div>
    <div ref="scrollAnchor"></div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { computed } from 'vue';
import { useUser } from "@/composables/auth/user";

const { user } = useUser();
const props = defineProps({
  messages: Array,
  roomChats: Array
});

const chatContainer = ref(null);
const scrollAnchor = ref(null);
const isInitialRender = ref(true);

// Merge messages and roomChats, then sort and add date headers
const sortedMessagesWithHeaders = computed(() => {
  const allMessages = [...props.messages, ...props.roomChats];
  const sorted = allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const messagesWithHeaders = [];
  let lastDateHeader = '';

  sorted.forEach((msg) => {
    const messageDate = formatMessageDate(msg.createdAt);

    // Add a date header if it differs from the last one
    if (messageDate !== lastDateHeader) {
      messagesWithHeaders.push({ isHeader: true, dateHeader: messageDate });
      lastDateHeader = messageDate;
    }
    messagesWithHeaders.push(msg);
  });

  return messagesWithHeaders;
});

// Helper to format dates into "Today", "Yesterday", or a full date
const formatMessageDate = (date: string): string => {
  const today = moment().startOf('day');
  const messageDate = moment(date);

  if (messageDate.isSame(today, 'day')) {
    return 'Today';
  } else if (messageDate.isSame(today.clone().subtract(1, 'days'), 'day')) {
    return 'Yesterday';
  } else {
    return messageDate.format('MMMM D, YYYY');
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (scrollAnchor.value) {
    scrollAnchor.value.scrollIntoView({ behavior: 'auto' });
  }
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    requestAnimationFrame(() => {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    });
  }
};

onMounted(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  await scrollToBottom();
  setTimeout(async () => {
    await scrollToBottom();
    isInitialRender.value = false;
  }, 500);
});

watch(() => [...(props.messages || []), ...(props.roomChats || [])], async () => {
  if (isInitialRender.value) return;
  await scrollToBottom();
}, { deep: true });

watch(() => sortedMessagesWithHeaders.value.length, async () => {
  if (isInitialRender.value) return;
  await scrollToBottom();
});
</script>
