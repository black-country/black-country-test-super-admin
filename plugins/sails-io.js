import sailsIO from "sails.io.js";
import socketIOClient from "socket.io-client";

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize sails.io
  const io = sailsIO(socketIOClient);
  
  // Configure the socket URL
  io.sails.url = process.env.NUXT_ENV_API_URL || "";

  // Listen to WebSocket events
  io.socket.on("user", (message) => {
    switch (message.new) {
      case "followed":
        // Access store via nuxtApp
        nuxtApp.$store?.dispatch("userFollowed", message.notification);
        break;
    }
  });

  // Provide io to the app (accessible as $io)
  return {
    provide: {
      io: io
    }
  };
});