import Link from "next/link";
import { LayoutDashboard, MessageSquare, LogOut, BellDot } from "lucide-react";
import { logoutAdmin } from "@/lib/actions";

export default function Sidebar() {
  return (
    <div className="flex h-screen sticky left-0 w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">🌾</span>
          <span>Farm Admin Panel</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/dash/admin"
            className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/dash/admin/posts"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4" />
            Farmer Forum
          </Link>

          <Link
            href="/dash/admin/notifications"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <BellDot className="h-4 w-4" />
            Notifications
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <button
          onClick={logoutAdmin}
          className="flex w-full items-center gap-2 rounded-lg px-3 border-2 text-center py-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
}
