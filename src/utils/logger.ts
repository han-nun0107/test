const isDevelopment = import.meta.env.DEV;

export const logError = (context: string, error: unknown): void => {
  if (isDevelopment) {
    console.error(`[${context}]`, error);
  }
  // 프로덕션에서는 에러 모니터링 서비스로 전송 가능
  // 예: Sentry, LogRocket 등
};
