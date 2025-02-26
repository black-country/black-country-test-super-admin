export default {
  ssr: false,
  target: "static",
  router: {
    base: '/admin/'
  },
  app: {
    baseURL: '/admin/',
    head: {
      title: "Black Country - Admin",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/admin/favicon.svg" }],
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
      googleMapsApiKey:  process.env.VITE_GOOGLE_MAPS_API_KEY,
    },
  },
  router: {
    extendRoutes(routes: any, resolve: any) {
      // Adjust all routes to be prefixed with `/about/`
      routes.forEach((route: any) => {
        if (route.path !== '/admin') {
           route.path = `/admin${route.path}`
        }
      })
    }
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
          manualChunks(id: any) {
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