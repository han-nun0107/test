import type { ReactNode } from "react";

type GridContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function GridContainer({
  children,
  className = "",
}: GridContainerProps) {
  return (
    <article className="flex justify-center gap-y-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
      <div
        className={`grid w-full max-w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5 xl:gap-8 2xl:grid-cols-6 2xl:gap-8 ${className}`}
      >
        {children}
      </div>
    </article>
  );
}
