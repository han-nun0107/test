import Cookies from "js-cookie";
import { logError } from "./logger";

const CONSENT_STORAGE_KEY = "user_consent";
const CONSENT_COOKIE_KEY = "onu_user_consent";
const COOKIE_EXPIRES_DAYS = 365;

export type ConsentInfo = {
  consented: boolean;
  timestamp: string;
};

const saveCookie = (value: string): void => {
  Cookies.set(CONSENT_COOKIE_KEY, value, {
    expires: COOKIE_EXPIRES_DAYS,
    path: "/",
    sameSite: "Lax",
  });
};

export const saveConsentInfo = (consented: boolean): void => {
  if (!consented) return;

  try {
    const consentData: ConsentInfo = {
      consented: true,
      timestamp: new Date().toISOString(),
    };
    const consentJson = JSON.stringify(consentData);

    localStorage.setItem(CONSENT_STORAGE_KEY, consentJson);

    saveCookie(consentJson);
  } catch (error) {
    logError("동의 정보 저장", error);
  }
};

export const getConsentInfo = (): ConsentInfo | null => {
  try {
    let consentData = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (!consentData) {
      consentData = Cookies.get(CONSENT_COOKIE_KEY) || null;

      if (consentData) {
        localStorage.setItem(CONSENT_STORAGE_KEY, consentData);
      }
    }

    if (!consentData) return null;

    const parsed = JSON.parse(consentData) as ConsentInfo;
    return parsed?.consented === true ? parsed : null;
  } catch (error) {
    logError("동의 정보 조회", error);
    return null;
  }
};

export const hasConsent = (): boolean => {
  return getConsentInfo() !== null;
};

export const removeConsentInfo = (): void => {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    Cookies.remove(CONSENT_COOKIE_KEY, { path: "/" });
  } catch (error) {
    logError("동의 정보 삭제", error);
  }
};
