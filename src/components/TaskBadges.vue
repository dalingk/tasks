<script setup lang="ts">
export interface Badge {
  label: string;
  url?: string;
  cssClass?: string[];
}
import { computed } from "vue";
import badgeFunctions from "@/badgeFunctions";
const props = defineProps(["task"]);

const badges = computed((): Badge[] => {
  const badges: Badge[] = [];
  for (const badgeFn of badgeFunctions) {
    for (const newBadge of badgeFn(props.task)) {
      badges.push(newBadge);
    }
  }
  return badges;
});
</script>

<template>
  <template v-for="badge in badges" :key="badge.label">
    <a :href="badge.url" class="badge mr-5" v-if="badge.url">{{
      badge.label
    }}</a>
    <span class="badge mr-5" v-else :class="badge.cssClass">
      {{ badge.label }}
    </span>
  </template>
</template>
