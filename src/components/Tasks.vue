<script setup lang="ts">
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { computed, ref } from "vue";
import { useTaskStore } from "@/stores/tasks";
import EditTask from "./EditTask.vue";
const taskStore = useTaskStore();
const byDate = computed(() => taskStore.byDate);
const dateFormat = new Intl.DateTimeFormat([], {
  weekday: "long",
  month: "long",
  day: "numeric",
});
const isEditing = ref(false);
function deleteTask(id: string) {
  taskStore.deleteTask(id);
}
function toggleTask(id: string) {
  taskStore.completeTask(id);
}
function wasOpened(event: Event, id: string) {
  const target = event.target as HTMLDetailsElement;
  if (target) {
    taskStore.setOpen(id, target.open);
  }
}
function parseMarkdown(markdown: string) {
  return micromark(markdown, {
    extensions: [gfm()],
    htmlExtensions: [gfmHtml()],
  });
}
</script>

<template>
  <div>
    <div class="content" v-if="byDate.size == 0">
      <h1 class="content-title">No Tasks!</h1>
    </div>
    <div class="content" v-for="[date, tasks] in byDate" :key="date">
      <h1 class="content-title">{{ dateFormat.format(new Date(date)) }}</h1>
      <div class="collapse-group">
        <details
          v-for="task in tasks"
          :key="task.id"
          class="collapse-panel"
          @toggle="wasOpened($event, task.id)"
          :open="task.open"
        >
          <summary class="collapse-header">
            <div class="custom-checkbox">
              <input type="checkbox" v-model="task.done" />
              <label></label>
              {{ task.text }}
            </div>
          </summary>
          <EditTask
            v-if="isEditing"
            :task="task"
            @doneEditing="isEditing = false"
          />
          <div class="collapse-content" v-else>
            <div class="btn-group">
              <button
                class="btn"
                :class="{ 'btn-success': !task.done }"
                @click="toggleTask(task.id)"
              >
                {{ task.done ? "Unfinished" : "Done" }}
              </button>
              <button class="btn" @click="isEditing = true">Edit</button>
              <button class="btn btn-danger" @click="deleteTask(task.id)">
                Delete
              </button>
            </div>
            <div
              v-if="task.notes"
              class="mt-15"
              v-html="parseMarkdown(task.notes)"
            ></div>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>
