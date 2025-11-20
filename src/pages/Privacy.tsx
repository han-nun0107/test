import {
  PRIVACY_SECTIONS,
  CONTACT_INFO,
  EFFECTIVE_DATE,
} from "@/constants/privacy/privacy";
export default function Privacy() {
  return (
    <div className="mx-auto max-w-[700px] px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12 font-['Noto_Sans_KR'] leading-[1.7]">
      <h1 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold text-gray-800">
        개인정보 처리방침
      </h1>

      <p className="mb-4 sm:mb-6 text-sm sm:text-base">
        본 서비스는 개인이 운영하는 비영리 웹사이트로, 이용자의 개인정보를
        중요시하며 관련 법령에 따라 다음과 같은 개인정보 처리방침을 제공합니다.
      </p>

      {PRIVACY_SECTIONS.map((section) => (
        <div key={section.id}>
          <h2 className="mt-6 sm:mt-8 text-lg sm:text-xl font-semibold text-gray-700">
            {section.id}. {section.title}
          </h2>
          {section.type === "list" && Array.isArray(section.content) && (
            <ul className="mb-4 sm:mb-6 ml-4 sm:ml-6 list-disc space-y-2 text-sm sm:text-base">
              {section.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          {section.type === "paragraph" &&
            typeof section.content === "string" && (
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">{section.content}</p>
            )}
          {section.type === "contact" && (
            <p className="mb-4 sm:mb-6 text-sm sm:text-base">
              문의: <strong>{CONTACT_INFO.email}</strong>
              <br />
              책임자: <strong>{CONTACT_INFO.responsible}</strong>
            </p>
          )}
        </div>
      ))}

      <p className="mb-4 sm:mb-6 text-sm sm:text-base">본 방침은 {EFFECTIVE_DATE}부터 적용됩니다.</p>
    </div>
  );
}
