import type { Task } from "@/stores/tasks";
import type { Badge } from "@/components/TaskBadges.vue";

export default function* (task: Task): Generator<Badge> {
  if (task.done) {
    yield { label: task.doneDate || "Unknown", cssClass: ["badge-success"] };
  }
}
