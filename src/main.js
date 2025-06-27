import "./assets/main.css";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#024230", // Dark forest green (used in text, buttons, footer)
          secondary: "#dad5cb", // Warm light beige (used in background blocks)
          accent: "#f4f1eb", // Very soft off-white background (main page background)
          background: "#ffffff", // Cards and clean sections
          surface: "#f4f1eb", // Used as main surface block backgrounds
        },
      },
      dark: {
        colors: {
          primary: "#4cd1ac", // Soft green-turquoise highlight for dark mode
          secondary: "#1b1b1b", // Very dark gray background
          accent: "#2d2d2d", // Dark beige/gray for content
          background: "#0f0f0f", // Page background
          surface: "#1e1e1e", // Card backgrounds
        },
      },
    },
  },
});

createApp(App).use(vuetify).use(router).mount("#app");
