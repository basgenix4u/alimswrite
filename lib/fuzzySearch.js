// lib/fuzzySearch.js
import Fuse from 'fuse.js'

// Fuzzy search for departments
export function searchDepartments(departments, query) {
  if (!query || query.length < 2) return departments.slice(0, 10)

  // Flatten departments with their aliases for searching
  const searchableItems = departments.flatMap(dept => {
    const items = [{ ...dept, searchName: dept.name }]
    
    if (dept.aliases && dept.aliases.length > 0) {
      dept.aliases.forEach(alias => {
        items.push({ ...dept, searchName: alias })
      })
    }
    
    return items
  })

  const fuse = new Fuse(searchableItems, {
    keys: ['searchName'],
    threshold: 0.4, // Lower = more strict, Higher = more fuzzy
    includeScore: true,
    minMatchCharLength: 2
  })

  const results = fuse.search(query)
  
  // Remove duplicates (same department from alias match)
  const seen = new Set()
  const uniqueResults = results.filter(result => {
    if (seen.has(result.item.id)) return false
    seen.add(result.item.id)
    return true
  })

  return uniqueResults.map(r => r.item).slice(0, 10)
}

// Fuzzy search for topics
export function searchTopics(topics, query) {
  if (!query || query.length < 2) return topics

  const fuse = new Fuse(topics, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'keywords', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'department.name', weight: 0.1 }
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2
  })

  return fuse.search(query).map(r => r.item)
}

// Fuzzy search for blog posts
export function searchBlogPosts(posts, query) {
  if (!query || query.length < 2) return posts

  const fuse = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'excerpt', weight: 0.2 },
      { name: 'tags', weight: 0.2 },
      { name: 'keywords', weight: 0.2 }
    ],
    threshold: 0.4,
    includeScore: true
  })

  return fuse.search(query).map(r => r.item)
}