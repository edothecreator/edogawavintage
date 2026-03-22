import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { CartAddedToast } from "@/components/cart/CartAddedToast";

/** Storefront pages read live catalog from the database; avoid prerendering without tables. */
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="ev-grain" aria-hidden="true" />
      <SiteHeader />
      <main className="relative z-[2] flex flex-1 flex-col">{children}</main>
      <SiteFooter />
      <CartAddedToast />
      <ChatWidget />
    </>
  );
}
