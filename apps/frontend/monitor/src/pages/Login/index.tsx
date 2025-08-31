import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as services from '@/services';
import { CreateUserPayload } from '@/types/api';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CreateAdmin } from './CreateAdmin';

export function Login() {
  const form = useForm<CreateUserPayload>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const navigate = useNavigate();

  const handleSubmit = async (values: CreateUserPayload) => {
    try {
      const res = await services.login({
        ...values
      });

      if (!res.data) {
        toast.error('请稍后重试！');
        return;
      }

      toast.success('登录成功！');

      localStorage.setItem('token', res.data.access_token);

      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/projects';
      navigate(redirectUrl);
    } catch (err) {
      toast.error(`登录失败，用户名或密码错误，请重试`);
    }
  };

  return (
    <div className="container relative h-screen w-full flex items-center justify-center max-w-none bg-muted">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold ">前端监控平台</h1>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                rules={{ required: '请输入用户名' }}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input autoComplete="username" {...field} placeholder="请输入用户名" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                rules={{ required: '请输入密码' }}
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input autoComplete="current-password" {...field} type="password" placeholder="请输入密码" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4">
                登录
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center w-full">
          <div className="text-center text-sm">
            <span>还没有账户？</span>
            <CreateAdmin />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
