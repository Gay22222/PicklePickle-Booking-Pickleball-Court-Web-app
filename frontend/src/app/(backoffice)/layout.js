import SidebarNav from "./components/layout/SidebarNav";
import Topbar from "./components/layout/Topbar";

export default function BackofficeLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F7FB]">
      {/* Sidebar cố định */}
      <SidebarNav />

      {/* Nội dung */}
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
