<script setup lang="ts">
import { reactive } from "vue";
import { useTaskStore } from "@/stores/tasks";

const taskStore = useTaskStore();

const today = new Date();
const todayString = [
  today.getFullYear(),
  (today.getMonth() + 1).toString().padStart(2, "0"),
  today.getDate().toString().padStart(2, "0"),
].join("-");

const newTask = reactive({ text: "", date: todayString });

function addNewTask() {
  taskStore.createTask(newTask.text, newTask.date);
  newTask.text = "";
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
