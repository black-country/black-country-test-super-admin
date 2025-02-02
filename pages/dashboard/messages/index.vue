<template>
   <MessagingView>
  <div>
    <div class="w-full h-32" style="background-color: white"></div>
    <div class="" style="margin-top: -128px;">
      <div class="h-screen">
        <div class="flex border-[0.5px] border-gray-25 rounded h-full">


          <div class="w-[500px] border-[0.5px] flex flex-col">
            <div class="flex items-center space-x-2 p-2 relative">

              <div class="relative flex items-center bg-[#EAEAEA] rounded-lg px-3 py-2 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 11-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
                    clip-rule="evenodd" />
                </svg>
                <input v-model="searchQuery" type="text" class="bg-[#EAEAEA] text-gray-600 text-sm ml-2 py-1.5 focus:outline-none w-full"
                  placeholder="Search" />
              </div>


            <button @click="toggleMembers">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="8" fill="#EAEAEA"/>
              <path d="M22 15.332V28.6654" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.332 22H28.6654" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <div 
          v-if="showMembersList" 
          class="fixed inset-0 z-50 bg-black/50"
          @click="showMembersList = false"
        >
          <div 
            class="absolute bg-white border-[0.5px] border-gray-100 rounded-xl ml-72 mt-16 w-80"
            :style="popoverStyle"
            @click.stop
          >
            <div class="divide-y divide-gray-50">
              <div class="space-y-4 max-h-96 divide-y divide-gray-100 overflow-y-auto scrollbar-visible py-4">
                <div @click="handleSelectedMember(member)" v-for="member in membersList" :key="member.id" class="flex cursor-pointer px-4 items-center gap-4 pt-3 first:pt-0">
                  <img src="@/assets/icons/users-avatar.svg" :alt="member.name" class="w-10 h-10 rounded-full object-cover" />
                  <!-- <img src="@/assets/icons/avatar-placeholder.svg" :alt="member.name" class="w-10 h-10 rounded-full object-cover" /> -->
                  <div>
                    <h3 class="font-medium text-gray-900 text-sm">{{ `${member.firstName ?? "--"} ${member.lastName ?? "--"}` }}</h3>
                    <p class="text-gray-500 text-sm lowercase">{{ member?.group }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
              <button @click="toggleDropdown" class="bg-[#EAEAEA] p-3 rounded-lg  transition-colors">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.8333 3.33398H2.5" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M9.16667 15.834H2.5" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M17.5001 15.834H14.1667" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M17.5001 9.58398H9.16675" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M17.4999 3.33398H15.8333" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path d="M4.16667 9.58398H2.5" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round"
                    stroke-linejoin="round" />
                  <path
                    d="M12.0833 1.66602C12.4715 1.66602 12.6657 1.66602 12.8188 1.72945C13.023 1.81402 13.1853 1.97626 13.2698 2.18045C13.3333 2.33359 13.3333 2.52773 13.3333 2.91602V3.74935C13.3333 4.13763 13.3333 4.33177 13.2698 4.48492C13.1853 4.68911 13.023 4.85134 12.8188 4.93592C12.6657 4.99935 12.4715 4.99935 12.0833 4.99935C11.695 4.99935 11.5008 4.99935 11.3477 4.93592C11.1435 4.85134 10.9813 4.68911 10.8967 4.48492C10.8333 4.33177 10.8333 4.13763 10.8333 3.74935V2.91602C10.8333 2.52773 10.8333 2.33359 10.8967 2.18045C10.9813 1.97626 11.1435 1.81402 11.3477 1.72945C11.5008 1.66602 11.695 1.66602 12.0833 1.66602Z"
                    stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M10.4167 14.166C10.805 14.166 10.9992 14.166 11.1523 14.2294C11.3565 14.314 11.5187 14.4763 11.6033 14.6804C11.6667 14.8336 11.6667 15.0278 11.6667 15.416V16.2493C11.6667 16.6376 11.6667 16.8318 11.6033 16.9849C11.5187 17.1891 11.3565 17.3513 11.1523 17.4359C10.9992 17.4993 10.805 17.4993 10.4167 17.4993C10.0285 17.4993 9.83433 17.4993 9.68116 17.4359C9.477 17.3513 9.31475 17.1891 9.23017 16.9849C9.16675 16.8318 9.16675 16.6376 9.16675 16.2493V15.416C9.16675 15.0278 9.16675 14.8336 9.23017 14.6804C9.31475 14.4763 9.477 14.314 9.68116 14.2294C9.83433 14.166 10.0285 14.166 10.4167 14.166Z"
                    stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path
                    d="M7.91675 7.91602C8.30503 7.91602 8.49917 7.91602 8.65233 7.97945C8.8565 8.06402 9.01875 8.22626 9.10333 8.43043C9.16675 8.5836 9.16675 8.77777 9.16675 9.16602V9.99935C9.16675 10.3876 9.16675 10.5818 9.10333 10.7349C9.01875 10.9391 8.8565 11.1013 8.65233 11.1859C8.49917 11.2493 8.30503 11.2493 7.91675 11.2493C7.52846 11.2493 7.33432 11.2493 7.18118 11.1859C6.97699 11.1013 6.81476 10.9391 6.73018 10.7349C6.66675 10.5818 6.66675 10.3876 6.66675 9.99935V9.16602C6.66675 8.77777 6.66675 8.5836 6.73018 8.43043C6.81476 8.22626 6.97699 8.06402 7.18118 7.97945C7.33432 7.91602 7.52846 7.91602 7.91675 7.91602Z"
                    stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

              </button>

  
              <div v-if="showDropdown" class="fixed inset-0 z-50" @click="toggleDropdown">

                <div
                  class="absolute left-[170px] mt-4 top-10 w-44 bg-white rounded-lg border-[0.5px] border-gray-25 z-20 shadow">
                  <ul>
                    <li
                      class="flex items-center justify-between text-sm px-4 py-2 mb-2 border-b text-[#1D2739] last:border-b-0 border-gray-100 cursor-pointer ">
                      Read
                    </li>
                    <li
                      class="flex items-center justify-between text-sm px-4 py-1 mb-2 border-b text-[#1D2739] last:border-b-0 border-gray-100 cursor-pointer ">
                      Unread
                    </li>
                  </ul>
                </div>
              </div>
            </div>


        
            <div v-if="!loadingActiveChats && activeChatsList.length" class="bg-grey-lighter flex-1 overflow-auto">
              <ChatUserList class="px-3 flex items-center bg-grey-light cursor-pointer" :loading="loadingActiveChats"
                :users="activeChatsList" :filteredUsers="filteredUserList" @selectUser="selectUser" />
            </div>
            <section v-else-if="loadingActiveChats && !activeChatsList?.length">
        <div class="rounded-md p-4 w-full mx-auto">
          <div class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-6 py-1">
              <div class="h-44 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
       </section>
      <section v-else class="flex flex-col justify-between items-center space-y-2 mt-10">
             <svg width="152" height="124" viewBox="0 0 152 124" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="76" cy="58" r="52" fill="#EAEAEA"/>
            <circle cx="21" cy="25" r="5" fill="#BDBDBD"/>
            <circle cx="18" cy="109" r="7" fill="#BDBDBD"/>
            <circle cx="145" cy="41" r="7" fill="#BDBDBD"/>
            <circle cx="134" cy="14" r="4" fill="#BDBDBD"/>
            <g filter="url(#filter0_b_6853_118795)">
            <rect x="52" y="34" width="48" height="48" rx="24" fill="#9D9D9D"/>
            <path d="M85.9598 56.9707C86.0134 57.8009 86.0134 58.6607 85.9598 59.4909C85.6856 63.7332 82.3536 67.1125 78.1706 67.3905C76.7435 67.4854 75.2536 67.4852 73.8294 67.3905C73.339 67.3579 72.8044 67.2409 72.344 67.0513C71.8318 66.8403 71.5756 66.7348 71.4454 66.7508C71.3153 66.7668 71.1264 66.9061 70.7487 67.1846C70.0827 67.6757 69.2437 68.0285 67.9994 67.9982C67.3703 67.9829 67.0557 67.9752 66.9148 67.7351C66.774 67.495 66.9494 67.1626 67.3002 66.4978C67.7867 65.5758 68.095 64.5203 67.6279 63.6746C66.8234 62.4666 66.1401 61.036 66.0402 59.4909C65.9866 58.6607 65.9866 57.8009 66.0402 56.9707C66.3144 52.7284 69.6464 49.3491 73.8294 49.0711C75.0318 48.9911 75.2812 48.9786 76.5 49.0337" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M72.5 61H79.5M72.5 56H76" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M86 51.5C86 53.433 84.433 55 82.5 55C80.567 55 79 53.433 79 51.5C79 49.567 80.567 48 82.5 48C84.433 48 86 49.567 86 51.5Z" stroke="white" stroke-width="1.5"/>
            </g>
            <defs>
            <filter id="filter0_b_6853_118795" x="44" y="26" width="64" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="4"/>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_6853_118795"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_6853_118795" result="shape"/>
            </filter>
            </defs>
            </svg>
            <h2 class="text-[#1D2739]">No conversations found</h2>
            <p class="text-[#667185]">You have not contacted anyone</p>
      </section>

          </div>



          <div class="w-full border-[0.5px] border-gray-100 flex flex-col">


            <ChatHeader :selectedUser="selectedUser || roomChatsList" :isConnected="isConnected" />
  


            <div v-if="!loadingRoomChats && roomChatsList.length" class="flex-1 overflow-auto" style="background-color: white">
              <div class="py-2 px-3">
                {{ roomChatsList }}
                <ChatWindow class="z-10" :roomChats="roomChatsList" :messages="messages" :selectedUser="selectedUser" />
              </div>
            </div>

            <section class="flex-1 overflow-auto" v-else-if="loadingRoomChats && !roomChatsList.length">
              <div class="rounded-md p-4 w-full mx-auto">
                <div class="animate-pulse flex space-x-4">
                  <div class="flex-1 space-y-6 py-1">
                    <div class="h-96 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            </section>

            <div
            v-else
            class="flex-1 flex py-20 items-center justify-center"
          >
            <div
              class="flex justify-center items-center flex-col w-full gap-y-4"
            >
              <svg
                width="152"
                height="124"
                viewBox="0 0 152 124"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="76" cy="58" r="52" fill="#EAEAEA" />
                <circle cx="21" cy="25" r="5" fill="#BDBDBD" />
                <circle cx="18" cy="109" r="7" fill="#BDBDBD" />
                <circle cx="145" cy="41" r="7" fill="#BDBDBD" />
                <circle cx="134" cy="14" r="4" fill="#BDBDBD" />
                <g filter="url(#filter0_b_6853_116899)">
                  <rect
                    x="52"
                    y="34"
                    width="48"
                    height="48"
                    rx="24"
                    fill="#9D9D9D"
                  />
                  <path
                    d="M66.5299 60.7696C66.3173 62.1636 67.268 63.1312 68.4321 63.6134C72.8948 65.4622 79.1052 65.4622 83.5679 63.6134C84.732 63.1312 85.6827 62.1636 85.4701 60.7696C85.3394 59.9129 84.6932 59.1995 84.2144 58.5029C83.5873 57.5793 83.525 56.5718 83.5249 55.5C83.5249 51.3579 80.1559 48 76 48C71.8441 48 68.4751 51.3579 68.4751 55.5C68.475 56.5718 68.4127 57.5793 67.7856 58.5029C67.3068 59.1995 66.6606 59.9129 66.5299 60.7696Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M72 65C72.4585 66.7252 74.0755 68 76 68C77.9245 68 79.5415 66.7252 80 65"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_b_6853_116899"
                    x="44"
                    y="26"
                    width="64"
                    height="64"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feGaussianBlur in="BackgroundImageFix" stdDeviation="4" />
                    <feComposite
                      in2="SourceAlpha"
                      operator="in"
                      result="effect1_backgroundBlur_6853_116899"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_backgroundBlur_6853_116899"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
              <p class="text-[#1D2739] font-medium">
                Start a conversation
              </p>
            </div>
            </div>

            <ChatMessageInput v-model="newMessage" :isConnected="isConnected" :isSending="messageStatus === 'sending'"
              @sendMessage="sendMessageToUser" />
          </div>
        </div>
      </div>
    </div>
  </div>
</MessagingView>
</template>

<!-- <template>
  <MessagingView>
    <div class="w-full min-h-screen flex flex-col bg-white">

      <div class="w-full h-32 bg-white"></div>

      <div class="relative -mt-32 flex flex-col md:flex-row h-screen overflow-hidden">

        <div  class="w-full md:w-[320px] hidden lg:block lg:w-[350px] border-r border-gray-200 flex flex-col overflow-hidden">

          <div class="flex items-center space-x-2 p-2 relative bg-gray-100">
            <div class="relative flex items-center bg-white rounded-lg px-3 py-2 w-full shadow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 11-1.414 1.415l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd" />
              </svg>
              <input v-model="searchQuery" type="text" class="bg-white text-gray-600 text-sm ml-2 py-1.5 focus:outline-none w-full" placeholder="Search" />
            </div>


            <button @click="toggleMembers" class="rounded-lg bg-white shadow">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="8" fill="#EAEAEA"/>
              <path d="M22 15.332V28.6654" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15.332 22H28.6654" stroke="#1D2739" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <div 
    v-if="showMembersList" 
    class="fixed inset-0 z-50 bg-black/50"
    @click="showMembersList = false"
  >
    <div 
      class="absolute bg-white border-[0.5px] border-gray-100 rounded-xl lg:ml-72 mt-16 w-80"
      :style="popoverStyle"
      @click.stop
    >
      <div class="divide-y divide-gray-50">
        <div class="space-y-4 max-h-96 divide-y divide-gray-100 overflow-y-scroll scrollbar-visible py-4">
          <div @click="handleSelectedMember(member)" v-for="member in membersList" :key="member.id" class="flex cursor-pointer px-4 items-center gap-4 pt-3 first:pt-0">
            <img src="@/assets/icons/users-avatar.svg" :alt="member.name" class="w-10 h-10 rounded-full object-cover" />
            <div>
              <h3 class="font-medium text-gray-900 text-sm">{{ `${member.firstName ?? "--"} ${member.lastName ?? "--"}` }}</h3>
              <p class="text-gray-500 text-sm lowercase">{{ member?.group }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

          </div>



          <div class="flex-1 overflow-y-auto">
            <ChatUserList :loading="loadingActiveChats" :users="activeChatsList" :filteredUsers="filteredUserList" @selectUser="selectUser" />
          </div>


          <section v-if="!loadingActiveChats && !activeChatsList.length" class="flex flex-col justify-center items-center space-y-2 mt-10 text-center">
            <svg width="152" height="124" viewBox="0 0 152 124" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="76" cy="58" r="52" fill="#EAEAEA" />
              <g filter="url(#filter0_b)">
                <rect x="52" y="34" width="48" height="48" rx="24" fill="#9D9D9D" />
                <path d="M85.9598 56.9707C86.0134 57.8009 86.0134 58.6607 85.9598 59.4909C85.6856 63.7332 82.3536 67.1125 78.1706 67.3905C76.7435 67.4854 75.2536 67.4852 73.8294 67.3905" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </g>
            </svg>
            <h2 class="text-gray-800">No conversations found</h2>
            <p class="text-gray-500">You have not contacted anyone</p>
          </section>
        </div>


        <div v-if="selectedUser && !openSideNav" class="flex-1 flex flex-col h-full border-l border-gray-200 bg-white">
          <ChatHeader :selectedUser="selectedUser || roomChatsList" :isConnected="isConnected">
            <template #backBtn>
              <button type='button' @click="goBack">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            </template>
          </ChatHeader>


          <div v-if="!loadingRoomChats" class="flex-1 overflow-y-auto p-3">
            <ChatWindow :roomChats="roomChatsList" :messages="messages" :selectedUser="selectedUser" />
          </div>


          <section v-if="loadingRoomChats" class="flex-1 flex items-center justify-center">
            <div class="animate-pulse w-3/4 bg-gray-300 rounded-lg h-96"></div>
          </section>


          <ChatMessageInput v-if="!openSideNav" v-model="newMessage" :isConnected="isConnected" :isSending="messageStatus === 'sending'" @sendMessage="sendMessageToUser" />
        </div>
      </div>
    </div>
  </MessagingView>
</template>

-->

<script setup lang="ts">
  import { useGetMembers } from "@/composables/modules/member/fetch";
// import { useGetTenentDetails } from '@/composables/modules/tenants/useFetchTenantDetails'
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import MessagingView from "@/layouts/messagingView.vue";
import MessagingView from '../../../layouts/MessagingView.vue';
import { useGetActiveChats } from "@/composables/modules/messages/fetchActiveChats";
import { useGetRoomChats } from "@/composables/modules/messages/fetchRoomMessages";
import { useWebSocket } from "@/composables/modules/messages/sockets";
// const { tenantDetails, getTenantDetails, loading: fetchingTenantDetails } = useGetTenentDetails()

// Composables
const { loadingActiveChats, activeChatsList } = useGetActiveChats();
const { getRoomChats, loadingRoomChats, roomChatsList } = useGetRoomChats();
const {
    loadingMembers,
    membersList,
    // searchQuery,
    filters,
    metadata,
    getMembers,
    applyFilters,
  } = useGetMembers();
const {
  messages,
  newMessage,
  isConnected,
  sendMessage
} = useWebSocket();

const openSideNav = ref(false)

// Back button function (Returns to chat list on mobile)
const goBack = () => {
  selectedUser.value = null;
  openSideNav.value = true; // Show chat list again on mobile
  // router.push({ query: {} });
};


// Reactive variable for the search query
const searchQuery = ref("");

const filteredUserList = computed(() => {
  // Trim and lowercase search query for case-insensitive comparison
  const query = searchQuery.value.trim().toLowerCase();

  // If search query is empty, return all chats with duplicates removed
  if (!query) {
    const activeChatsNames = new Set(
      activeChatsList.value.map(
        (chat) =>
          `${chat.participant.firstName.toLowerCase()} ${chat.participant.lastName.toLowerCase()}`
      )
    );

    // Return active chats and members not found in active chats
    return [
      ...activeChatsList.value.map((chat) => ({
        ...chat,
        type: "activeChat",
      })),
      ...membersList.value
        .filter(
          (member) =>
            !activeChatsNames.has(
              `${member.firstName.toLowerCase()} ${member.lastName.toLowerCase()}`
            )
        )
        .map((member) => ({ ...member, type: "member" })),
    ];
  }

  // Filter activeChatsList
  const filteredActiveChats = activeChatsList.value.filter((chat) => {
    const { firstName, lastName } = chat.participant;
    return (
      firstName.toLowerCase().includes(query) ||
      lastName.toLowerCase().includes(query)
    );
  });

  // Filter membersList, excluding names already in filteredActiveChats
  const filteredActiveNames = new Set(
    filteredActiveChats.map(
      (chat) =>
        `${chat.participant.firstName.toLowerCase()} ${chat.participant.lastName.toLowerCase()}`
    )
  );

  const filteredMembers = membersList.value.filter((member) => {
    const { firstName, lastName } = member;
    const fullName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
    return (
      (firstName.toLowerCase().includes(query) ||
        lastName.toLowerCase().includes(query)) &&
      !filteredActiveNames.has(fullName)
    );
  });

  // Combine both filtered lists and return
  return [
    ...filteredActiveChats.map((chat) => ({ ...chat, type: "activeChat" })),
    ...filteredMembers.map((member) => ({ ...member, type: "member" })),
  ];
});


definePageMeta({
  middleware: 'auth'
})

const router = useRouter();
const route = useRoute();
const selectedUser = ref(null);
const messageStatus = ref('idle');

// User selection
const selectUser = (user: any) => {
  selectedUser.value = user;
  // Optionally update URL
  openSideNav.value = false;
  router.push({ query: { userId: user?.participant?.id } });
};

const selctedMember = ref({})

const handleSelectedMember = (user: any) => {
  console.log(user)
  selctedMember.value = user
  selectedUser.value = user;
  // // Optionally update URL
  router.push({ query: { userId: user?.id } });
  showMembersList.value = false
}

const showMembersList = ref(false)

const toggleMembers = () => {
  showMembersList.value = !showMembersList.value
}

// Watch for selected user changes
watch(selectedUser, async (newVal: any) => {
  if (newVal?.id) {
    try {
      await getRoomChats(newVal.id);
    } catch (error) {
      console.error('Failed to fetch room chats:', error);
    }
  }
});


// Watch for new messages to scroll to bottom
watch(messages, (newMessages) => {
  if (newMessages.length > 0) {
    scrollToBottom();
  }
}, { deep: true });

// Watch `activeChatsList` to handle delayed population
watch(activeChatsList, (newVal) => {
  console.log(newVal, 'active chats (watch)');
  const userId = route.query.userId;
  if (userId) {
    const user = newVal.find(u => u?.participant?.id === userId);
    if (user) {
      selectUser(user);
    } else {
      if(newVal.length === 1){
        selectUser(newVal[0]);
      }
    }
  }

  if(newVal.length) {
    selectUser(newVal[0])
    console.log('only one item found')
  }

}, { immediate: true });


const sendMessageToUser = async (content: string) => {
  console.log(content, 'content here');

  if (!selectedUser.value || !isConnected.value) {
    console.error('Cannot send message: No recipient selected or not connected');
    return;
  }

  const userId =
    selectedUser.value.participant?.id ||
    route?.query?.userId ||
    selectedUser.value.id;

  if (!userId) {
    console.error('Cannot send message: Invalid recipient ID');
    return;
  }

  messageStatus.value = 'sending';

  try {
    const socketPayload = {
      content,
      recipientId: userId,
      recipientType:
        selectedUser.value.participant?.role || selectedUser.value.group,
      messageType: 'private',
      room: userId, // Include room ID if needed
    };

    console.log(socketPayload, 'socket payload');

    await sendMessage(socketPayload);
    messageStatus.value = 'sent';
    newMessage.value = ''; // Clear input after successful send
  } catch (error) {
    console.error('Failed to send message:', error);
    messageStatus.value = 'error';
    // Optionally show error notification to user
  }
};



// Scroll handling
const scrollToBottom = () => {
  const chatWindow = document.querySelector('.custom-scrollbar');
  if (chatWindow) {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
};

// Event handling
const { $emitter } = useNuxtApp();

onMounted(() => {
  console.log(activeChatsList.value, 'active chats (onMounted)');
  const userId = route.query.userId;

  if (userId && activeChatsList.value?.length > 0) {
    const user = activeChatsList.value.find(u => u.id === userId);
    if (user) {
      selectUser(user);
    }
  } 


  $emitter.on('customEvent', async (payload: any) => {
    if (payload.data) {
      await getRoomChats(payload.data);
      scrollToBottom();
    }
  });
});

onUnmounted(() => {
  // Clean up event listeners
  $emitter.off('customEvent');
});

// State for dropdown visibility
const showDropdown = ref(false);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

const popoverStyle = ref({
  top: '0px',
  left: '0px'
})

const addButton = ref<HTMLElement | null>(null)

const toggleMembersList = () => {
  showMembersList.value = !showMembersList.value
  
  if (showMembersList.value && addButton.value) {
    const rect = addButton.value.getBoundingClientRect()
    popoverStyle.value = {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left - 320 + rect.width}px`  // Position to the left of the button
    }
  }
}

watch(() => route.query.userId, (oldVal, newVal) => {
  console.log('id updated')
})

</script>



<style scoped>
.backdrop-blur {
  backdrop-filter: blur(4px);
}

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
  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: #5B8469 #f5f5f5;
}
</style> 
