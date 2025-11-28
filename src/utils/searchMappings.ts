import { SEARCH_MAPPINGS } from "@/constants";

export function expandSearchQuery(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim();
  const queries = [normalizedQuery];

  for (const [key, values] of Object.entries(SEARCH_MAPPINGS)) {
    const normalizedKey = key.toLowerCase();

    // 정확히 일치하는 경우
    if (
      normalizedQuery === normalizedKey ||
      values.some((v) => v.toLowerCase() === normalizedQuery)
    ) {
      // 검색어가 정확히 일치하는 경우, 그룹 키만 추가하고 다른 멤버들은 추가하지 않음
      // 예: "제니" 검색 시 "블랙핑크"만 추가하고 "로제", "지수", "리사"는 추가하지 않음
      queries.push(normalizedKey);

      // 검색어 자체가 키인 경우에만 모든 값 추가
      if (normalizedQuery === normalizedKey) {
        queries.push(...values.map((v) => v.toLowerCase()));
      }
    }
    // 부분 일치: 검색어가 매핑 값에 포함되거나, 매핑 값이 검색어에 포함되는 경우
    // 단, 단어 경계를 고려하여 더 정확하게 매칭
    else if (normalizedQuery.length >= 2) {
      // 매핑 값에서 검색어로 시작하거나 끝나는 경우만 (단어 경계 고려)
      const hasWordBoundaryMatch = values.some((v) => {
        const normalizedValue = v.toLowerCase();
        return (
          normalizedValue.startsWith(normalizedQuery) ||
          normalizedValue.endsWith(normalizedQuery) ||
          normalizedValue === normalizedQuery
        );
      });

      // 키에서도 동일하게 확인
      const hasKeyMatch =
        normalizedKey.startsWith(normalizedQuery) ||
        normalizedKey.endsWith(normalizedQuery) ||
        normalizedKey === normalizedQuery;

      if (hasWordBoundaryMatch || hasKeyMatch) {
        // 부분 일치의 경우에도 그룹 키만 추가
        queries.push(normalizedKey);
        // 검색어가 키와 정확히 일치하는 경우에만 모든 값 추가
        if (normalizedQuery === normalizedKey) {
          queries.push(...values.map((v) => v.toLowerCase()));
        }
      }
    }
  }

  return Array.from(new Set(queries));
}

export function matchesSearchQuery(text: string, query: string): boolean {
  const normalizedText = text.toLowerCase();
  const expandedQueries = expandSearchQuery(query);

  return expandedQueries.some((expandedQuery) =>
    normalizedText.includes(expandedQuery),
  );
}
