<script setup lang="ts">
import "./assets/halfmoon.min.css";
import ImportModal from "./components/ImportModal.vue";
import NewTask from "./components/NewTask.vue";
import ExportJSON from "./components/ExportJSON.vue";
import Tasks from "./components/Tasks.vue";
</script>

<template>
  <ImportModal />
  <div class="page-wrapper">
    <div class="content-wrapper">
      <div class="container-xl">
        <div class="row">
          <div class="col-lg-4">
            <div class="content position-lg-sticky" style="top: 3rem">
              <NewTask />
              <ExportJSON />
            </div>
          </div>
          <div class="col-lg-8">
            <Tasks></Tasks>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
