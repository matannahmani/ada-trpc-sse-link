import Sidebar from "./sidebar";
import { SidebarContent } from "./sidebar-content";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row space-y-4 py-4">
      <Sidebar>
        <SidebarContent />
      </Sidebar>

      <div className="w-full lg:ml-2">{children}</div>
    </div>
  );
};
export default ChatLayout;
