<script setup lang="ts">
import { ref } from "vue";
import { useTaskStore } from "@/stores/tasks";
const input = ref("");
let jsonError = ref(false);
const taskStore = useTaskStore();
function importJSON() {
  if (taskStore.importJSON(input.value)) {
    window.location.href = "#";
    jsonError.value = false;
  } else {
    jsonError.value = true;
  }
}
</script>

<template>
  <div class="modal" id="json">
    <div class="modal-dialog">
      <div class="modal-content">
        <h5 class="modal-title">Import JSON</h5>
        <form @submit.prevent="importJSON">
          <div class="form-group" v-if="jsonError">
            <div class="alert alert-danger">Invalid JSON</div>
          </div>
          <div class="form-group">
            <textarea class="form-control" v-model="input"></textarea>
          </div>
          <div class="form-group form-inline">
            <input
              type="submit"
              value="Submit"
              class="btn btn-primary form-control"
            />
            <a href="#" class="btn form-control">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
