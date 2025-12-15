type User = {
  avatar_url: string;
  email: string;
  created_at: string;
};

export default function UserInfo({ user }: { user: User }) {
  const date = new Date(user.created_at);
  const formattedDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mt-6 flex flex-col items-center justify-center gap-2 px-4 sm:mt-11 sm:gap-3">
      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
        <img
          src={user.avatar_url}
          alt="profile"
          className="h-16 w-16 rounded-full border-2 border-indigo-300 shadow-lg sm:h-20 sm:w-20 sm:border-4"
        />
        <h2 className="text-center text-base font-bold break-all sm:text-left sm:text-xl">
          {user.email || "user@email.com"}
        </h2>
      </div>
      <p className="text-center text-xs text-gray-500 sm:text-sm">{`가입일: ${
        formattedDate || "가입일: --"
      }`}</p>
    </article>
  );
}
