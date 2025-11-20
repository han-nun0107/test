type LoadingStateProps = {
  message?: string;
};

export default function LoadingState({
  message = "로딩 중...",
}: LoadingStateProps) {
  return (
    <article className="flex justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
      <div className="flex items-center justify-center py-12 sm:py-20">
        <p className="text-base sm:text-lg text-gray-500">{message}</p>
      </div>
    </article>
  );
}
