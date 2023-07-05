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

export interface CaptchaRes {
  image: string;
  image_type: string;
}

export function getCaptcha(): Promise<CaptchaRes> {
  return axios.get('/api/v1/auth/captcha');
}

export function login(data: LoginData): Promise<LoginRes> {
  return axios.post('/api/v1/auth/login', data);
}

export function logout() {
  return axios.post('/api/v1/auth/logout');
}

export function getUserInfo(): Promise<UserState> {
  return axios.get('/api/v1/users/me');
}

export function getUserMenuList(): Promise<MenuItem[]> {
  return axios.get('/api/v1/menus/sidebar');
}
