"use client";

export function AdminLogoutButton() {
  return (
    <button
      type="button"
      className="ev-touch mt-auto min-h-12 w-full rounded-lg text-left text-xs font-medium uppercase tracking-[0.2em] text-[var(--ev-text-muted)] transition-colors active:bg-[var(--ev-surface)] lg:min-h-0 lg:w-auto lg:px-2 lg:py-2 lg:hover:text-[var(--ev-accent)]"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
        window.location.href = "/admin/login";
      }}
    >
      Log out
    </button>
  );
}
