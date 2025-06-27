<template>P User {{ $route.params.id }}</template>

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
