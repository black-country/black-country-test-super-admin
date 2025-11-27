<template>
  <MessagingView>
    <div class="fixed inset-0 flex flex-col lg:relative lg:h-screen">
      <!-- Top spacer -->
      <div class="w-full h-32 bg-white flex-shrink-0 hidden lg:block"></div>
      
      <!-- Main chat area -->
      <div class="flex-1 flex lg:flex-row flex-col lg:-mt-32 overflow-hidden">
        <!-- Sidebar -->
        <div
          class="w-full lg:w-[350px] border-r border-gray-200 flex flex-col bg-white fixed lg:relative z-50 inset-0 lg:inset-auto transition-transform duration-300"
          :class="{
            '-translate-x-full': !showSidebar && !isDesktop,
            'translate-x-0': showSidebar || isDesktop,
          }">
          
          <!-- Mobile header -->
          <section class="lg:hidden flex items-center justify-between w-full px-4 py-3 border-b">
            <div class="flex items-center gap-3">
              <button @click="showSidebar = false" class="p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <p class="font-semibold">Messages</p>
            </div>
          </section>

          <!-- Search and filter -->
          <div class="flex items-center gap-2 p-4 border-b">
            <div class="relative flex-1 bg-[#EAEAEA] rounded-lg px-3 py-2">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 20 20">
                <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" fill="currentColor"/>
              </svg>
              <input
                v-model="searchTerm"
                type="text"
                class="w-full bg-transparent pl-8 pr-2 py-1 text-sm focus:outline-none"
                placeholder="Search conversations"
              />
            </div>
            
            <button @click="toggleMembers" ref="addButton" class="bg-[#EAEAEA] p-3 rounded-lg">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 5v10M5 10h10" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
            
            <div class="relative">
              <button @click="showFilterDropdown = !showFilterDropdown" class="bg-[#EAEAEA] p-3 rounded-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 5.83h15M2.5 10h15M2.5 14.17h15" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </button>
              
              <div v-if="showFilterDropdown" class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-20">
                <button
                  v-for="option in ['all', 'read', 'unread']"
                  :key="option"
                  @click="filterStatus = option; showFilterDropdown = false"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 capitalize"
                  :class="{ 'bg-gray-100': filterStatus === option }">
                  {{ option }}
                </button>
              </div>
            </div>
          </div>

          <!-- User list -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="filteredChats.length" class="p-2">
              <button
                v-for="chat in filteredChats"
                :key="chat.id"
                @click="selectChat(chat)"
                class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                :class="{ 'bg-gray-100': selectedChat?.id === chat.id }">
                
                <img
                  v-if="chat.participant?.profilePicture"
                  :src="chat.participant.profilePicture"
                  class="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div v-else class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#666" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>

                <div class="flex-1 min-w-0 text-left">
                  <div class="flex justify-between items-start">
                    <p class="font-medium text-sm truncate">
                      {{ chat.participant?.firstName }} {{ chat.participant?.lastName }}
                    </p>
                    <span v-if="chat.lastMessage?.createdAt" class="text-xs text-gray-400 ml-2">
                      {{ formatTime(chat.lastMessage.createdAt) }}
                    </span>
                  </div>
                  
                  <div class="flex justify-between items-center mt-1">
                    <p class="text-sm text-gray-500 truncate">
                      {{ formatLastMessage(chat.lastMessage?.content) }}
                    </p>
                    <span v-if="chat.unreadMessagesCount > 0" class="ml-2 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  </div>
                </div>
              </button>
            </div>

            <div v-else-if="isInitialLoad && loadingChats" class="p-4">
              <div v-for="i in 3" :key="i" class="mb-4 animate-pulse">
                <div class="flex gap-3">
                  <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center p-8 text-center">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" class="mb-4">
                <circle cx="40" cy="40" r="40" fill="#F0F2F5"/>
                <path d="M40 30v20M40 55h.01" stroke="#9CA3AF" stroke-width="3" stroke-linecap="round"/>
              </svg>
              <p class="text-gray-600 font-medium">No conversations</p>
              <p class="text-gray-400 text-sm mt-1">Start chatting with someone</p>
            </div>
          </div>
        </div>

        <!-- Chat window -->
        <div class="flex-1 flex flex-col bg-white overflow-hidden" :class="{ 'hidden lg:flex': !selectedChat }">
          <!-- Chat header -->
          <div class="flex items-center justify-between p-4 border-b flex-shrink-0 bg-white z-10">
            <button @click="showSidebar = true" class="lg:hidden mr-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 12h18M3 6h18M3 18h18" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>

            <div v-if="selectedChat" class="flex items-center gap-3">
              <img
                v-if="selectedChat.participant?.profilePicture"
                :src="selectedChat.participant.profilePicture"
                class="w-10 h-10 rounded-full object-cover"
                alt=""
              />
              <div v-else class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#666" stroke-width="2"/>
                </svg>
              </div>
              <div>
                <p class="font-semibold text-sm">
                  {{ selectedChat.participant?.firstName }} {{ selectedChat.participant?.lastName }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ isConnected ? 'Online' : 'Offline' }}
                </p>
              </div>
            </div>
            <div v-else class="text-gray-400">Select a conversation</div>
          </div>

          <!-- Messages -->
          <ChatWindow
            v-if="selectedChat"
            :messages="currentMessages"
            :loading="loadingMessages"
            class="flex-1 min-h-0"
          />

          <!-- Message input -->
          <ChatMessageInput
            v-if="selectedChat"
            v-model="messageText"
            :is-connected="isConnected"
            :is-sending="isSending"
            @send-message="handleSendMessage"
            class="flex-shrink-0"
          />
        </div>
      </div>

      <!-- Members List Modal -->
      <div v-if="showMembersList" class="fixed inset-0 z-50 bg-black/50" @click="showMembersList = false">
        <div 
          class="absolute bg-white border-[0.5px] border-gray-100 rounded-xl ml-10 lg:ml-72 mt-16 w-80"
          :style="popoverStyle" 
          @click.stop>
          <div class="flex items-center justify-center">
            <input 
              type="text" 
              placeholder="Search" 
              v-model="payload.search"
              class="w-full mr-3 border my-2 px-2 py-1.5 bg-[#EAEAEA] text-gray-600 text-sm ml-2 focus:outline-none rounded-md"
            />
          </div>
          <div class="divide-y divide-gray-50">
            <div 
              class="space-y-4 max-h-96 divide-y divide-gray-100 overflow-y-auto scrollbar-visible py-4"
              @scroll="handleScroll" 
              ref="scrollContainer">
              <div 
                @click="handleSelectedMember(user)" 
                v-for="user in usersList" 
                :key="user.id"
                class="flex cursor-pointer px-4 items-center gap-4 pt-3 first:pt-0">
                <div>
                  <img 
                    v-if="user.profilePicture" 
                    :src="user.profilePicture"
                    class="w-10 h-10 rounded-full object-cover" 
                    alt=""
                  />
                  <div v-else class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="#666" stroke-width="2"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 text-sm">
                    {{ `${user.firstName ?? "--"} ${user.lastName ?? "--"}` }}
                  </h3>
                  <p class="text-gray-500 text-sm lowercase">
                    {{ user?.group || user?.type || user?.role }}
                  </p>
                </div>
              </div>
              <div v-if="loading" class="flex justify-center py-2">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
              <div v-if="!loading && usersList.length === 0" class="text-center text-gray-500 text-sm py-2">
                No users found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MessagingView>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onUnmounted } from 'vue';
