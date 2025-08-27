// LeftPanel.vue
<script setup lang="ts">
import FolderNode from './FolderNode.vue'
const props = defineProps<{
  panelHeader: string
  path: any
  expanded: Set<string>
  selected: any
}>()
defineEmits(['toggle', 'select'])
</script>
<template>
  <div class="left-panel">
    <div class="panel-header">{{ panelHeader }}</div>
    <div class="folder-path" id="folderPath">
      <FolderNode
        v-if="path"
        :node="path"
        :expanded="expanded"
        :selected="selected"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>
<style scoped>
.left-panel {
  width: 300px;
  border-right: 1px solid #ddd;
  padding: 1rem;
  overflow-y: auto;
}
.panel-header {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
