import { defineStore } from "pinia";

export interface Task {
  id: string;
  text: string;
  date: string;
  done?: boolean;
  open?: boolean;
  doneDate?: string;
  notes?: string;
}

export interface State {
  tasks: { string: Task };
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
    return { tasks: JSON.parse(window.localStorage.getItem("tasks") || "") };
  },
  getters: {
    byDate: (state: State): Map<number, [Task]> => {
      const grouped: Map<number, [Task]> = new Map();
      for (const task of Object.values(state.tasks)) {
        const taskDate = parseDate(task.date).getTime();
        let arr = null;
        if ((arr = grouped.get(taskDate))) {
          arr.push(task);
        } else {
          grouped.set(taskDate, [task]);
        }
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
        const parsedJSON = JSON.parse(inputJSON);
        this.tasks = parsedJSON;
        this.saveTasks();
      } catch {
        return false;
      }
      return true;
    },
    createTask(text: string, date: string): string {
      const newId = createId();
      this.tasks[newId] = { id: newId, text, date, done: false };
      this.saveTasks();
      return newId;
    },
    completeTask(id: string) {
      const task = this.tasks[id];
      task.done = !task.done;
      if (task.done) {
        const today = new Date();
        const padMonth = today.getMonth().toString().padStart(2, "0");
        const padDate = today.getDate().toString().padStart(2, "0");
        task.doneDate = `${today.getFullYear()}-${padMonth}-${padDate}`;
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
      this.tasks[id] = task;
      this.saveTasks();
    },
    deleteTask(id: string) {
      delete this.tasks[id];
      this.saveTasks();
    },
  },
});
