import { promises as fs } from "fs"
import path from "path"

export default defineEventHandler(async () => {
  const filePath = path.join(process.cwd(), 'server/data/count.json')

  try {
    // JSON 읽기
    const text = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(text)

    data.count = (data.count || 0) + 1

    // JSON 다시 저장
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))

    return { success: true, count: data.count }
  } catch (e) {
    // 파일이 없으면 새로 만들기
    const initData = { count: 1 }
    await fs.writeFile(filePath, JSON.stringify(initData, null, 2))

    return { success: true, count: 1 }
  }
})
