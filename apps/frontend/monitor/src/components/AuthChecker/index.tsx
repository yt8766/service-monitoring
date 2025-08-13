import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function getJwtExp(token: string | null): number | null {
  if (!token) return null;
  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) return null;
    // base64url -> base64
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const decoded = atob(base64 + padding);
    const payload = JSON.parse(decoded);
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string | null, clockSkewSec: number): boolean {
  const exp = getJwtExp(token);
  // 无法解析或无exp，视为过期
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  // 预留一定时钟偏移，避免刚好过期边界
  return exp <= now + clockSkewSec;
}

export interface AutoAuthCheckerProps {
  // 检查间隔（毫秒）
  checkIntervalMs?: number;
  // 登录页路由
  loginPath?: string;
  // 从本地存储读取token的key（当未提供getToken时使用）
  storageKey?: string;
  // 自定义获取token的方法（例如从cookie或上下文读取）
  getToken?: () => string | null;
  // 时钟偏移（秒），默认30秒
  clockSkewSec?: number;
  // 受保护的子节点
  children?: React.ReactNode;
}

const AutoAuthChecker: React.FC<AutoAuthCheckerProps> = ({
  checkIntervalMs = 30000,
  loginPath = '/login',
  storageKey = 'token',
  getToken,
  clockSkewSec = 30,
  children
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectedRef = useRef(false);

  useEffect(() => {
    const safeGetToken = () => {
      if (typeof window === 'undefined') return null;
      return getToken ? getToken() : window.localStorage.getItem(storageKey);
    };

    const redirectToLogin = () => {
      if (redirectedRef.current) return;
      redirectedRef.current = true;
      navigate(loginPath, { replace: true, state: { from: location } });
    };

    const checkAuth = () => {
      const token = safeGetToken();
      if (isTokenExpired(token, clockSkewSec)) {
        redirectToLogin();
      }
    };

    // 初次加载检查一次
    checkAuth();

    // 定时检查
    const timer = window.setInterval(checkAuth, checkIntervalMs);

    // 页面重新可见时检查（避免后台挂起导致错过定时器）
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkAuth();
      }
    };

    // 监听其他标签页对token的修改
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === storageKey) {
        checkAuth();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('storage', onStorage);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
    };
  }, [checkIntervalMs, clockSkewSec, getToken, loginPath, navigate, location, storageKey]);

  return children;
};

export default AutoAuthChecker;
