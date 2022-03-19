<script setup lang="ts">
import { reactive } from "vue";
import { useTaskStore } from "@/stores/tasks";

const taskStore = useTaskStore();

const newTask = reactive({ text: "", date: "" });

function addNewTask() {
  taskStore.createTask(newTask.text, newTask.date);
}
</script>

<template>
  <form @submit.prevent="addNewTask">
    <div class="form-group">
      <input
        type="text"
        class="form-control"
        v-model="newTask.text"
        placeholder="Add task"
      />
    </div>
    <div class="form-group">
      <input type="date" class="form-control" v-model="newTask.date" />
    </div>
    <div class="form-group">
      <input
        type="submit"
        class="form-control btn btn-primary"
        value="Add task"
      />
    </div>
  </form>
</template>
