import Navbar from "../components/Navbar";

export default function ProfileLayout({ children }) {
  // Temporary dummy profile data
  const profile = {
    username: "lomash",
    name: "Lomash",
    bio: "Building things. Wearing RIVIX.",
    memberSince: "October 2026",
    avatar: null,
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* navbar  */}
      <Navbar/>
      {/* Profile Header */}
      <section className="border-b border-element-border">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-element-border bg-background-muted sm:h-24 sm:w-24">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-heading text-3xl text-foreground-muted">
                  {profile.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Profile Information */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground-muted">
                RIVIX Member
              </p>

              <h1 className="mt-1 font-heading text-4xl tracking-wide sm:text-5xl">
                {profile.name}
              </h1>

              <p className="mt-1 text-sm text-foreground-muted">
                @{profile.username}
              </p>

              {profile.bio && (
                <p className="mt-4 max-w-md text-sm leading-6 text-foreground-muted">
                  {profile.bio}
                </p>
              )}

              <p className="mt-3 text-[11px] uppercase tracking-wider text-foreground-muted">
                Member since {profile.memberSince}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Page Content */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </div>
      </section>
    </main>
  );
}