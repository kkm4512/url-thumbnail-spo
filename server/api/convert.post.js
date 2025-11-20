import { readBody } from "h3"
import * as cheerio from "cheerio"
import { promises as fs } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import nodeFetch from "node-fetch"

export const runtime = "nodejs"

export default defineEventHandler(async (event) => {
  const { url: instaUrl } = await readBody(event)

  if (!instaUrl || !instaUrl.includes("instagram.com")) {
    return { error: "올바른 Instagram URL을 입력해주세요." }
  }

  try {
    // ---------------------------------------------------------
    // 1) Instagram HTML 요청 (강한 UA - BOT 우회)
    // ---------------------------------------------------------
    const res = await nodeFetch(instaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document"
      }
    })

    const html = await res.text()
    const $ = cheerio.load(html)

    const ogImage = $('meta[property="og:image"]').attr("content")
    if (!ogImage) throw new Error("OG:image를 찾을 수 없음")

    // 현재 timestamp (24시간 자동삭제용)
    const timestamp = Date.now()

    // ---------------------------------------------------------
    // 2) 이미지 다운로드 → public/images/
    // ---------------------------------------------------------
    const name = `instgram_thumbnail_${timestamp}_${uuidv4()}`
    const imgRes = await nodeFetch(ogImage)
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer())

    const imgFilename = `${name}.jpg`
    const imagesDir = path.join(process.cwd(), "public", "images")
    await fs.mkdir(imagesDir, { recursive: true })

    const imgSavePath = path.join(imagesDir, imgFilename)
    await fs.writeFile(imgSavePath, imgBuffer)

    const localImageUrl = `/images/${imgFilename}`

    // ---------------------------------------------------------
    // 3) preview HTML 생성 → public/htmls/
    // ---------------------------------------------------------
    const htmlFilename = `${name}.html`

    const previewHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta property="og:title" content="Instagram Thumbnail" />
    <meta property="og:image" content="${localImageUrl}" />
    <meta http-equiv="refresh" content="0; url=${instaUrl}" />
</head>
<body>
<script>location.href="${instaUrl}"</script>
Redirecting...
</body>
</html>
`

    const htmlsDir = path.join(process.cwd(), "public", "htmls")
    await fs.mkdir(htmlsDir, { recursive: true })

    const htmlSavePath = path.join(htmlsDir, htmlFilename)
    await fs.writeFile(htmlSavePath, Buffer.from(previewHtml, "utf-8"))

    const previewUrl = `/htmls/${htmlFilename}`

  // 🔥 절대 경로 생성
  const reqUrl = getRequestURL(event)         // https://example.com/api/convert
  const domain = `${reqUrl.protocol}//${reqUrl.host}`  // https://example.com

  const absolutePreviewUrl = `${domain}${previewUrl}`
  const absoluteThumbnailUrl = `${domain}${localImageUrl}`

  return {
    success: true,
    previewUrl: absolutePreviewUrl,   // ← 절대경로
    thumbnail: absoluteThumbnailUrl,  // ← 절대경로
    originalUrl: instaUrl
  }

  } catch (err) {
    console.error("convert API error:", err)
    return { error: "이미지 처리 중 오류 발생" }
  }
})
