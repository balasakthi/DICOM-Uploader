<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <template v-slot:prepend>
        <v-list-item
          lines="two"
          subtitle="DICOM Uploader"
          title="DICOM Uploader"
        >
          <template v-slot:prepend>
            <v-avatar color="primary">
              <v-icon>mdi-tray-arrow-up</v-icon>
            </v-avatar>
          </template>
        </v-list-item>
      </template>

      <v-divider></v-divider>
      <v-list density="compact" item-props :items="items" nav />

      <template #append>
        <v-list-item
          class="ma-2 bg-primary"
          link
          nav
          prepend-icon="mdi-cog-outline"
          title="Settings"
          to="/settings"
        />
      </template>
    </v-navigation-drawer>
    <v-app-bar>
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          :icon="drawer ? 'mdi-menu-open' : 'mdi-menu-close'"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>Application</v-app-bar-title>
      <template v-slot:append>
        <v-btn size="small" variant="text" flat>
          <v-badge color="success" dot>
            <v-icon size="large">mdi-bell-outline</v-icon>
          </v-badge>
        </v-btn>

        <v-btn
          size="small"
          variant="text"
          :icon="
            theme.global.current.value.dark
              ? 'mdi-weather-sunny'
              : 'mdi-weather-night'
          "
          flat
          @click="toggleTheme"
        ></v-btn>

        <v-btn
          size="small"
          variant="text"
          icon="mdi-account-circle-outline"
        ></v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTheme } from "vuetify";

const drawer = ref(null);
const theme = useTheme();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  localStorage.setItem("theme", theme.global.name.value);
}

onMounted(async () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }
});

const items = ref([
  {
    title: "All studies",
    prependIcon: "mdi-clipboard-text-multiple-outline",
    link: true,
    to: "/",
  },
  {
    title: "Upload",
    prependIcon: "mdi-file-upload-outline",
    link: true,
    to: "/upload",
  },
]);
</script>
