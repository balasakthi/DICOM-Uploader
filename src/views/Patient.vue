<template>
  <v-container>
    <v-breadcrumbs :items="items">
      <template v-slot:title="{ item }">
        {{ item.title }}
      </template>
    </v-breadcrumbs>

    <v-card flat>
      <v-card-text> Patient Id: {{ $route.params.id }}</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const patientId = route.params.id;

const baseUrl = import.meta.env.VITE_ORTHANC_URL;
const credentials = btoa(
  `${import.meta.env.VITE_ORTHANC_USERNAME}:${
    import.meta.env.VITE_ORTHANC_PASSWORD
  }`
);

const items = [
  {
    title: "View all",
    disabled: false,
    to: "/",
  },
  {
    title: "Patient",
    disabled: true,
    href: "breadcrumbs_link_1",
  },
];

onMounted(async () => {
  try {
    const res = await fetch(`${baseUrl}/studies/${patientId}/series`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Patient data:", data);
    } else {
    }
  } catch (err) {
    console.error("Error :", err);
  }
});
</script>
