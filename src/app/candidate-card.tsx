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

type CandidateCardProps = {
  candidate: Candidate;
};

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{candidate.name}</CardTitle>
        <CardDescription>Representing {candidate.party}</CardDescription>
      </CardHeader>
      <CardContent className="h-[180px] w-full">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <img
            fetchPriority="high"
            className="h-full w-full rounded-md object-cover"
            src={candidate.image}
            alt={candidate.name}
          />
        </AspectRatio>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">View Candidate</Button>
        <Button>Chat</Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
