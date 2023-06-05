"use client";

import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { atom, useAtom } from "jotai";
import { SidebarClose, SidebarOpen } from "lucide-react";
import { usePathname } from "next/navigation";
import { memo } from "react";

type SidebarProps = {
  children: React.ReactNode;
};

export const sidebarAtom = atom(false);

export const ChatSidebarTrigger = () => {
  const path = usePathname();
  const [isOpen, setIsOpen] = useAtom(sidebarAtom);
  const [ref] = useAutoAnimate();
  if (!path.includes("chat") || !path.includes("candidate")) return null;
  return (
    <div className="mx-2 flex h-10 w-10 lg:hidden">
      <button ref={ref} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <SidebarClose /> : <SidebarOpen />}
      </button>
    </div>
  );
};

function Sidebar(props: SidebarProps) {
  const [isOpen] = useAtom(sidebarAtom);
  return (
    <div className="relative">
      <div
        className={cn(
          "fixed top-16 z-20 w-[70%] bg-background/80 backdrop-blur",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "transition",
          "flex flex-row",
          "lg:static lg:mr-2 lg:w-[240px] lg:translate-x-0 lg:border-r-2 lg:bg-transparent lg:shadow-none "
        )}
      >
        <div>{props.children}</div>
      </div>
    </div>
  );
}

export default memo(Sidebar);
