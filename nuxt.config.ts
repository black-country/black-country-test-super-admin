import { viteStaticCopy } from 'vite-plugin-static-copy'
export default {
  ssr: false,
  target: "static",
  app: {
    head: {
      title: "Black Country",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
      ],
      // script: [
      //   {
      //     src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyCTBVK36LVNlXs_qBOC4RywX_Ihf765lDg&libraries=places`, // Add your API key
      //     async: true,
      //     defer: true,
      //   },
      // ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" }],
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["/assets/css/main.css", "vue-multiselect/dist/vue-multiselect.css"],
  tailwindcss: {
    cssPath: "@/assets/css/main.css",
  },
  axios: {
    // Axios options here
    timeout: 10000, // Example: set timeout to 10 seconds
  },
  runtimeConfig: {
    // public: {
    //   googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY // Ensure to set this environment variable
    // },
  },
  plugins: [],
  vite: {
    optimizeDeps: {
      include: ['fast-deep-equal'],
    }
  },
  resolve: {
    alias: {
      fsevents: false, // Ignore fsevents
    },
  }
};
