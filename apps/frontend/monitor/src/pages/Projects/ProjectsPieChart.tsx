import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ApplicationData } from '@/types/api';
import { copy } from '@/utils';
import { lightFormat } from 'date-fns';
import { Copy, Settings } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router';
import { Pie, PieChart } from 'recharts';
import { toast } from 'sonner';
import { appLogoMap } from './meta';

export function ProjectsPieChart({ application }: { application: ApplicationData }) {
  const chartData = useMemo(() => {
    const errorData = application?.data?.filter(item => item.event_type === 'error');

    const behaviorData = application?.data?.filter(item => item.event_type === 'behavior');

    const performanceData = application?.data?.filter(item => item.event_type === 'performance');

    return [
      {
        event_type: 'Error',
        visitors: errorData?.length,
        fill: '#ff4d4f'
      },
      {
        event_type: 'PV',
        visitors: behaviorData?.length,
        fill: '#4096ff'
      },
      {
        event_type: 'Performance',
        visitors: performanceData?.length,
        fill: '#87d068'
      },
      {
        event_type: 'Desktop',
        visitors: application?.transactions,
        fill: '#4cb7ba'
      }
    ];
  }, [application]);
  // 省略
  const removeApplication = async (appId: string) => {
    return appId;
  };

  const copyAppId = (appId: string) => {
    toast.success('应用 ID 复制成功');
    copy(appId);
  };

  const chartConfig = {
    PV: {
      label: 'PV',
      color: '#4096ff'
    },
    Error: {
      label: 'Error',
      color: '#ff4d4f'
    },
    Performance: {
      label: 'Performance',
      color: '#87d068'
    },
    Desktop: {
      label: 'Desktop',
      color: '#87d068'
    }
  } satisfies ChartConfig;

  return (
    <Card className="shadow-none hover:drop-shadow-xl">
      <CardHeader className="w-full flex flex-row justify-between align-top">
        <div className="flex items-center h-[48px]">
          <img className="w-10 h-10 object-cover rounded-sm mr-3" src={appLogoMap[application.type]} alt="Project" />
          <div className="flex flex-col justify-center gap-1 items-stretch h-full">
            <CardTitle>
              <Link to="/project/1" className="font-semibold text-sm">
                {application.name}
              </Link>
            </CardTitle>
            <CardDescription className="text-xs">
              缺陷：{application.bugs?.length} | 事务：{application.transactions}
            </CardDescription>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>设置</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => removeApplication(application.appId)}> 删除</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0 bg-muted h-[280px]  flex justify-center items-center">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <Pie data={chartData} label dataKey="visitors" nameKey="event_type"></Pie>
            <ChartTooltip content={<ChartTooltipContent nameKey="event_type" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between pt-6 gap-2 w-full">
        <p className="text-xs text-muted-foreground">
          创建时间：{lightFormat(application.createdAt, 'yyyy-MM-dd HH:mm:ss')}
        </p>
        <Button variant="secondary" size="sm" onClick={() => copyAppId(application.appId)}>
          <p className="text-xs text-left">应用 ID：{application.appId}</p>
          <Copy className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
