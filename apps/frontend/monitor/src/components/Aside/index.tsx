import { useQuery } from '@tanstack/react-query';
import { Bug, CalendarCheck, CircleGauge, Lightbulb, Package, Settings, Siren, Zap } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as srv from '@/services';
import { queryClient } from '@/utils/query-client';
import React from 'react';
import { toast } from 'sonner';

const menus = [
  {
    name: 'projects',
    icon: Package,
    title: '项目总览',
    gap: true
  },
  {
    name: 'issues',
    icon: Bug,
    title: '缺陷',
    badge: 4
  },
  {
    name: 'performance',
    icon: Zap,
    title: '性能',
    gap: true
  },
  {
    name: 'explore',
    icon: Lightbulb,
    title: '探索'
  },
  {
    name: 'dashboard',
    icon: CircleGauge,
    title: '仪表板'
  },
  {
    name: 'insights',
    icon: CalendarCheck,
    title: '见解'
  },
  {
    name: 'alerts',
    icon: Siren,
    title: '告警'
  }
];

const Aside = () => {
  const navigate = useNavigate();
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await srv.currentUser();
      return res;
    }
  });

  const handleLogout = () => {
    toast('退出登录');
    localStorage.removeItem('token');
    queryClient.clear();
    navigate(`/login?redirect=${window.location.pathname}`);
  };
  return (
    <div className=" border-r bg-gray-50 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 ">
            <p className="font-semibold text-lg">监控平台</p>
          </a>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menus.map(menu => (
              <React.Fragment key={menu.name}>
                <NavLink
                  to={`/${menu.name}`}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      isActive && 'bg-muted'
                    )
                  }
                >
                  <menu.icon className="h-4 w-4" />
                  {menu.title}
                  {menu.badge && (
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      {menu.badge}
                    </Badge>
                  )}
                </NavLink>
                {menu.gap && <div className="my-3 h-[1px] bg-gray-100" />}
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="grid">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-fit flex justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              {currentUser && (
                <>
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/100/100?random=1" />
                    <AvatarFallback>{currentUser.username}</AvatarFallback>
                  </Avatar>
                  <p className="text-left text-lg">{currentUser.username}</p>
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full flex justify-start gap-3 mt-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              设置
            </Button>
            <Button variant="outline" size="sm" className="w-full mt-1" onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Aside;
