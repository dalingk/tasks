import type { Task } from "@/stores/tasks";
import type { Badge } from "@/components/TaskBadges.vue";

// This may match too much stuff
const repositoryRe = /[Gg]ithub:([\w-]+\/.+?)(?:[ ]|$)/g;

export default function* (task: Task): Generator<Badge> {
  for (const match of task.text.matchAll(repositoryRe)) {
    yield { label: match[1], url: `https://github.com/${match[1]}` };
  }
}
