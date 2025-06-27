import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Settings from "@/views/Settings.vue";
import Upload from "@/views/Upload.vue";
import Patient from "@/views/Patient.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/upload",
    name: "Upload",
    component: Upload,
  },
  {
    path: "/patient/:id",
    name: "Patient",
    component: Patient,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
