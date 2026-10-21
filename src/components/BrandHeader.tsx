import { Link } from "react-router-dom";
import { Gear, Heart } from "./icons";
import BrandMark from "./BrandMark";

/** Home-screen hero with the Zylerverse identity and top-level nav. */
export default function BrandHeader() {
  return (
    <header className="safe-top px-5 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="h-11 w-11" />
          <h1 className="text-2xl font-extrabold tracking-tight">Zylerverse</h1>
        </div>
        <div className="flex items-center gap-1">
          <Link to="/favorites" aria-label="Favorites" className="rounded-full p-2.5 text-muted transition hover:bg-brand-50 hover:text-rose-500">
            <Heart width={22} height={22} />
          </Link>
          <Link to="/settings" aria-label="Settings" className="rounded-full p-2.5 text-muted transition hover:bg-brand-50 hover:text-ink">
            <Gear width={22} height={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}
