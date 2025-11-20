import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async () => {
  const countFilePath = path.join(process.cwd(), 'server/data/count.json')

  try {
    const fileContent = await fs.readFile(countFilePath, 'utf-8')
    const data = JSON.parse(fileContent)
    return { count: data.count || 0 }
  } catch (e) {
    return { count: 0 }
  }
})
