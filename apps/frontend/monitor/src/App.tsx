import { Toaster } from '@/components/ui/sonner';
import { router } from '@/router';
import { RouterProvider } from 'react-router';

function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
