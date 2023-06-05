import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import CardsContainer from "./cards-container";
import CandidateCard from "./candidate-card";
import { Suspense } from "react";
import { Skeleton } from "@ui/skeleton";
import { api } from "@/trpc/server";
import { getServerAuthSession } from "@/server/auth";

const CandidatesCard = async () => {
  const candidates = await api.candidates.list.query();
  const session = await getServerAuthSession();
  return candidates.map((candidate) => (
    <CandidateCard
      userId={session?.user?.id ?? "-1"}
      key={`candidate-${candidate.id}`}
      candidate={candidate}
    />
  ));
};

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Explore, Engage, Empower
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Welcome to Ada-AI&apos;s hub of dynamic public figures. Browse through
          candidates and their impactful campaigns, engage with personalized AI
          chatbots, and lend your support to the causes that resonate with you.
          Each click, each conversation, each contribution brings us one step
          closer to a brighter future.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={"#candidate-container"}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          View candidates
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={"#"}
          className={buttonVariants({ variant: "outline" })}
        >
          View Campaigns
        </Link>
      </div>
      <CardsContainer
        title="Candidates"
        description="Explore the top candidates."
      >
        <Suspense
          fallback={new Array(10).fill(0).map((_, i) => (
            <Skeleton className="h-[337px] w-[350px]" key={`skeleton-${i}`} />
          ))}
        >
          {/* @ts-expect-error async component not support by typescript yet */}
          <CandidatesCard />
        </Suspense>
      </CardsContainer>
    </section>
  );
}
