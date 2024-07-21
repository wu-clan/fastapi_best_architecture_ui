import axios from 'axios';
import qs from 'query-string';
import { LoginRes } from '@/api/auth';

export interface CallBackReq {
  code: string;
  state?: string;
  code_verifier?: string;
}

export function getOAuth2LinuxDo(): Promise<string> {
  return axios.get('/api/v1/oauth2/linux-do');
}

export function OAuth2LinuxDoCallBack(params: CallBackReq): Promise<LoginRes> {
  return axios.get('/api/v1/oauth2/linux-do/callback', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