import { useRouter, useRoute } from '#app';
import MessagingView from "@/layouts/MessagingView.vue"
import { useWebSocket } from '@/composables/modules/messages/sockets';
import { useGetActiveChats } from '@/composables/modules/messages/fetchActiveChats';
import { useGetRoomChats } from '@/composables/modules/messages/fetchRoomMessages';
import { useCreateRoom } from '@/composables/modules/messages/createRoom';
import { useFetchAllUsers } from "~/composables/modules/utils/fetchAllUsers";
import { useUser } from '@/composables/auth/user';
import moment from 'moment';

// ============================================
// COMPOSABLES & ROUTER
// ============================================
const router = useRouter();
const route = useRoute();
const { user } = useUser();

const {
  isConnected,
  sendMessage,
  messagesByRoom,
  setActiveRoom,
  markMessageAsRead,
  mergeMessages
} = useWebSocket();

const { loadingActiveChats: loadingChats, activeChatsList, getActiveChats } = useGetActiveChats();
const { getRoomChats, loadingRoomChats: loadingMessages, roomChatsList } = useGetRoomChats();
const { createRoom } = useCreateRoom();
const { fetchAllUsers, loading, payload, usersList, loadMore, hasMore } = useFetchAllUsers();

// ============================================
// STATE
// ============================================
const selectedChat = ref<any>(null);
const showSidebar = ref(false);
const isDesktop = ref(false);
const searchTerm = ref('');
const filterStatus = ref('all');
const showFilterDropdown = ref(false);
const messageText = ref('');
const isSending = ref(false);
const isInitialLoad = ref(true);
const cachedChats = ref<any[]>([]);
const showMembersList = ref(false);
const addButton = ref<HTMLElement | null>(null);
const scrollContainer = ref(null);
const popoverStyle = ref({
  top: "0px",
  left: "0px",
});

