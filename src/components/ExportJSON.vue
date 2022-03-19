<script setup lang="ts">
import { useTaskStore } from "@/stores/tasks";
const taskStore = useTaskStore();
function copyJSON() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(taskStore.json);
  } else {
    window.location.href = "#json";
  }
}
</script>

<template>
  <div class="form-group">
    <button class="btn btn-block" @click="copyJSON">Copy as JSON</button>
  </div>
  <div class="form-group">
    <a href="#json" class="btn btn-block">Import JSON</a>
  </div>
</template>
