// sidebar | -> chat text

import { Sidebar } from "./sidebar";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row space-y-4 py-4">
      <div className="w-[240px]">
        <Sidebar />
      </div>

      <div className="ml-2 w-full">{children}</div>
    </div>
  );
};
export default ChatLayout;
