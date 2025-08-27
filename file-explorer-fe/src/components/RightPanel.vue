// RightPanel.vue
<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{
  folder: any
  breadcrumbs: any[]
}>()
defineEmits(['select'])
const breadCrumbData = ref<any[]>([])
watch(
  () => props.breadcrumbs,
  (newVal) => {
    breadCrumbData.value = newVal
  },
  { immediate: true },
)
</script>
<template>
  <div class="right-panel">
    <div class="breadcrumb mb-2">
      <template v-if="breadCrumbData.length">
        <span class="breadcrumb-path">
          <span
            v-for="(item, index) in breadCrumbData"
            :key="item.id"
            class="breadcrumb-item"
            @click="$emit('select', item)"
          >
            {{ item.name }} {{ index < breadCrumbData.length - 1 ? ' > ' : '' }}
          </span>
        </span>
      </template>
      <div v-else>Select a folder to view its contents</div>
    </div>
    <div v-if="folder && folder.children?.length" class="subfolder-list">
      <div
        v-for="subfolder in folder.children"
        :key="subfolder.id"
        class="subfolder-item"
        @click="$emit('select', subfolder)"
      >
        {{ subfolder.name }}
      </div>
    </div>
    <div v-else-if="folder">This folder is empty</div>
  </div>
</template>
<style scoped>
.right-panel {
  flex-grow: 1;
  padding: 1rem;
}
.breadcrumb {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 10px;
  gap: 5px;
}
.breadcrumb-item {
  cursor: pointer;
  color: #283ebe;
  white-space: nowrap;
}
.breadcrumb-item:hover {
  text-decoration: underline;
}
.breadcrumb-path > span:last-child {
  font-weight: bold;
}
.subfolder-item {
  cursor: pointer;
  padding: 5px 9px;
  border-radius: 4px;
  white-space: inherit;
}
.subfolder-item:hover {
  background-color: #f0f0f0;
}
</style>
