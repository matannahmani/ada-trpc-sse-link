import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { api } from "@/trpc/server";
import { Suspense } from "react";
import { Skeleton } from "@ui/skeleton";
import Link from "next/link";
import SidebarCandidateBtn from "./sidebar-candidate-btn";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

async function ChatCandidateSidebar() {
  const candidates = await api.candidates.list.query(undefined, {});
  return candidates?.map((candidate, i) => (
    <SidebarCandidateBtn candidateId={candidate.id} key={`btn-${i}`}>
      <Link href={`/chat/candidate/${candidate.id}`} key={`link-${i}`}>
        <Avatar className="mr-2 h-8 w-8">
          <AvatarImage src={candidate.image} className="object-cover" />
          <AvatarFallback>{candidate.name?.toLocaleUpperCase()}</AvatarFallback>
        </Avatar>
        {candidate.name}
      </Link>
    </SidebarCandidateBtn>
  ));
}

export function SidebarContent({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="">
        <div className="py-2">
          <h2 className="relative px-6 text-lg font-semibold tracking-tight">
            Candidates
          </h2>
          <ScrollArea className="h-[540px] px-2">
            <div className="space-y-1 p-2">
              <Suspense
                fallback={new Array(10).fill(0).map((_, i) => (
                  <Skeleton className="h-[36px] w-full" key={`skeleton-${i}`} />
                ))}
              >
                {/* @ts-expect-error async component not supported yet in ts */}
                <ChatCandidateSidebar />
              </Suspense>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
