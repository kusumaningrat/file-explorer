<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  node: any
  expanded: Set<string>
  selected: any
}>()
defineEmits(['toggle', 'select'])

const hasChildren = computed(() => props.node.children && props.node.children.length > 0)
const isExpanded = computed(() => props.expanded.has(props.node.slug))
</script>

<template>
  <div>
    <div
      class="folder-item"
      :class="{ selected: selected?.id === node.id }"
      @click.stop="$emit('select', node)"
    >
      <span v-if="hasChildren" class="expand-icon" @click.stop="$emit('toggle', node)">
        {{ isExpanded ? '▼' : '▶' }}
      </span>

      <!-- 📂 Folder Icon -->
      <span class="material-icons folder-icon">
        {{ isExpanded ? 'folder_open' : 'folder' }}
      </span>

      <span class="folder-name">{{ node.name }}</span>
    </div>

    <div v-if="isExpanded && hasChildren" class="children ml-4">
      <FolderNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :expanded="expanded"
        :selected="selected"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.folder-item {
  cursor: pointer;
  padding: 5px 9px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.folder-item.selected {
  background-color: #e0e0e0;
}
.folder-item:hover {
  background-color: #f0f0f0;
}
.expand-icon {
  font-size: 10px;
  margin-right: 3px;
}
.folder-icon {
  font-size: 18px;
  color: #fbc02d; /* yellow folder */
}
.children {
  margin-left: 20px;
}
</style>
