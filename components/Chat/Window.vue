<template>
  <div ref="chatContainer" class="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-white">
    <!-- Loading state -->
    <div v-if="loading && !sortedMessages.length" class="flex justify-center items-center h-full">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!sortedMessages.length" class="flex flex-col items-center justify-center h-full text-center">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="none" class="mb-4">
        <circle cx="50" cy="50" r="40" fill="#F0F2F5"/>
        <path d="M50 35v20M50 65h.01" stroke="#9CA3AF" stroke-width="3" stroke-linecap="round"/>
      </svg>
      <h3 class="text-lg font-semibold text-gray-700">No messages yet</h3>
      <p class="text-sm text-gray-500 mt-2">Start the conversation by sending a message</p>
    </div>

    <!-- Messages - ALWAYS RENDERED -->
    <div v-else class="space-y-2 pb-4">
      <TransitionGroup name="message">
        <!-- {{ user }} -->
        <div v-for="(item, index) in sortedMessages" :key="item.id || `header-${index}`">
          <!-- {{ item }} -->
          <div v-if="item.isHeader" class="flex justify-center my-6">
            <span class="bg-gray-100 rounded-full px-4 py-1.5 text-xs font-medium text-gray-600">
              {{ item.date }}
            </span>
          </div>

          <!-- :is-mine="item.isMine === user.id" -->
          <ChatMessageBubble
            v-else
            :message="item"
            :is-mine="item.senderId === user.id"
            :status="item.status"
          />
          <!-- {{ item?.isMine }} -->
        </div>
      </TransitionGroup>
      
      <!-- Scroll anchor -->
      <div ref="scrollAnchor" class="h-px"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useUser } from '@/composables/auth/user';
import moment from 'moment';

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const { user } = useUser();
const chatContainer = ref<HTMLElement | null>(null);
const scrollAnchor = ref<HTMLElement | null>(null);
const userScrolledUp = ref(false);
const lastMessageCount = ref(0);
const isFirstLoad = ref(true);
const route = useRoute()
const agentId = ref(route.query.agentId)

const sortedMessages = computed(() => {
  const messages = props.messages || [];
  if (!messages.length) return [];

  // Sort messages by creation time
  const sorted = [...messages].sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Add date headers
  const withHeaders: any[] = [];
  let lastDate = '';

  sorted.forEach(msg => {
    const msgDate = formatDateHeader(msg.createdAt);
    
    if (msgDate !== lastDate) {
      withHeaders.push({
        isHeader: true,
        date: msgDate,
        id: `header-${msg.createdAt}`
      });
      lastDate = msgDate;
    }
    
    withHeaders.push(msg);
  });

  return withHeaders;
});

const formatDateHeader = (dateString: string): string => {
  const date = moment(dateString);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');

  if (date.isSame(today, 'day')) return 'Today';
  if (date.isSame(yesterday, 'day')) return 'Yesterday';
  return date.format('MMMM D, YYYY');
};

const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
  if (!chatContainer.value) return;
  
  requestAnimationFrame(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTo({
        top: chatContainer.value.scrollHeight,
        behavior
      });
    }
  });
};

const isNearBottom = (): boolean => {
  if (!chatContainer.value) return true;
  
  const { scrollTop, scrollHeight, clientHeight } = chatContainer.value;
  const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
  
  return distanceFromBottom < 150;
};

const handleScroll = () => {
  userScrolledUp.value = !isNearBottom();
};

onMounted(() => {
  if (chatContainer.value) {
    chatContainer.value.addEventListener('scroll', handleScroll, { passive: true });
  }
  
  // Initial scroll
  nextTick(() => {
    scrollToBottom('auto');
    setTimeout(() => {
      isFirstLoad.value = false;
    }, 500);
  });
});

// Watch for new messages
watch(() => props.messages.length, (newCount, oldCount) => {
  if (isFirstLoad.value) {
    lastMessageCount.value = newCount;
    return;
  }
  
  if (newCount === oldCount || newCount === 0) return;
  
  const isNewMessage = newCount > oldCount;
  const wasAtBottom = !userScrolledUp.value;
  
  // Check if last message is mine
  const lastMessage = props.messages[props.messages.length - 1];
  const isMyMessage = lastMessage?.senderId === user.value?.id;
  
  nextTick(() => {
    if (isMyMessage || wasAtBottom) {
      scrollToBottom(isMyMessage ? 'auto' : 'smooth');
    }
  });
  
  lastMessageCount.value = newCount;
}, { flush: 'post' });

// Watch for message updates (status changes)
watch(() => props.messages.map(m => m.status).join(','), () => {
  if (isFirstLoad.value) return;
  
  if (!userScrolledUp.value && isNearBottom()) {
    nextTick(() => scrollToBottom('auto'));
  }
});
</script>

<style scoped>
.message-enter-active {
  transition: all 0.2s ease-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.message-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>