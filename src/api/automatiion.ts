import axios from 'axios';
import qs from 'query-string';
import { AnyObject } from '@/types/global';

export interface BusinessReq {
  app_name: string;
  table_name_en: string;
  table_name_zh: string;
  table_simple_name_zh: string;
  table_comment?: string;
  schema_name?: string;
  default_datetime_column: boolean;
  api_version: string;
  gen_path?: string;
  remark?: string;
}

export interface ModelReq {
  name: string;
  comment?: string;
  type: string;
  default?: string;
  sort: number;
  length: number;
  is_pk: boolean;
  is_nullable: boolean;
  gen_business_id?: number;
}

export interface BusinessRes extends BusinessReq {
  id: number;
}

export interface BusinessDetailRes extends BusinessRes {
  models?: ModelReq[];
}

export interface DBTableParams {
  table_schema: string;
}

export interface ImportParams {
  app: string;
  table_name: string;
  table_schema: string;
}

export function queryBusinessAll(): Promise<BusinessRes[]> {
  return axios.get('/api/v1/gen/businesses/all');
}

export function queryBusinessDetail(pk: number): Promise<BusinessDetailRes> {
  return axios.get(`/api/v1/gen/businesses/${pk}`);
}

export function createBusiness(data: BusinessRes) {
  return axios.post('/api/v1/gen/businesses', data);
}

export function updateBusiness(pk: number, data: BusinessRes) {
  return axios.put(`/api/v1/gen/businesses/${pk}`, data);
}

export function deleteBusiness(id: number) {
  return axios.delete(`/api/v1/gen/businesses/${id}`);
}

export function createModel(data: ModelReq) {
  return axios.post('/api/v1/gen/models', data);
}

export function updateModel(pk: number, data: ModelReq) {
  return axios.put(`/api/v1/gen/models/${pk}`, data);
}

export function deleteModel(id: number) {
  return axios.delete(`/api/v1/gen/models/${id}`);
}

export function queryDBTables(params: DBTableParams): Promise<string[]> {
  return axios.get('/api/v1/gen/tables', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

export function importDBTable(params: ImportParams) {
  return axios.post('/api/v1/gen/import', {
    params,
    paramsSerializer: (obj: AnyObject) => {
      return qs.stringify(obj);
    },
  });
}

export function previewCode(pk: number): Promise<AnyObject> {
  return axios.get(`/api/v1/gen/preview/${pk}`);
}

export function generateCode(pk: number) {
  return axios.post(`/api/v1/gen/generate/${pk}`);
}

export function downloadCode(pk: number) {
  return axios.get(`/api/v1/gen/download/${pk}`);
}