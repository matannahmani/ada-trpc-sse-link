"use client";
import { cn } from "@/lib/utils";
import { Button } from "@ui/button";
import { useParams } from "next/navigation";
import { memo } from "react";

const SidebarCandidateBtn = memo(
  ({
    children,
    candidateId,
  }: {
    children: React.ReactNode;
    candidateId: number;
  }) => {
    const { candidateId: candidateIdParam } = useParams() as {
      candidateId: string;
    };
    const currentCandidate = candidateIdParam;

    return (
      <Button
        variant="ghost"
        asChild
        size="sm"
        className={cn(
          "w-full justify-start font-normal",
          currentCandidate === `${candidateId}`
            ? "font-semibold opacity-100"
            : "opacity-90"
        )}
      >
        {children}
      </Button>
    );
  }
);
SidebarCandidateBtn.displayName = "SidebarCandidateBtn";
export default SidebarCandidateBtn;
