// import { ref, onMounted, onUnmounted } from "vue";
// import { io, Socket } from "socket.io-client";
// import { useUser } from "@/composables/auth/user";
// import { useGetRoomChats } from '@/composables/modules/messages/fetchRoomMessages';
// import { useCustomToast } from '@/composables/core/useCustomToast'
// const { showToast } = useCustomToast();

// export const useWebSocket = () => {
//   const { token } = useUser();
//   const messagesByRoom = ref<Record<string, any[]>>({});
//   const activeRoomId = ref<string | null>(null);
//   const { getRoomChats } = useGetRoomChats();
//   const newMessage = ref("");
//   const baseUrl = import.meta.env.VITE_BASE_URL;
//   const isConnected = ref(false);
//   const socket = ref<Socket | null>(null);
//   const messageStatus = ref<"idle" | "sending" | "sent" | "error">("idle");

//   const currentRoomMessages = computed(() => {
//     if (!activeRoomId.value) return [];
//     return messagesByRoom.value[activeRoomId.value] || [];
//   });

//   const setActiveRoom = (roomId: string) => {
//     activeRoomId.value = roomId;
//     if (!messagesByRoom.value[roomId]) {
//       messagesByRoom.value[roomId] = [];
//     }
//   };

//   const initializeSocket = () => {
//     socket.value = io(baseUrl, {
//       auth: {
//         token: token.value,
//       },
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     // Connection events
//     socket.value.on("connect", () => {
//       showToast({
//         title: "Success",
//         message: "Connection was successful",
//         toastType: "success",
//         duration: 3000
//       });
//       isConnected.value = true;
//       fetchInitialMessages();
//     });

//     socket.value.on("disconnect", () => {
//       console.log("Disconnected from server");
//       isConnected.value = false;
//     });

//     socket.value.on("error", (error) => {
//       isConnected.value = false;
//     });
//     socket.value.on("message.new", (message: any) => {
//       console.log("New message received:", message.message);
//       if (!message?.message) return;
//       const roomId = message.message.room?.id || message.message.recipientId || null;
//       if (!roomId) return;

//       if (!messagesByRoom.value[roomId]) {
//         messagesByRoom.value[roomId] = [];
//       }

//       if (!messagesByRoom.value[roomId].some(msg => msg.id === message.message.id)) {
//         const newMsg = {
//           ...message.message,
//           status: 'received'
//         };

//         messagesByRoom.value = {
//           ...messagesByRoom.value,
//           [roomId]: [...messagesByRoom.value[roomId], newMsg]
//         };
//       }
//     });

//     socket.value.on("messages.update", (updatedMessages: any[]) => {
//       console.log("Messages updated:", updatedMessages);

//       const messageGroups: Record<string, any[]> = {};

//       updatedMessages.forEach(msg => {
//         const roomId = msg.room?.id || msg.recipientId;
//         if (!roomId) return;

//         if (!messageGroups[roomId]) {
//           messageGroups[roomId] = [];
//         }

//         messageGroups[roomId].push({
//           ...msg,
//           status: 'received'
//         });
//       });

//       messagesByRoom.value = { ...messagesByRoom.value, ...messageGroups };
//     });
//   };

//   const sendMessage = async (payload: {
//     recipientId: string;
//     recipientType: string;
//     content: string;
//     room?: string;
//     messageType: string;
//   }) => {
//     if (!socket.value?.connected) {
//       console.error("Socket not connected");
//       return;
//     }
//     const roomId = payload.room || payload.recipientId;

//     const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
//     const tempMessage = {
//       id: tempId,
//       ...payload,
//       status: 'sending',
//       timestamp: new Date().toISOString(),
//     };

//     if (!messagesByRoom.value[roomId]) {
//       messagesByRoom.value[roomId] = [];
//     }

//     messagesByRoom.value = {
//       ...messagesByRoom.value,
//       [roomId]: [...messagesByRoom.value[roomId], tempMessage]
//     };

