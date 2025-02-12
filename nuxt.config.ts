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
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.svg" }],
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["/assets/css/main.css", "vue-multiselect/dist/vue-multiselect.css", '@vueup/vue-quill/dist/vue-quill.snow.css'],
  tailwindcss: {
    cssPath: "@/assets/css/main.css",
  },
  axios: {
    // Axios options here
    timeout: 10000, // Example: set timeout to 10 seconds
  },
  runtimeConfig: {
    public: {
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY // Ensure to set this environment variable
    },
  },
  plugins: [],
  vite: {
    optimizeDeps: {
      include: ['fast-deep-equal'],
    },
    build: {
      transpile: ['@vueup/vue-quill'],
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("pdfjs-dist")) {
              return "pdfjs";
            }
          },
        },
      },
    },
  },
  resolve: {
    alias: {
      fsevents: false, // Ignore fsevents
    },
  }
};