// ============================================
// COMPUTED
// ============================================
const filteredChats = computed(() => {
  // Update cache when new data arrives
  if (activeChatsList.value?.length > 0) {
    cachedChats.value = activeChatsList.value;
  }
  
  let chats = cachedChats.value || [];
  
  // Apply search filter
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    chats = chats.filter(c =>
      c.participant?.firstName?.toLowerCase().includes(term) ||
      c.participant?.lastName?.toLowerCase().includes(term) ||
      c.participant?.email?.toLowerCase().includes(term) ||
      c.lastMessage?.content?.toLowerCase().includes(term)
    );
  }
  
  // Apply read/unread filter
  if (filterStatus.value !== 'all') {
    chats = chats.filter(c =>
      filterStatus.value === 'read' 
        ? (c.unreadMessagesCount || 0) === 0
        : (c.unreadMessagesCount || 0) > 0
    );
  }
  
  return chats;
});

const currentMessages = computed(() => {
  if (!selectedChat.value?.id) return [];
  
  const roomId = selectedChat.value.id;
  const roomMessages = messagesByRoom.value[roomId] || [];
  const fetchedMessages = roomChatsList.value || [];
  
  // Merge and deduplicate
  const messageMap = new Map();
  [...fetchedMessages, ...roomMessages].forEach(msg => {
    if (msg?.id) {
      messageMap.set(msg.id, msg);
    }
  });
  
  // Sort chronologically
  return Array.from(messageMap.values()).sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
});

// ============================================
// METHODS
// ============================================
const updateViewMode = () => {
  isDesktop.value = window.innerWidth >= 1024;
  if (isDesktop.value) showSidebar.value = true;
};

