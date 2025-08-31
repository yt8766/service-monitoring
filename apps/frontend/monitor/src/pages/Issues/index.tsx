import { useQuery } from '@tanstack/react-query';
import { formatDate } from 'date-fns';
import { Bug, ListFilter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemo } from 'react';
import { IssuesTable } from './components/IssuesTable';
// import { ApplicationData } from "@/types/api";

export interface Issue {
  id: number;
  title: string;
  description: string;
  appId: string;
  events: number;
  users: number;
  status: 0 | 1 | 2;
  info: {
    type: string;
    stack: string;
    path: string;
    filename: string;
    functionName: string;
    lineno: number;
    colno: number;
  };
  createAt: Date;
}

export interface IssueRes {
  info: {
    type: string;
    stack: string;
    path: string;
  };
  message: string;
  create_at: Date;
  app_id: string;
}

export function Issues() {
  // const { data: applications } = useQuery<(ApplicationData & { appId: string })[]>({
  //   queryKey: ["applications"]
  // });
  const { data: issues } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const res = await fetch('/dsn-api/storage/bugs');
      const issues = await res.json();

      const parsedIssues = issues.data.map((issue: IssueRes, index: number) => ({
        id: index + 1,
        title: issue.info.type,
        description: issue.message,
        status: 0,
        createAt: formatDate(issue.create_at, 'yyyy-MM-dd'),
        appId: issue.app_id,
        info: issue.info,
        events: Math.ceil(Math.random() * 20),
        users: Math.ceil(Math.random() * 10)
      }));
      return parsedIssues as Issue[];
    }
  });
  // const getCreateApplication = (appId: string) => {
  //   return applications?.find(app => app.appId === appId);
  // };

  const activeIssues = useMemo(() => {
    return issues?.filter(issue => issue.status === 0);
  }, [issues]);

  const draftIssues = useMemo(() => {
    return issues?.filter(issue => issue.status === 1);
  }, [issues]);

  return (
    <div className="flex-1 flex-col">
      <header className="flex items-center justify-between h-[36px] mb-4">
        <h1 className="flex flex-row items-center text-xl font-semibold">
          <Bug className="h-6 w-6 mr-2" />
          缺陷
        </h1>
      </header>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all" className="cursor-pointer">
              所有
            </TabsTrigger>
            <TabsTrigger value="active" className="cursor-pointer">
              待解决
            </TabsTrigger>
            <TabsTrigger value="draft" className="cursor-pointer">
              已解决
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">筛选</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>列展示</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>所有</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>待解决</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>已解决</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <TabsContent value="all">
          <IssuesTable issues={issues as Issue[]} />
        </TabsContent>
        <TabsContent value="active">
          <IssuesTable issues={activeIssues as Issue[]} />
        </TabsContent>
        <TabsContent value="draft">
          <IssuesTable issues={draftIssues as Issue[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