//     return new Promise((resolve, reject) => {
//       socket.value?.emit("message.new", payload, (response: any) => {
//         if (response.status === "success") {
//           messagesByRoom.value = {
//             ...messagesByRoom.value,
//             [roomId]: messagesByRoom.value[roomId].map(msg =>
//               msg.id === tempId
//                 ? { ...response.data, status: 'sent' }
//                 : msg
//             )
//           };

//           if (payload.room) {
//             getRoomChats(response?.data?.room?.id);
//           }

//           const { $emitter } = useNuxtApp();
//           $emitter.emit('messageSent', {
//             roomId: response?.data?.room?.id,
//             message: response?.data
//           });

//           resolve(response.data);
//         } else {
//           messagesByRoom.value = {
//             ...messagesByRoom.value,
//             [roomId]: messagesByRoom.value[roomId].map(msg =>
//               msg.id === tempId
//                 ? { ...msg, status: 'error' }
//                 : msg
//             )
//           };

//           console.error("Failed to send message:", response);
//           reject(new Error(response.message || 'Failed to send message'));
//         }
//       });
//     });
//   };

//   onMounted(() => {
//     initializeSocket();
//   });

//   onUnmounted(() => {
//     if (socket.value) {
//       socket.value.off("message.new");
//       socket.value.off("messages.update");
//       socket.value.disconnect();
//       socket.value = null;
//     }
//   });

//   return {
//     // messages,
//     newMessage,
//     isConnected,
//     sendMessage,
//     socket: socket.value,
//     messagesByRoom,
//     currentRoomMessages,
//     setActiveRoom,
//     activeRoomId,
//     messageStatus
//   };
// };

import { ref, onMounted, onUnmounted } from "vue";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/composables/auth/user";
import { useGetRoomChats } from '@/composables/modules/messages/fetchRoomMessages';
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();

