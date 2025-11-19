import "./line-loading.css";
import {useTheme} from 'next-themes';
import {cn} from "@/lib/utils"


export function LineLoading() {
  const {theme} = useTheme();

  return (
    <div
      className="flex h-full min-h-screen w-full flex-col items-center justify-center">
      <div
        className="relative h-1.5 w-96 overflow-hidden rounded bg-gray-500!"
      >
        <div
          className={cn("absolute left-0 top-0 h-full w-1/3 animate-loading", theme === "light" ? "bg-black!" : "bg-white!")}
        />
      </div>
    </div>
  );
}