type User = {
  avatar_url: string;
  email: string;
  created_at: string;
};

export default function UserInfo({ user }: { user: User }) {
  return (
    <article className="mt-6 sm:mt-11 flex flex-col items-center justify-center gap-2 sm:gap-3 px-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <img
          src={user.avatar_url}
          alt="profile"
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 sm:border-4 border-indigo-300 shadow-lg"
        />
        <h2 className="text-base sm:text-xl font-bold text-center sm:text-left break-all">{user.email || "user@email.com"}</h2>
      </div>
      <p className="text-xs sm:text-sm text-gray-500 text-center">{`가입일: ${
        user.created_at || "가입일: --"
      }`}</p>
    </article>
  );
}
