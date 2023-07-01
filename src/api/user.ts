import axios from 'axios';
import { UserState } from '@/store/modules/user/types';
import { MenuItem } from '@/store/modules/app/types';

export interface LoginData {
  username: string;
  password: string;
  captcha: string;
}

export interface LoginRes {
  access_token: string;
}

export function getCaptcha() {
  return axios.get('/api/v1/auth/captcha');
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/v1/auth/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/v1/auth/logout');
}

export function getUserInfo() {
  return axios.get<UserState>('/api/v1/users/me');
}

export function getUserMenuList() {
  return axios.get<MenuItem[]>('/api/v1/menus/sidebar');
}