const selectChat = async (chat: any) => {
  if (!chat?.id) return;
  
  selectedChat.value = chat;
  setActiveRoom(chat.id);
  
  // Fetch messages
  try {
    await getRoomChats(chat.id);
    await nextTick();
    
    if (roomChatsList.value?.length > 0) {
      mergeMessages(chat.id, roomChatsList.value);
    }
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
  
  // Mark as read
  if (chat.lastMessage?.roomId && chat.lastMessage?.recipientId) {
    markMessageAsRead(chat.lastMessage.roomId, chat.lastMessage.recipientId);
  }
  
  router.push({ query: { userId: chat.participant?.id } });
  
  if (!isDesktop.value) showSidebar.value = false;
};

const handleSendMessage = async (content: string) => {
  if (!selectedChat.value || !content.trim() || isSending.value) return;
  
  isSending.value = true;
  
  try {
    await sendMessage({
      recipientId: selectedChat.value.participant.id,
      recipientType: selectedChat.value.participant.role || 'USER',
      content: content.trim(),
      room: selectedChat.value.id,
      messageType: 'private'
    });
    
    messageText.value = '';
    
    // Background refresh
    setTimeout(() => getActiveChats(), 1000);
  } catch (error) {
    console.error('Send failed:', error);
  } finally {
    isSending.value = false;
  }
};

const handleAgentQuery = async (userId: string) => {
  await createRoom({
    participantId: userId,
    participantType: 'AGENT'
  });
  
  await getActiveChats();
  
  const chat = activeChatsList.value.find(c => c.participant?.id === userId);
  if (chat) await selectChat(chat);
};

const toggleMembers = () => {
  showMembersList.value = !showMembersList.value;

  if (showMembersList.value && addButton.value) {
    const rect = addButton.value.getBoundingClientRect();
    popoverStyle.value = {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left - 320 + rect.width}px`,
    };
  }
};

const handleSelectedMember = async (user: any) => {
  try {
    await createRoom({
      participantId: user.id,
      participantType: user.role || user.type || 'USER'
    });
    
    await getActiveChats();
    
    const chat = activeChatsList.value.find(c => c.participant?.id === user.id);
    if (chat) {
      await selectChat(chat);
    }
    
    showMembersList.value = false;
  } catch (error) {
    console.error('Failed to create room:', error);
  }
};

const handleScroll = (event: any) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  if (scrollHeight - scrollTop - clientHeight < 50 && hasMore.value && !loading.value) {
    loadMore();
  }
};

const formatLastMessage = (content: any) => {
  if (!content) return 'No messages yet';
  
  try {
    const parsed = JSON.parse(content);
    if (parsed.type === 'file' && parsed.file) {
      const mime = parsed.file.mimetype || '';
      if (mime.startsWith('image/')) return '📷 Image';
      if (mime.includes('pdf')) return '📄 PDF';
      return '📎 File';
    }
    return parsed.message || content;
  } catch {
    return content.length > 40 ? content.substring(0, 40) + '...' : content;
  }
};

const formatTime = (date: string) => {
  return moment(date).calendar(null, {
    sameDay: 'LT',
    lastDay: '[Yesterday]',
    lastWeek: 'dddd',
    sameElse: 'DD/MM/YY'
  });
};

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  updateViewMode();
  window.addEventListener('resize', updateViewMode);
  
  await nextTick();
  console.log('User loaded:', user.value?.id);
  
  await getActiveChats();
  await fetchAllUsers(payload.value);
  isInitialLoad.value = false;
  
  if (route.query.userId) {
    await handleAgentQuery(route.query.userId as string);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateViewMode);
});

// ============================================
// WATCHERS
// ============================================
watch(() => route.query.userId, async (newId) => {
  if (newId && (!selectedChat.value || selectedChat.value.participant?.id !== newId)) {
    const chat = filteredChats.value.find(c => c.participant?.id === newId);
    if (chat) await selectChat(chat);
  }
});

watch(() => messagesByRoom.value, () => {
  if (selectedChat.value?.id && messagesByRoom.value[selectedChat.value.id]) {
    // Trigger reactivity
  }
}, { deep: true });
</script>

<style scoped>
.scrollbar-visible::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

.scrollbar-visible::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.scrollbar-visible::-webkit-scrollbar-track {
  background-color: #f5f5f5;
  border-radius: 4px;
}

.scrollbar-visible {
  scrollbar-width: thin;
  scrollbar-color: #888 #f5f5f5;
}
</style>