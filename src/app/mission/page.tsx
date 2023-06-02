import { siteConfig } from "@/config/site";
import { buttonVariants } from "@ui/button";
import Link from "next/link";

function OurMissionPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          Join the Revolution Your Voice, Our AI..
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          At Ada AI, our mission is to harness the power of artificial
          intelligence to transform public engagement. We strive to create a
          platform where supporters can interact with their favorite public
          figures in a dynamic, personalized way. Our aim is to make political
          support more accessible and interactive, fostering greater
          transparency and connection between public figures and their
          constituents.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href={siteConfig.links.docs}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          White Paper
        </Link>
        <Link
          target="_blank"
          rel="noreferrer"
          href={siteConfig.links.github}
          className={buttonVariants({ variant: "outline" })}
        >
          GitHub
        </Link>
      </div>
      {/* insert section our team ~ */}
    </section>
  );
}

export default OurMissionPage;
