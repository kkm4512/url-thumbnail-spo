import { cleanupOldFiles } from "../utils/cleanup";

export default defineNitroPlugin(() => {
  // 서버 시작 시 5초 후 첫 실행
  setTimeout(() => {
    cleanupOldFiles();
  }, 5000);

  // 1시간마다 자동 실행
  setInterval(() => {
    cleanupOldFiles();
  }, 60 * 60 * 1000);

  console.log("[CLEANUP] 파일 자동 삭제 스케줄러 활성화됨");
});
