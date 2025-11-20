import fs from "fs/promises"
import path from "path"

// 테스트용 1분
const ONE_DAY = 24 * 60 * 60 * 1000

export async function cleanupOldFiles() {
  const baseDir = process.cwd()

  const folders = [
    path.join(baseDir, "public", "images"),
    path.join(baseDir, "public", "htmls")
  ]

  const now = Date.now()

  for (const folder of folders) {
    try {
      const files = await fs.readdir(folder)

      for (const file of files) {

        // 파일명 구조:
        // instgram_thumbnail_TIMESTAMP_UUID.ext
        const parts = file.split("_")

        if (parts.length < 3) continue

        // timestamp 추출
        const timestamp = Number(parts[2])

        if (isNaN(timestamp)) continue

        // 만료 체크
        if (now - timestamp >= ONE_DAY) {
          const filePath = path.join(folder, file)
          await fs.unlink(filePath)
          console.log(`[CLEANUP] 삭제됨 → ${filePath}`)
        }
      }

    } catch (e) {
      console.error("[CLEANUP ERROR]", e)
    }
  }
}
