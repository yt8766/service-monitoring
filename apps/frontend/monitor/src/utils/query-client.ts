import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // 自动重试3次
      staleTime: 5 * 60 * 1000 // 缓存5分钟内不过期
    }
  }
});
