import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

const candidates: Prisma.CandidateCreateManyInput[] = [
  {
    name: "Joe Biden",
    party: "Democratic",
    image:
      "https://en.wikipedia.org/wiki/File:Joe_Biden_presidential_portrait_(cropped).jpg",
    aiModel: null,
  },
  {
    name: "Robert F. Kennedy Jr.",
    party: "Democratic",
    image:
      "https://en.wikipedia.org/wiki/File:Robert_Kennedy_Jr_for_President_Logo.png",
    aiModel: null,
  },
  {
    name: "Marianne Williamson",
    party: "Democratic",
    image:
      "https://en.wikipedia.org/wiki/File:MW2024_01272023_logo_PRIMARY_ltblue_ltpink_cropped.webp",
    aiModel: null,
  },
  {
    name: "Ron DeSantis",
    party: "Republican",
    image:
      "https://en.wikipedia.org/wiki/File:Ron_DeSantis%27s_congressional_portrait,_2013.jpg",
    aiModel: null,
  },
  {
    name: "Larry Elder",
    party: "Republican",
    image:
      "https://en.wikipedia.org/wiki/File:Larry_Elder_(28294545841)_(cropped).jpg",
    aiModel: null,
  },
  {
    name: "Nikki Haley",
    party: "Republican",
    image:
      "https://en.wikipedia.org/wiki/File:Nikki_Haley_and_Glenn_Youngkin_3_(cropped).jpg",
    aiModel: null,
  },
  {
    name: "Tim Scott",
    party: "Republican",
    image:
      "https://en.wikipedia.org/wiki/File:Tim_Scott,_official_portrait,_113th_Congress.jpg",
    aiModel: null,
  },
  {
    name: "Asa Hutchinson",
    party: "Republican",
    image:
      "https://www.kark.com/wp-content/uploads/sites/85/2023/04/AP23116640112362.jpg?w=1280",
    aiModel: null,
  },
  {
    name: "Vivek Ramaswamy",
    party: "Republican",
    image:
      "https://www.desmoinesregister.com/gcdn/presto/2023/02/23/USAT/f522e850-d26f-46ed-8f84-ebd9dfd024a6-ra.png",
    aiModel: null,
  },
  {
    name: "Donald Trump",
    party: "Republican",
    image:
      "https://en.wikipedia.org/wiki/File:Donald_Trump_official_portrait_(cropped).jpg",
    aiModel: null,
  },
  {
    name: "Corey Stapleton",
    party: "Republican",
    image:
      "https://townsquare.media/site/1098/files/2019/01/Corey-Stapleton.jpg",
    aiModel: null,
  },
];

/**
 * Seed the database with candidates
 */
async function seedCandidates() {
  return await prisma.candidate.createMany({
    data: candidates,
    skipDuplicates: true,
  });
}

async function seedCampaigns() {
  // gather all candidates
  const candidates = await prisma.candidate.findMany();
  const campaigns: Prisma.CampaignCreateManyInput[] = candidates.map(
    (candidate) => ({
      candidateId: candidate.id,
      title: `${candidate.name} for President`,
      description: `The official campaign for ${candidate.name}`,
    })
  );
  return await prisma.campaign.createMany({
    data: campaigns,
    skipDuplicates: true,
  });
}

async function seed() {
  await seedCandidates();
  await seedCampaigns();
}

void seed();
