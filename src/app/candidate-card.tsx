import { type Candidate } from "@prisma/client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AspectRatio } from "@ui/aspect-ratio";
import Link from "next/link";
import Image from "next/image";

type CandidateCardProps = {
  candidate: Candidate;
  userId: string;
};

const CandidateCard = ({ candidate, userId }: CandidateCardProps) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{candidate.name}</CardTitle>
        <CardDescription>Representing {candidate.party}</CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="h-[200px] w-[280px]">
          <AspectRatio ratio={280 / 200} className="bg-muted">
            <Image
              fetchPriority="high"
              fill
              className="h-full w-full rounded-md object-cover"
              src={candidate.image}
              alt={candidate.name}
            />
          </AspectRatio>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">View Candidate</Button>
        <Button asChild>
          <Link href={`/chat/user/${userId}/candidate/${candidate.id}`}>
            Chat
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
