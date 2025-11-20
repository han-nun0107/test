type EmptyStateProps = {
  message: string;
};

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="col-span-full flex items-center justify-center py-12 sm:py-20">
      <p className="text-base sm:text-lg text-gray-500">{message}</p>
    </div>
  );
}
