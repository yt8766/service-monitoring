import { useQuery } from '@tanstack/react-query';
import { formatDate } from 'date-fns';
import { Zap } from 'lucide-react';
import { PerformanceTable } from './components/PerformanceTable';

export interface Performance {
  id: number;
  title: string;
  description: string;
  appId: string;
  events: number;
  info: {
    type: string;
    name: string;
    value: string | number;
    path: string;
    browserInfo: {
      language: string;
      platform: string;
      useAgent: string;
      referer: string;
    };
  };
  createAt: Date;
}

export interface PerformanceRes {
  info: {
    type: string;
    stack: string;
    path: string;
  };
  message: string;
  create_at: Date;
  app_id: string;
}

export function Performance() {
  const { data: performance } = useQuery({
    queryKey: ['performance'],
    queryFn: async () => {
      const res = await fetch('/dsn-api/storage/performance');
      const performance = await res.json();

      const parsedPerformance = performance.data.map((performance: PerformanceRes, index: number) => ({
        id: index + 1,
        title: performance.info.type,
        description: performance.message,
        status: 0,
        createAt: formatDate(performance.create_at, 'yyyy-MM-dd'),
        appId: performance.app_id,
        info: performance.info,
        events: Math.ceil(Math.random() * 20),
        users: Math.ceil(Math.random() * 10)
      }));

      return parsedPerformance as Performance[];
    }
  });

  return (
    <div className="flex-1 flex-col">
      <header className="flex items-center justify-between h-[36px] mb-4">
        <h1 className="flex flex-row items-center text-xl font-semibold">
          <Zap className="h-6 w-6 mr-2" />
          缺陷
        </h1>
      </header>
      <div>
        <PerformanceTable performance={performance as Performance[]} />
      </div>
    </div>
  );
}
