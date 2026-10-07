import { Outlet } from 'react-router-dom';
import { TabBar } from '@/components/TabBar';
import { ToastContainer } from '@/components/ToastContainer';
import { SuccessOverlay } from '@/components/SuccessOverlay';

export function AppShell() {
  return (
    <div className="relative w-full h-[100dvh] max-w-[390px] max-h-[844px] sm:h-[844px] sm:rounded-[2.5rem] sm:border-[10px] sm:border-gray-900 sm:shadow-2xl overflow-hidden bg-brand-light flex flex-col">
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar relative">
        <Outlet />
      </div>
      <TabBar />
      <ToastContainer />
      <SuccessOverlay />
    </div>
  );
}
