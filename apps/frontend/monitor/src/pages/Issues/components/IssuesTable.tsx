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
import { statusMap } from '../config';
import { Issue } from '../index';

export function IssuesTable({ issues }: { issues: Issue[] }) {
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle className="flex flex-row items-center">缺陷列表</CardTitle>
        <CardDescription>
          以下是您的应用程序中的缺陷列表。您可以在此处查看缺陷的详细信息，以及对其进行操作
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
              <TableHead>错误路径</TableHead>
              <TableHead>错误页面</TableHead>
              <TableHead>错误函数</TableHead>
              <TableHead>错误行号</TableHead>
              <TableHead>错误列号</TableHead>
              <TableHead>错误堆栈</TableHead>
              <TableHead>错误状态</TableHead>
              <TableHead>事件</TableHead>
              <TableHead>用户</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues?.map(issue => {
              // const currentApp = getCreateApplication(issue.appId);
              // const currentAppType = currentApp?.type || 'vanilla'
              return (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium flex flex-col gap-1 my-2">
                    <p className="text-sm text-blue-500">{issue.title}</p>
                    <p className="flex items-center gap-1 marker:text-xs text-gray-500">{issue.description}</p>
                    <div className="flex flex-row items-center gap-2">
                      <div className="flex flex-row items-center gap-1">
                        {/* <img src={appLogoMap[currentAppType]} alt="React" className="w-4 h-4 rounded" /> */}
                        {/* <p className="text-xs text-gray-500">{currentApp?.name}</p> */}
                      </div>
                      <p className="flex flex-row items-center text-xs text-gray-500">
                        <Timer className="h-3 w-3 mr-1" />
                        {formatDate(issue.createAt, 'yyyy-MM-dd HH:mm:ss')}
                      </p>
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
                  <TableCell>{issue.info.path}</TableCell>
                  <TableCell>{issue.info.filename}</TableCell>
                  <TableCell>{issue.info.functionName}</TableCell>
                  <TableCell>{issue.info.lineno}</TableCell>
                  <TableCell>{issue.info.colno}</TableCell>
                  <TableCell>{issue.info.stack}</TableCell>
                  <TableCell>{statusMap[issue.status as keyof typeof statusMap]}</TableCell>
                  <TableCell>{issue.events}</TableCell>
                  <TableCell className="hidden md:table-cell">{issue.users}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
