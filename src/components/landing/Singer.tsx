import { useState, useRef, useMemo } from "react";
import {
  Card,
  GridContainer,
  LoadingState,
  EmptyState,
  LoadingIndicator,
} from "@/components";
import {
  useAllSongs,
  useSinger,
  useInfinityScroll,
  useModalState,
} from "@/hooks";

const ITEMS_PER_PAGE = 20;

export default function Singer() {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { data: allSongs, isLoading } = useAllSongs();
  const { singers } = useSinger(allSongs);
  const { getIsOpen, setIsOpen } = useModalState();

  const displayedSingers = useMemo(() => {
    return singers.slice(0, displayCount);
  }, [singers, displayCount]);

  const hasNextPage = displayCount < singers.length;

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchNextPage = () => {
    if (hasNextPage && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
        setIsLoadingMore(false);
      }, 100);
    }
  };

  useInfinityScroll({
    observerRef,
    fetchNextPage,
    hasNextPage,
    isFetching: isLoadingMore,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  console.log(displayedSingers);

  return (
    <GridContainer>
      {displayedSingers.length === 0 ? (
        <EmptyState message="가수가 없습니다." />
      ) : (
        displayedSingers.map((singer, index) => {
          const key = singer.name || `singer-${index}`;
          return (
            <Card
              key={key}
              type="indexAnotherCard"
              data={{
                image: singer.image,
                categories: [singer.name],
                songs: singer.songs,
                isOpen: getIsOpen(key),
                setIsOpen: (open: boolean) => setIsOpen(key, open),
                type: "singer",
              }}
            />
          );
        })
      )}
      {hasNextPage && (
        <>
          <div ref={observerRef} className="h-10 w-full" />
          {isLoadingMore && <LoadingIndicator />}
        </>
      )}
    </GridContainer>
  );
}
