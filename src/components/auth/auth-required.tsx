import Link from "next/link";
import AuthButtons from "./auth-buttons";
import { getServerAuthSession } from "@/server/auth";

type AuthRequiredPageProps = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export default async function AuthRequiredPage(props: AuthRequiredPageProps) {
  const session = await getServerAuthSession();
  if (session) {
    return <>{props.children}</>;
  }
  return (
    <>
      <div className="container relative flex h-[800px] flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {props.title ?? "To View This Page"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {props.description ?? "Please sign in to continue"}
            </p>
          </div>
          <AuthButtons />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
