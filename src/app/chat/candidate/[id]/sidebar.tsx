"use client";

import { cn } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { atom, useAtom } from "jotai";
import { SidebarClose, SidebarOpen } from "lucide-react";

type SidebarProps = {
  children: React.ReactNode;
};

export const sidebarAtom = atom(false);

export const ChatSidebarTrigger = () => {
  const [isOpen, setIsOpen] = useAtom(sidebarAtom);
  const [ref] = useAutoAnimate();
  return (
    <div className="flex h-10 w-10 lg:hidden" ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>
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
          "fixed top-16 z-20 w-[70%] bg-gray-800",
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

export default Sidebar;
