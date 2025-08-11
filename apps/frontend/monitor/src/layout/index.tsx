import Aside from '@/components/Aside';
import { getToken } from '@/utils';
import { useLayoutEffect } from 'react';
import { Outlet } from 'react-router';

const Layout = () => {
  useLayoutEffect(() => {
    if (!getToken()) {
      window.location.href = `/login?redirect=${window.location.pathname}`;
    }
  });

  return (
    <div className="grid h-screen w-full grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Aside />
      <div className="flex flex-col  overflow-y-auto relative h-full">
        <main className="flex-1 flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
