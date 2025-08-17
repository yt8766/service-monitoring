import { CreateApplicationPayload } from '@/types/api';
import { request } from '@/utils';

export const fetchApplicationList = async () => {
  const list = await request.get('/application');
  return list;
};

export const createApplication = async (data: CreateApplicationPayload) => {
  return await request.post('/application/create', data);
};