export const useWebSocket = () => {
  const { token } = useUser();
  // const messages = ref<any[]>([]);
  const messagesByRoom = ref<Record<string, any[]>>({});
  const activeRoomId = ref<string | null>(null);
  const { getRoomChats } = useGetRoomChats();
  const newMessage = ref("");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const isConnected = ref(false);
  const socket = ref<Socket | null>(null);
  const messageStatus = ref<"idle" | "sending" | "sent" | "error">("idle");

  const currentRoomMessages = computed(() => {
    if (!activeRoomId.value) return [];
    return messagesByRoom.value[activeRoomId.value] || [];
  });

  const setActiveRoom = (roomId: string) => {
    activeRoomId.value = roomId;
    if (!messagesByRoom.value[roomId]) {
      messagesByRoom.value[roomId] = [];
    }
  };

  const initializeSocket = () => {
    socket.value = io(baseUrl, {
      auth: {
        token: token.value,
      },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socket.value.on("connect", () => {
      showToast({
        title: "Success",
        message: "Connection was successful",
        toastType: "success",
        duration: 3000
      });
      isConnected.value = true;

      if (activeRoomId.value) {
        fetchInitialMessages();
      }
    });

    socket.value.on("reconnect", () => {
      isConnected.value = true;
      if (activeRoomId.value) {
        fetchInitialMessages();
      }
    });

    socket.value.on("disconnect", () => {
      isConnected.value = false;
    });

    socket.value.on("error", (error) => {
      isConnected.value = false;
    });

    socket.value.on("message.new", (message: any) => {
      console.log("New message received:", message.message);
      if (!message?.message) return;
      const roomId = message.message.room?.id || message.message.recipientId || null;
      if (!roomId) return;

      if (!messagesByRoom.value[roomId]) {
        messagesByRoom.value[roomId] = [];
      }

      if (!messagesByRoom.value[roomId].some(msg => msg.id === message.message.id)) {
        const updatedMessages = [...messagesByRoom.value[roomId], {
          ...message.message,
          status: 'received'
        }];

        messagesByRoom.value = {
          ...messagesByRoom.value,
          [roomId]: updatedMessages
        };

        if (activeRoomId.value === roomId) {
          getRoomChats(roomId);
        }
      }
    });

    socket.value.on("messages.update", (updatedMessages: any[]) => {
      console.log("Messages updated:", updatedMessages);

      const messageGroups: Record<string, any[]> = {};

      updatedMessages.forEach(msg => {
        const roomId = msg.room?.id || msg.recipientId;
        if (!roomId) return;

        if (!messageGroups[roomId]) {
          messageGroups[roomId] = [];
        }

        messageGroups[roomId].push({
          ...msg,
          status: 'received'
        });
      });

      messagesByRoom.value = { ...messagesByRoom.value, ...messageGroups };
    });
  };

  const fetchInitialMessages = async () => {
    if (activeRoomId.value) {
      try {
        await getRoomChats(activeRoomId.value);
      } catch (error) {
        console.error('Failed to fetch initial messages:', error);
      }
    }
  };

  const sendMessage = async (payload: {
    recipientId: string;
    recipientType: string;
    content: string;
    room?: string;
    messageType: string;
  }) => {
    if (!socket.value?.connected) {
      console.error("Socket not connected");
      return;
    }
    const roomId = payload.room || payload.recipientId;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const tempMessage = {
      id: tempId,
      ...payload,
      status: 'sending',
      timestamp: new Date().toISOString(),
    };

    if (!messagesByRoom.value[roomId]) {
      messagesByRoom.value[roomId] = [];
    }

    messagesByRoom.value = {
      ...messagesByRoom.value,
      [roomId]: [...messagesByRoom.value[roomId], tempMessage]
    };

    return new Promise((resolve, reject) => {
      socket.value?.emit("message.new", payload, (response: any) => {
        if (response.status === "success") {
          messagesByRoom.value = {
            ...messagesByRoom.value,
            [roomId]: messagesByRoom.value[roomId].map(msg =>
              msg.id === tempId
                ? { ...response.data, status: 'sent' }
                : msg
            )
          };

          if (payload.room) {
            getRoomChats(response?.data?.room?.id);
          }

          const { $emitter } = useNuxtApp();
          $emitter.emit('messageSent', {
            roomId: response?.data?.room?.id,
            message: response?.data
          });

          resolve(response.data);
        } else {
          messagesByRoom.value = {
            ...messagesByRoom.value,
            [roomId]: messagesByRoom.value[roomId].map(msg =>
              msg.id === tempId
                ? { ...msg, status: 'error' }
                : msg
            )
          };

          console.error("Failed to send message:", response);
          reject(new Error(response.message || 'Failed to send message'));
        }
      });
    });
  };

  const markMessageAsRead = (roomId: string, recipientId: string) => {
    if (!socket.value?.connected) {
      console.error("Socket not connected");
      return;
    }

    const payload = { roomId, recipientId };

    socket.value.emit("message.read.all", payload, (response: any) => {
      if (response.status === "success" || response.success === "true") {
        // console.log(`msg read in ${roomId}`);
        // console.log(payload)

        if (messagesByRoom.value[roomId]) {
          messagesByRoom.value[roomId] = messagesByRoom.value[roomId].map((msg) =>
            (!recipientId || msg.recipientId === recipientId)
              ? { ...msg, unreadMessagesCount: 0 }
              : msg
          );
        }
      } else {
        console.error("Failed to mark message as read:", response);
      }
    });
  };

  onMounted(() => {
    initializeSocket();
  });

  onUnmounted(() => {
    if (socket.value) {
      socket.value.off("message.new");
      socket.value.off("messages.update");
      socket.value.disconnect();
      socket.value = null;
    }
  });

  return {
    newMessage,
    isConnected,
    sendMessage,
    socket: socket.value,
    messagesByRoom,
    currentRoomMessages,
    setActiveRoom,
    activeRoomId,
    messageStatus,
    markMessageAsRead
  };
};