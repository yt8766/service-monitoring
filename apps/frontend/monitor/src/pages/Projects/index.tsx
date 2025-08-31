import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';

import * as srv from '@/services';
import { ApplicationData, CreateApplicationPayload } from '@/types/api';
import { toAllFormat } from '@/utils';
import { formatDate } from 'date-fns';
import { toast } from 'sonner';
import { CreateProjectsModal } from './CreateProjectModal';
import { ProjectsLineChart } from './ProjectsLineChart';
import { ProjectsPieChart } from './ProjectsPieChart';

export function Projects() {
  const {
    data: applications,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await srv.fetchApplicationList();
      const allEvents = await fetch('/dsn-api/storage/data');
      const allEventsData = await allEvents.json();
      return res.data.applications.map((app: ApplicationData) => {
        // 事务(除错误以外)
        const transactions = allEventsData.data.filter(
          (event: any) => event.app_id === app.appId && event.event_type !== 'error'
        );

        const bugs = allEventsData.data.filter(
          (event: any) => event.app_id === app.appId && event.event_type === 'error'
        );

        const errorResult: any = {};

        for (const event of bugs) {
          if (!errorResult[formatDate(event.create_at, 'yyyy-MM-dd')]) {
            errorResult[formatDate(event.create_at, 'yyyy-MM-dd')] = {
              event_type: event.event_type,
              count: 1
            };
          }
          if (errorResult[formatDate(event.create_at, 'yyyy-MM-dd')]) {
            errorResult[formatDate(event.create_at, 'yyyy-MM-dd')].count++;
          }
        }

        const transactionsResult: any = {};
        for (const event of transactions) {
          if (!transactionsResult[formatDate(event.create_at, 'yyyy-MM-dd')]) {
            transactionsResult[formatDate(event.create_at, 'yyyy-MM-dd')] = {
              event_type: event.event_type,
              count: 1
            };
          }
          if (transactionsResult[formatDate(event.create_at, 'yyyy-MM-dd')]) {
            transactionsResult[formatDate(event.create_at, 'yyyy-MM-dd')].count++;
          }
        }

        const bugsChartData = Object.entries(errorResult).map(([date, item]: any) => ({
          date,
          event_type: item.event_type,
          resting: item.count,
          visitors: item.count
        }));

        // 错误
        // const bugsChartData = bugs?.map((event: any) => ({
        //   date: formatDate(event.create_at, 'yyyy-MM-dd'),
        //   event_type: event.event_type,
        //   resting: bugs?.length,
        //   visitors: bugs?.length
        // }));

        const transactionsChartData = Object.entries(transactionsResult).map(([date, item]: any) => ({
          date,
          event_type: item.event_type,
          desktop: item.count,
          visitors: item.count
        }));

        // const transactionsChartData = transactions?.map((event: any) => ({
        //   date: formatDate(event.create_at, 'yyyy-MM-dd'),
        //   event_type: event.event_type,
        //   desktop: transactions?.length,
        //   visitors: bugs?.length
        // }));

        // const data = Object.entries(result).map(([date, item]: any) => ({
        //   date,
        //   event_type: item.event_type,
        //   resting: item.count,
        //   visitors: item.count
        // }));

        return {
          ...app,
          bugs: bugs,
          transactions: transactions.length,
          // chartData
          data: allEventsData.data,
          lineChartData: toAllFormat([...bugsChartData, ...transactionsChartData])
        };
      });
    }
  });

  const createApplication = async (data: CreateApplicationPayload) => {
    try {
      await srv.createApplication(data);
    } catch {
      toast.error('创建失败，请稍后重试');
      return false;
    }
    toast.success('创建成功');
    refetch();
    return true;
  };

  const applicationContent = applications?.map?.((application: ApplicationData, index: number) => (
    <div key={index} className="w-full flex flex-col gap-4">
      <ProjectsLineChart application={application} />
      <ProjectsPieChart application={application} />
    </div>
  ));

  const emptyContent = (
    <div className="flex flex-col h-[calc(100vh-200px)] items-center justify-center space-y-4">
      <h1 className="text-xl font-semibold">暂无应用</h1>
      <p className="text-gray-500">当前没有任何应用。</p>
      <CreateProjectsModal onCreateProject={createApplication} />
    </div>
  );

  const content = isLoading ? (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">加载中...</p>
    </div>
  ) : applications?.length ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">{applicationContent}</div>
  ) : (
    emptyContent
  );

  return (
    <div className="flex-1 flex-col">
      <header className="flex items-center justify-between h-[36px] mb-4">
        <h1 className="flex flex-row items-center text-xl font-semibold">
          <Package className="h-6 w-6 mr-2" />
          项目总览
        </h1>
        <CreateProjectsModal onCreateProject={createApplication} />
      </header>

      {content}
    </div>
  );
}
