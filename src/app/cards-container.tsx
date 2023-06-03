import { ScrollArea, ScrollBar } from "@ui/scroll-area";
import { Separator } from "@ui/separator";

type CardsContainerProps = {
  children: React.ReactNode | React.ReactNode[];
  title: string;
  description: string;
};

const CardsContainer = ({ ...props }: CardsContainerProps) => {
  return (
    <>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">{props.title}</h2>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>
      {/* <Separator /> */}
      <div className="relative overflow-hidden">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">{props.children}</div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default CardsContainer;
