"use client";
import { cn } from "@/lib/utils";
import { Button } from "@ui/button";
import { useParams } from "next/navigation";

const SidebarCandidateBtn = ({
  children,
  candidateId,
}: {
  children: React.ReactNode;
  candidateId: number;
}) => {
  const { id } = useParams() as {
    id: string;
  };
  const currentCandidate = id;

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
};

export default SidebarCandidateBtn;
