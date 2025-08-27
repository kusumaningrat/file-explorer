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
      selectedFolder.value = rootFolder.value
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
  <div class="header">File Explorer</div>
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
