<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LeftPanel from './components/LeftPanel.vue'
import RightPanel from './components/RightPanel.vue'
import axios from 'axios'

const computerName = ref('')
import type { Ref } from 'vue'
import { getFolderChildren, getFolderTree, getRootFolder } from './api'

const rootFolder = ref<any>(null)
const expanded: Ref<Set<string>> = ref(new Set<string>())
const selectedFolder = ref<any>(null)
const path = ref<any[]>([])

const showFileDropdown = ref(false)

function buildPath(targetFolder: any, currentTree: any, currentPath: any[]): any[] | null {
  if (!currentTree) return null

  const nodeInPath = { id: currentTree.id, name: currentTree.name, slug: currentTree.slug }
  const newPath = [...currentPath, nodeInPath]

  if (currentTree.id === targetFolder.id) {
    return newPath
  }

  if (currentTree.children) {
    for (const child of currentTree.children) {
      const foundPath = buildPath(targetFolder, child, newPath)
      if (foundPath) return foundPath
    }
  }
  return null
}

onMounted(async () => {
  try {
    const data = await getRootFolder()
    if (data && data.length > 0) {
      rootFolder.value = { ...data[0], children: [] }
      const children = await getFolderChildren(rootFolder.value.id)
      rootFolder.value.children = children
      path.value = [rootFolder.value]
      // selectedFolder.value = rootFolder.value
    }
  } catch (error) {
    console.error('Error fetching folder data:', error)
  }
})

async function toggleExpand(folder: any) {
  const { slug, id } = folder
  if (expanded.value.has(slug)) {
    expanded.value.delete(slug)
  } else {
    expanded.value.add(slug)
    if (!folder.children || folder.children.length === 0) {
      try {
        const children = await getFolderChildren(id)
        folder.children = children
      } catch (error) {
        console.error(`Error fetching children for folder ${id}:`, error)
      }
    }
  }
}

async function selectFolder(folder: any) {
  try {
    const folderData = await getFolderTree(folder.id)
    selectedFolder.value = folderData

    const fullBreadcrumbPath = buildPath(folder, rootFolder.value, [])
    if (fullBreadcrumbPath) {
      path.value = fullBreadcrumbPath
    } else {
      path.value = [
        {
          id: selectedFolder.value.id,
          name: selectedFolder.value.name,
          slug: selectedFolder.value.slug,
        },
      ]
    }
  } catch (error) {
    console.error(`Error selecting folder ${folder.id}:`, error)
  }
}

function toggleFileDropdown() {
  showFileDropdown.value = !showFileDropdown.value
}

function closeFileDropdown() {
  showFileDropdown.value = false
}

function handleCreateFolder() {
  closeFileDropdown()
  console.log('Create new Folder clicked from App.vue header!')
  // Implement logic for creating a new folder here (e.g., open a modal)

  if (!selectedFolder.value) {
    alert('Please select a folder first to create a new folder inside it.')
    return
  }

  if (!selectedFolder.value.children) {
    selectedFolder.value.children = []
  }

  const newFolder = {
    id: Date.now().toString(),
    name: 'New Folder',
    slug: `new-folder-${Date.now()}`,
    children: [],
    isEditing: true,
  }
  selectedFolder.value.children.push(newFolder)
  expanded.value.add(selectedFolder.value.slug)
  console.log('New folder created:', newFolder)
}

function handleCreateFile() {
  closeFileDropdown()
  console.log('Create new File clicked from App.vue header!')
  // Implement logic for creating a new file here (e.g., open a modal)
}

// getBreadCrumbPath and findFolderPath are no longer needed
// function findFolderPath(root: any, target: any): any {
//   if (!root.children) return null
//   for (const child of root.children) {
//     if (child.id === target.id) {
//       return root
//     }
//     const path = findFolderPath(child, target)
//     if (path) return path
//   }
// }

// async function getBreadCrumbPath(folder: any) {
//   const path: any[] = []
//   let current = folder
//   while (current) {
//     path.unshift(current)
//     current = findFolderPath(rootFolderData, current)
//   }
//   return path
// }
</script>

<template>
  <div class="header">
    <div class="file-menu-container">
      <button @click="toggleFileDropdown" class="file-button">File</button>
      <div v-if="showFileDropdown" class="file-dropdown-menu">
        <button @click="handleCreateFolder" class="dropdown-item new-folder-input">
          Create new Folder
        </button>
        <button @click="handleCreateFile" class="dropdown-item">Create new File</button>
      </div>
    </div>
  </div>
  <div class="container">
    <LeftPanel
      panelHeader="PeternakClouds"
      :path="rootFolder"
      :expanded="expanded"
      :selected="selectedFolder"
      @toggle="toggleExpand"
      @select="selectFolder"
    />
    <RightPanel :folder="selectedFolder" :breadcrumbs="path" @select="selectFolder" />
  </div>
</template>
<style scoped>
.header {
  background-color: #f0f0f0;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 10;
}
.header-title {
  flex-grow: 1;
  text-align: left;
  margin-left: 1rem;
}
.container {
  display: flex;
  height: calc(100vh - 4rem);
}

.file-menu-container {
  position: relative;
  margin-right: 1rem;
}

.file-button {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.file-button:hover {
  background-color: #e0e0e0;
}

.file-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 50;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.dropdown-item {
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  text-align: left;
  cursor: pointer;
  width: 100%;
  font-size: 0.9rem;
  color: #333;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
