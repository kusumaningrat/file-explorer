<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  folder: any
  breadcrumbs: any[]
  onSaveFolder: (folder: any) => void
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
    <!-- Breadcrumb -->
    <div class="breadcrumb mb-2">
      <template v-if="breadCrumbData.length">
        <span class="breadcrumb-path">
          <span
            v-for="(item, index) in breadCrumbData"
            :key="item.id"
            class="breadcrumb-item"
            @click="$emit('select', item)"
          >
            <span class="material-icons breadcrumb-icon">folder</span>
            {{ item.name }}
            <span v-if="index < breadCrumbData.length - 1"> &gt; </span>
          </span>
        </span>
      </template>
      <div v-else>Select a folder to view its contents</div>
    </div>

    <!-- Subfolder List -->
    <div v-if="folder && folder.children?.length" class="subfolder-list">
      <div
        v-for="subfolder in folder.children"
        :key="subfolder.id"
        class="subfolder-item"
        @click="$emit('select', subfolder)"
      >
        <span class="material-icons subfolder-icon">folder</span>
        <input
          v-if="subfolder.isEditing"
          v-model="subfolder.name"
          @blur="props.onSaveFolder(subfolder)"
          @keyup.enter="props.onSaveFolder(subfolder)"
          class="rename-input"
          autofocus
        />
        <span v-else>{{ subfolder.name }}</span>
      </div>
    </div>

    <!-- Empty Folder -->
    <div v-else-if="folder">This folder is empty</div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.right-panel {
  flex-grow: 1;
  padding: 1rem;
}

/* Breadcrumb */
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
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.breadcrumb-item:hover {
  text-decoration: none;
}
.breadcrumb-path > span:last-child {
  font-weight: bold;
}
.breadcrumb-icon {
  font-size: 16px;
  color: #fbc02d;
}

/* Subfolder */
.subfolder-item {
  cursor: pointer;
  padding: 5px 9px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.subfolder-item:hover {
  background-color: #f0f0f0;
}
.subfolder-icon {
  font-size: 18px;
  color: #fbc02d;
}

.rename-input {
  border: 1px solid #ccc;
  padding: 2px 3px;
  font-size: 0.9rem;
  text-align: center;
  width: 100px;
  border-radius: 4px;
}
</style>
