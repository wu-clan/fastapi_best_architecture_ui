import axios from 'axios';

export interface ServerMonitorRes {
  cpu: Record<string, any>;
  mem: Record<string, any>;
  sys: Record<string, any>;
  disk: Record<string, any>[];
  service: Record<string, any>;
}

export interface RedisMonitorRes {
  info: Record<string, any>;
  stats: Record<string, any>[];
}

export function queryServerMonitor(): Promise<ServerMonitorRes> {
  return axios.get('/api/v1/monitors/server');
}

export function queryRedisMonitor(): Promise<RedisMonitorRes> {
  return axios.get('/api/v1/monitors/redis');
}
