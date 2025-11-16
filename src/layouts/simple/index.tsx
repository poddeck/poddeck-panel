import type React from "react";

type Props = {
  children: React.ReactNode;
};
export default function SimpleLayout({ children }: Props) {
  return (
    <div className="flex h-screen w-full flex-col text-text-base bg-bg">
      {children}
    </div>
  );
}