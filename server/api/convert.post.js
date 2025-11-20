import { readBody } from "h3"
import * as cheerio from "cheerio"
import { v4 as uuidv4 } from "uuid"
import nodeFetch from "node-fetch"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

export const runtime = "nodejs"

// R2 클라이언트 생성
function createR2Client(config) {
  return new S3Client({
    region: "auto",   // R2는 region 의미 없음 → 아무 값이나 가능
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretKey,
    },
  })
}


export default defineEventHandler(async (event) => {
  const { url: instaUrl } = await readBody(event)
  const config = useRuntimeConfig().r2

  if (!instaUrl || !instaUrl.includes("instagram.com")) {
    return { error: "올바른 Instagram URL을 입력해주세요." }
  }

  try {
    // ---------------------------------------------------------
    // 1) 인스타그램 HTML 요청
    // ---------------------------------------------------------
    const res = await nodeFetch(instaUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; SM-G973N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document",
        "Cache-Control": "max-age=0",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    })



    const html = await res.text()


    const $ = cheerio.load(html)

    // 캡션 span 찾기
    const captionSpan = $('span[class*="_ap3a"]').first()

    let captionText = ""
    let author = ""

    if (captionSpan.length > 0) {
      // 1) <br> 자동 개행 변환
      captionSpan.find("br").replaceWith("\n")

      // 2) span 전체 텍스트 (해시태그 포함)
      author = captionSpan.text().trim()

    }

    // 제목 + 해시태그가 들어있는 span
    const span = $('span._ap3a').first()

    let rawText = span.clone().children('a').remove().end().text().trim()
    // "사실은 말이야 나도 로그를 본적이 없어"

    const title = $('h1._ap3a').first().text().trim()


    // 해시태그 수집
    const hashtags = span.find('a[href*="/explore/tags/"]')
      .map((i, el) => $(el).text().trim())
      .get()
    // ["#개발", "#개발자", "#터틀넥", "#체인소맨"]


    console.log("author:", author)
    console.log("해시태그:", hashtags)
    console.log("title:", title)
    console.log("rawText:", rawText)


    // OG 이미지
    const ogImage = $('meta[property="og:image"]').attr("content")
    if (!ogImage) throw new Error("OG:image를 찾을 수 없음")

    // ---------------------------------------------------------
    // ⭐ Instagram 메타 JSON 파싱 (내용/작성자/시간)
    // ---------------------------------------------------------

    // timestamp
    const timestamp = Date.now()
    const name = `insta_${timestamp}_${uuidv4()}`

    // ---------------------------------------------------------
    // 2) 이미지 다운로드
    // ---------------------------------------------------------
    const imgRes = await nodeFetch(ogImage)
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer())

    // R2 업로드
    const r2 = createR2Client(config)
    const imgKey = `images/${name}.jpg`
    await r2.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: imgKey,
        Body: imgBuffer,
        ContentType: "image/jpeg",
      })
    )

    const imageUrl = `https://pub-335f8afbae124f10a1afd0acc4e424b8.r2.dev/${imgKey}`

    // ---------------------------------------------------------
    // 3) HTML 생성 (OG 태그 강화)
    // ---------------------------------------------------------
    const previewHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />

    <!-- OG 태그 (카톡 미리보기용) -->
    <meta property="og:title" content="${title || "Instagram Title" }"  />
    <meta property="og:description" content="${author || "Instagram Post"}" />
    <meta property="og:image" content="${imageUrl}" />

    <meta http-equiv="refresh" content="0; url=${instaUrl}" />

    <style>
        body { font-family: sans-serif; padding:50px; text-align:center; }
        .info { color:#555; font-size:15px; }
    </style>
</head>
<body>
    <p class="info">${author}님의 Instagram 게시물로 이동 중...</p>
    <script>location.href="${instaUrl}"</script>
</body>
</html>
`

    // R2 저장
    const htmlKey = `htmls/${name}.html`
    await r2.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: htmlKey,
        Body: previewHtml,
        ContentType: "text/html",
      })
    )

    const previewUrl = `https://pub-335f8afbae124f10a1afd0acc4e424b8.r2.dev/${htmlKey}`

    // ---------------------------------------------------------
    // 4) 결과 반환
    // ---------------------------------------------------------
    return {
      success: true,
      previewUrl,
      thumbnail: imageUrl,
      title,
      author,      
      originalUrl: instaUrl
    }

  } catch (err) {
    console.error("convert API error:", err)
    return { error: "이미지 처리 중 오류 발생" }
  }
})
