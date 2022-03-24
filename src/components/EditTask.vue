<script setup lang="ts">
import { computed } from "vue";
import { useTaskStore } from "@/stores/tasks";

const emit = defineEmits(["doneEditing"]);
const props = defineProps(["task", "id"]);

const task = computed(() => {
  const newTask = Object.assign({}, props.task);
  if (newTask.notes && Array.isArray(newTask.notes)) {
    newTask.notes = newTask.notes.join("");
  }
  return newTask;
});

const taskStore = useTaskStore();

function updateTask() {
  taskStore.updateTask(props.id, task.value);
  emit("doneEditing");
}
</script>

<template>
  <div class="collapse-content">
    <form @submit.prevent="updateTask">
      <div class="form-group">
        <input type="text" class="form-control" v-model="task.text" />
      </div>
      <div class="form-group">
        <input type="date" v-model="task.date" class="form-control" />
      </div>
      <div class="form-group">
        <div class="custom-checkbox">
          <input type="checkbox" v-model="task.done" :id="`check-${id}`" />
          <label :for="`check-${id}`">Done</label>
        </div>
      </div>
      <div class="form-group">
        <textarea v-model="task.notes" class="form-control"></textarea>
      </div>
      <div class="form-group form-inline">
        <input
          type="submit"
          value="Update"
          class="btn btn-primary form-control"
        />
        <button class="btn form-control" @click="$emit('doneEditing')">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
