<template>
  <v-container class="pa-md-12">
    <section>
      <h1
        class="d-flex justify-space-between align-center text-h5 font-weight-bold"
      >
        All Local Studies

        <v-btn
          class="text-none"
          color="primary"
          prepend-icon="mdi-file-upload-outline"
          rounded="lg"
          slim
          text="Upload"
          variant="flat"
          to="/upload"
        />
      </h1>

      <div class="text-body-2 text-medium-emphasis mb-4 w-100 w-md-75">
        A list of all the patients that are currently stored.
      </div>

      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>

      <v-data-table
        class="bg-transparent"
        :headers="headers"
        :search="search"
        :items="items"
      >
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-btn
              density="compact"
              size="small"
              class="text-none"
              icon="mdi-eye-outline"
              variant="text"
              :to="`/patient/${item.ID}`"
            />

            <v-btn
              density="compact"
              size="small"
              class="text-none"
              icon="mdi-pencil-outline"
              variant="text"
            />

            <v-btn
              density="compact"
              size="small"
              class="text-none"
              color="error"
              icon="mdi-delete-outline"
              variant="text"
              @click="deleteStudy(item.ID)"
            />
          </div>
        </template>
      </v-data-table>
    </section>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";

const items = ref([]);
const search = ref("");

const headers = [
  { title: "Patient ID", key: "ID" },
  { title: "Name", key: "PatientMainDicomTags.PatientName" },
  { title: "Birth Date", key: "PatientMainDicomTags.PatientBirthDate" },
  { title: "Sex", key: "PatientMainDicomTags.PatientSex" },
  { title: "Study Description", key: "MainDicomTags.StudyDescription" },
  { title: "Study Date", key: "MainDicomTags.StudyDate" },
  { title: "Modalities in Study", key: "RequestedTags.ModalitiesInStudy" },
  { title: "Actions", key: "actions", sortable: false },
];

const baseUrl = import.meta.env.VITE_ORTHANC_URL;
const credentials = btoa(
  `${import.meta.env.VITE_ORTHANC_USERNAME}:${
    import.meta.env.VITE_ORTHANC_PASSWORD
  }`
);

console.log("Base URL:", baseUrl);

onMounted(async () => {
  try {
    const res = await fetch(`${baseUrl}/tools/find`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Level: "Study",
        Limit: 50,
        Query: {},
        RequestedTags: [
          "ModalitiesInStudy",
          "NumberOfStudyRelatedInstances",
          "NumberOfStudyRelatedSeries",
        ],
        Expand: true,
        OrderBy: [{ Type: "Metadata", Key: "LastUpdate", Direction: "DESC" }],
      }),
    });

    const data = await res.json();
    items.value = data;
  } catch (error) {
    console.error("Error fetching:", error);
  }
});

async function deleteStudy(studyId) {
  if (!confirm("Are you sure you want to delete this study?")) return;

  try {
    const res = await fetch(`${baseUrl}/studies/${studyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });

    if (res.ok) {
      // Remove deleted study from the table
      items.value = items.value.filter((study) => study.ID !== studyId);
    } else {
      console.error("Failed to delete:", await res.text());
    }
  } catch (err) {
    console.error("Error deleting study:", err);
  }
}
</script>
