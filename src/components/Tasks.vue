<script setup lang="ts">
import { micromark } from "micromark";
import { gfm, gfmHtml } from "micromark-extension-gfm";
import { computed, reactive } from "vue";
import { useTaskStore } from "@/stores/tasks";
import EditTask from "./EditTask.vue";
import TaskBadgesVue from "./TaskBadges.vue";
import { gfmTableClassHtml } from "@/util/MicromarkGFMTable";
const taskStore = useTaskStore();
const byDate = computed(() => taskStore.byDate);
const dateFormat = new Intl.DateTimeFormat([], {
  weekday: "long",
  month: "long",
  day: "numeric",
});
const isEditing = reactive(new Set());
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
    htmlExtensions: [gfmHtml(), gfmTableClassHtml],
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
          v-for="[id, task] in tasks.entries()"
          :key="id"
          class="collapse-panel"
          @toggle="wasOpened($event, id)"
          :open="task.open"
        >
          <summary class="collapse-header">
            <div class="custom-checkbox">
              <input type="checkbox" v-model="task.done" />
              <label></label>
              <TaskBadgesVue :task="task" />
              {{ task.text }}
            </div>
          </summary>
          <EditTask
            v-if="isEditing.has(id)"
            :id="id"
            :task="task"
            @doneEditing="isEditing.delete(id)"
          />
          <div class="collapse-content" v-else>
            <div class="btn-group">
              <button
                class="btn"
                :class="{ 'btn-success': !task.done }"
                @click="toggleTask(id)"
              >
                {{ task.done ? "Unfinished" : "Done" }}
              </button>
              <button class="btn" @click="isEditing.add(id)">Edit</button>
              <button class="btn btn-danger" @click="deleteTask(id)">
                Delete
              </button>
            </div>
            <div class="mt-15">
              <TaskBadgesVue :task="task" />
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
