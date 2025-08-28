import { reactive } from 'vue'
import { getFolderChildren, getRootFolder } from './api'

export async function fetchRootFolder() {
  try {
    const data = await getRootFolder()
    if (!data || data.length === 0) {
      throw new Error('No root folder found')
    }
    // Return a reactive root folder object
    return reactive({ ...data[0], children: [] })
  } catch (error) {
    console.error('Error fetching root folder:', error)
    throw error
  }
}

export async function fetchFolderChildren(folder: any) {
  try {
    const children = await getFolderChildren(folder.id)
    folder.children = children.map((child: any) =>
      reactive({ ...child, children: [], hasChildren: child.hasChildren || true }),
    )
    if (folder.children.length === 0) folder.fetched = true
    folder.hasChildren = folder.children.length > 0
  } catch (error) {
    console.error(`Error fetching children for folder ${folder.id}:`, error)
    throw error
  }
}
