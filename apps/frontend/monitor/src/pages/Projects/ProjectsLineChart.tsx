import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ApplicationData } from '@/types/api';
import { copy } from '@/utils';
import { lightFormat } from 'date-fns';
import { Copy, Settings } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';
import { appLogoMap } from './meta';

export function ProjectsLineChart({ application }: { application: ApplicationData }) {
  const [timeRange, setTimeRange] = useState('90d');
  // 省略
  const removeApplication = async (appId: string) => {
    return appId;
  };

  const copyAppId = (appId: string) => {
    toast.success('应用 ID 复制成功');
    copy(appId);
  };

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
              <DropdownMenuItem>
                <ToggleGroup type="single" value={timeRange} onValueChange={setTimeRange} variant="outline">
                  <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                  <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                  <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
                </ToggleGroup>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0 bg-muted">
        <ChartContainer
          config={{
            resting: {
              label: 'Resting',
              color: '#2563eb'
            },
            desktop: {
              label: 'Desktop',
              color: '#87d068'
            }
          }}
          className="h-[150px] w-full"
        >
          <LineChart
            accessibilityLayer
            margin={{
              left: 14,
              right: 14,
              top: 10
            }}
            data={application.lineChartData}
          >
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(240, 4%, 45%)" strokeOpacity={0.5} />
            <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={value => {
                return new Date(value).toLocaleDateString('zh-CN', {
                  weekday: 'short'
                });
              }}
            />
            <Line
              dataKey="resting"
              type="natural"
              fill="var(--color-resting)"
              stroke="var(--color-resting)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                fill: 'var(--color-resting)',
                stroke: 'var(--color-resting)',
                r: 4
              }}
            />
            <Line
              dataKey="desktop"
              type="natural"
              fill="var(--color-resting)"
              stroke="var(--color-resting)"
              strokeWidth={2}
              dot={false}
              activeDot={{
                fill: 'var(--color-resting)',
                stroke: 'var(--color-resting)',
                r: 4
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('zh-CN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    });
                  }}
                />
              }
              cursor={false}
            />
          </LineChart>
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
