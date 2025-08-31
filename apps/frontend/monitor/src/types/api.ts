/**
 * 用户相关
 */
export interface CreateUserPayload {
  username: string;
  password: string;
}

export interface CreateAdminPayload {
  username: string;
  password: string;
  email: string;
  phone: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
}

export interface CurrentUserRes {
  username: string;
  email: string;
}

/**
 * 应用相关
 */
export type ApplicationType = 'vanilla' | 'react' | 'vue';

export interface ApplicationData {
  type: ApplicationType;
  appId: string;
  name: string;
  bugs: {
    create_at: string;
    event_type: string;
    desktop: number;
  }[];
  transactions: number;
  data: {
    date: string;
    resting: number;
    event_type: string;
    visitors: number;
  }[];
  lineChartData: {
    date: string;
    resting: number;
    event_type: string;
    visitors: number;
  }[];
  createdAt: Date;
}
/**
 * 应用列表
 */
export interface ApplicationListRes {
  data: { applications: ApplicationData[] };
}

/**
 * 创建应用
 */
export interface CreateApplicationPayload {
  name: string;
  type: ApplicationType;
  description?: string;
}
