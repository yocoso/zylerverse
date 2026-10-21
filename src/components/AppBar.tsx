import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "./icons";

interface AppBarProps {
  title?: string;
  subtitle?: string;
  /** Where the back button goes. If omitted, uses browser history back. */
  backTo?: string;
  showBack?: boolean;
  action?: ReactNode;
}

export default function AppBar({ title, subtitle, backTo, showBack = true, action }: AppBarProps) {
  const navigate = useNavigate();

  return (
    <header className="safe-top sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
      <div className="flex items-center gap-2 px-4 pb-3">
        {showBack ? (
          <button
            type="button"
            aria-label="Back"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="-ml-2 rounded-full p-2 text-muted transition hover:bg-brand-50 hover:text-ink"
          >
            <ChevronLeft />
          </button>
        ) : (
          <span className="w-2" />
        )}
        <div className="min-w-0 flex-1">
          {title && <h1 className="truncate text-lg font-bold leading-tight">{title}</h1>}
          {subtitle && <p className="truncate text-sm text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
