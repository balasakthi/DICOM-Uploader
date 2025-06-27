<template>
  <v-container class="pa-md-12">
    <h1 class="text-h4 mb-8 font-weight-bold">Upload DICOM Files</h1>

    <v-container class="text-center" fluid>
      <v-file-input
        v-model="files"
        accept=".dcm,.dicom"
        color="primary"
        counter
        label="Select DICOM files"
        multiple
        prepend-icon="mdi-paperclip"
        variant="outlined"
        :show-size="1000"
      >
        <template v-slot:selection="{ fileNames }">
          <template v-for="(fileName, index) in fileNames" :key="fileName">
            <v-chip
              v-if="index < 2"
              class="me-2"
              color="primary"
              size="small"
              label
            >
              {{ fileName }}
            </v-chip>

            <span
              v-else-if="index === 2"
              class="text-overline text-grey-darken-3 mx-2"
            >
              +{{ files.length - 2 }} File(s)
            </span>
          </template>
        </template>
      </v-file-input>

      <div class="d-flex flex-column align-center ga-1">
        <v-btn
          color="primary"
          prepend-icon="mdi-file-multiple-outline"
          class="text-none"
          @click="uploadFiles"
          :disabled="!files || files.length === 0"
          :loading="uploading"
          rounded="lg"
          flat
        >
          Upload Files
        </v-btn>

        <p>or</p>

        <v-btn
          color="primary"
          class="text-none"
          @click="openFolderDialog"
          prepend-icon="mdi-folder-outline"
          rounded="lg"
          :disabled="uploading"
          flat
        >
          Select Folder
        </v-btn>

        <!-- Hidden file input for folder -->
        <input
          type="file"
          ref="folderInput"
          style="display: none"
          webkitdirectory
          @change="handleFolderUpload"
        />
      </div>

      <v-progress-linear
        class="mt-4"
        v-if="uploading"
        :model-value="progress"
        height="20"
        color="primary"
        striped
      >
        <strong>
          {{ uploaded.length }}/{{ files.length }}</strong
        ></v-progress-linear
      >

      <v-alert
        class="mt-8"
        v-if="uploaded.length && !uploading"
        type="success"
        closable
      >
        {{ uploaded.length }} File(s) uploaded successfully</v-alert
      >

      <v-alert
        class="mt-8"
        v-if="errors.length && !uploading"
        type="error"
        closable
      >
        {{ errors.length }} File(s) failed to upload</v-alert
      >
    </v-container>

    <div v-if="uploaded.length" class="mt-6">
      <p class="font-weight-medium">Uploaded files: {{ uploaded.length }}</p>
      <ul>
        <li v-for="(name, index) in uploaded" :key="index">{{ name }}</li>
      </ul>
    </div>

    <div v-if="errors.length" class="mt-4">
      <p class="font-weight-medium text-error">Failed files:</p>
      <ul>
        <li v-for="(name, index) in errors" :key="index">{{ name }}</li>
      </ul>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const files = ref([]);
const uploaded = ref([]);
const errors = ref([]);
const uploading = ref(false);
const progress = ref(0);

const baseUrl = import.meta.env.VITE_ORTHANC_URL;
const credentials = btoa(
  `${import.meta.env.VITE_ORTHANC_USERNAME}:${
    import.meta.env.VITE_ORTHANC_PASSWORD
  }`
);

const folderInput = ref(null);

function openFolderDialog() {
  folderInput.value?.click();
}

function handleFolderUpload(event) {
  const folderFiles = Array.from(event.target.files);
  files.value = [...files.value, ...folderFiles];
  uploadFiles();
}

async function uploadFiles() {
  if (!files.value.length) return;

  uploading.value = true;
  progress.value = 0;
  uploaded.value = [];
  errors.value = [];

  const BATCH_SIZE = 10; // Try 10 or 20 based on performance
  const fileList = [...files.value];
  let completed = 0;

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${baseUrl}/instances`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      uploaded.value.push(file.name);
    } catch (err) {
      console.error(`Failed to upload ${file.name}`, err);
      errors.value.push(file.name);
    } finally {
      completed++;
      progress.value = Math.round((completed / fileList.length) * 100);
    }
  };

  const runBatch = async (batch) => {
    await Promise.all(batch.map((file) => uploadFile(file)));
  };

  for (let i = 0; i < fileList.length; i += BATCH_SIZE) {
    const batch = fileList.slice(i, i + BATCH_SIZE);
    await runBatch(batch); // Wait for one batch to finish before starting the next
  }

  uploading.value = false;
  files.value = [];
}
</script>
