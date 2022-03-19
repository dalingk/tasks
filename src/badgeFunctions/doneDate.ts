import type { Task } from "@/stores/tasks";
import type { Badge } from "@/components/TaskBadges.vue";

export default function* (task: Task): Generator<Badge> {
  if (task.doneDate) {
    yield { label: task.doneDate, cssClass: ["badge-success"] };
  }
}
