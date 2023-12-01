import { defineStore } from "pinia";

export interface Task {
  text: string;
  date: string;
  done?: boolean;
  open?: boolean;
  doneDate?: string;
  notes?: string | string[];
}

export interface State {
  tasks: { string: Task };
}

function dateString(date: Date): string {
  const padMonth = (1 + date.getMonth()).toString().padStart(2, "0");
  const padDate = date.getDate().toString().padStart(2, "0");
  return `${date.getFullYear()}-${padMonth}-${padDate}`;
}

function splitNewline(input: string): string[] {
  let lastIdx = 0;
  let nextIdx = 0;
  const outputArray = [];
  while ((nextIdx = input.indexOf("\n", lastIdx)) >= 0) {
    outputArray.push(input.slice(lastIdx, nextIdx + 1));
    lastIdx = nextIdx + 1;
  }
  if (lastIdx != input.length) {
    outputArray.push(input.slice(lastIdx, input.length));
  }
  return outputArray;
}

function parseDate(inputDate: string): Date {
  const [year, month, date] = inputDate
    .split(/\D/)
    .map((i) => Number.parseInt(i));
  return new Date(year, month - 1, date);
}

function createId() {
  const array = new Uint8Array(18);
  window.crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

export const useTaskStore = defineStore("tasks", {
  state: () => {
    return { tasks: JSON.parse(window.localStorage.getItem("tasks") || "{}") };
  },
  getters: {
    byDate: (state: State): Map<number, Map<string, Task>> => {
      const grouped: Map<number, Map<string, Task>> = new Map();
      for (const [id, task] of Object.entries(state.tasks)) {
        const taskDate = parseDate(task.date).getTime();
        if (!grouped.get(taskDate)) {
          grouped.set(taskDate, new Map());
        }
        grouped.get(taskDate)?.set(id, task);
      }
      return new Map([...grouped.entries()].sort((a, b) => a[0] - b[0]));
    },
    json: (state: State): string => {
      return JSON.stringify(state.tasks, null, 4);
    },
  },
  actions: {
    saveTasks() {
      window.localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    importJSON(inputJSON: string): boolean {
      try {
        const parsedJSON: { string: Task } = JSON.parse(inputJSON);
        Object.values(parsedJSON).forEach((task: Task) => {
          if (task.notes && typeof task.notes === "string") {
            task.notes = splitNewline(task.notes);
          }
        });
        this.tasks = parsedJSON;
        this.saveTasks();
      } catch {
        return false;
      }
      return true;
    },
    createTask(text: string, date: string): string {
      const newId = createId();
      this.tasks[newId] = { text, date, done: false };
      this.saveTasks();
      return newId;
    },
    completeTask(id: string) {
      const task = this.tasks[id];
      task.done = !task.done;
      if (task.done) {
        task.doneDate = dateString(new Date());
      } else {
        delete task.doneDate;
      }
      this.saveTasks();
    },
    setOpen(id: string, open: boolean) {
      const task = this.tasks[id];
      task.open = open;
      if (!task.open) {
        delete task.open;
      }
      this.saveTasks();
    },
    updateTask(id: string, task: Task) {
      const oldTask = this.tasks[id];
      if (!oldTask.done && task.done) {
        task.doneDate = dateString(new Date());
      } else if (oldTask.done && !task.done) {
        delete task.doneDate;
      }
      if (
        Object.prototype.hasOwnProperty.call(task, "notes") &&
        typeof task.notes === "string"
      ) {
        task.notes = splitNewline(task.notes);
      }
      if (task.notes?.length === 0) {
        delete task.notes;
      }
      this.tasks[id] = task;
      this.saveTasks();
    },
    deleteTask(id: string) {
      delete this.tasks[id];
      this.saveTasks();
    },
  },
});
