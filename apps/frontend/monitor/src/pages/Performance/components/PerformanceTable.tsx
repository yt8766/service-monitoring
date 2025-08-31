import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from 'date-fns';
import { ListFilter, Timer } from 'lucide-react';
import { CartesianGrid, Line, LineChart } from 'recharts';
import type { Performance } from '../index';

type Values =
  | string
  | number
  | {
      fp: number;
      ttl: number;
      domReady: number;
      load: number;
      firstByte: number;
      dns: number;
      tcp: number;
      ssl: number;
      ttfb: number;
      trans: number;
      dom: number;
      res: number;
    };

export function PerformanceTable({ performance }: { performance: Performance[] }) {
  const getValues = (performance: Performance) => {
    if (typeof performance.info.value === 'object') {
      const values = Object.entries(performance.info.value as Values).map(([key, value]) => {
        return <div>{`${key.toLocaleUpperCase()}: ${value}`}</div>;
      });

      return <div className="flex flex-col gap-1">{values}</div>;
    }
    return <div>{`${performance.info.name?.toLocaleUpperCase()}: ${performance.info.value}`}</div>;
  };

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle className="flex flex-row items-center">性能列表</CardTitle>
        <CardDescription>
          以下是您的应用程序中的性能列表。您可以在此处查看性能的详细信息，以及对其进行操作
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">排序规则</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuRadioGroup value="lastScreen">
                      <DropdownMenuRadioItem value="lastScreen" disabled>
                        最后访问
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="events" disabled>
                        事件
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="users" disabled>
                        用户
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead>统计</TableHead>
              <TableHead>性能指标</TableHead>
              <TableHead>性能数据</TableHead>
              <TableHead>性能页面</TableHead>
              <TableHead>国家</TableHead>
              <TableHead>平台</TableHead>
              <TableHead>浏览器信息</TableHead>
              <TableHead>来源</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performance?.map(performance => {
              // const currentApp = getCreateApplication(performance.appId);
              // const currentAppType = currentApp?.type || 'vanilla'
              return (
                <TableRow key={performance.id}>
                  <TableCell className="font-medium my-2 ">
                    <div>
                      <p className="text-sm text-blue-500">{performance.title}</p>
                      <p className="flex items-center gap-1 marker:text-xs text-gray-500">{performance.description}</p>
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex flex-row items-center gap-1">
                          {/* <img src={appLogoMap[currentAppType]} alt="React" className="w-4 h-4 rounded" /> */}
                          {/* <p className="text-xs text-gray-500">{currentApp?.name}</p> */}
                        </div>
                        <p className="flex flex-row items-center text-xs text-gray-500">
                          <Timer className="h-3 w-3 mr-1" />
                          {formatDate(performance.createAt, 'yyyy-MM-dd HH:mm:ss')}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-0">
                    <ChartContainer
                      config={{
                        resting: {
                          label: 'Resting',
                          color: '#2563eb'
                        }
                      }}
                      className="w-[90%] h-16"
                    >
                      <LineChart
                        accessibilityLayer
                        margin={{
                          left: 14,
                          right: 14,
                          top: 10
                        }}
                        data={[
                          {
                            date: '2025-06-01',
                            resting: 24
                          },
                          {
                            date: '2025-06-02',
                            resting: 51
                          },
                          {
                            date: '2025-06-03',
                            resting: 67
                          },
                          {
                            date: '2025-06-04',
                            resting: 51
                          },
                          {
                            date: '2025-06-05',
                            resting: 44
                          },
                          {
                            date: '2025-06-06',
                            resting: 30
                          },
                          {
                            date: '2025-06-07',
                            resting: 75
                          }
                        ]}
                      >
                        <CartesianGrid
                          strokeDasharray="4 4"
                          vertical={false}
                          stroke="hsl(240, 4%, 45%)"
                          strokeOpacity={0.5}
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
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              indicator="line"
                              labelFormatter={(_, value) => {
                                return new Date((value[0] as any).payload.date).toLocaleDateString('zh-CN', {
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
                  </TableCell>
                  <TableCell>{performance.info.name}</TableCell>
                  <TableCell>{getValues(performance)}</TableCell>
                  <TableCell>{performance.info.path}</TableCell>
                  <TableCell>{performance.info.browserInfo.language}</TableCell>
                  <TableCell>{performance.info.browserInfo.platform}</TableCell>
                  <TableCell>{performance.info.browserInfo.useAgent}</TableCell>
                  <TableCell>{performance.info.browserInfo.referer}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
