import axios from 'axios';

export interface CasbinPolicyReq {
  sub: string;
  path: string;
  method: string;
}

export interface CasbinPoliciesReq {
  ps: CasbinPolicyReq[];
}

export interface CasbinPoliciesDel {
  uuid?: string;
  role: string;
}

export interface CasbinGroupReq {
  uuid: string;
  role: string;
}

export interface CasbinGroupsReq {
  gs: CasbinGroupReq[];
}

export interface CasbinGroupDel {
  uuid: string;
}

export function queryCasbinPoliciesByRole(role?: number) {
  return axios.get(`/api/v1/casbin/policies`, {
    params: { role },
  });
}

export function createCasbinPolicy(data: CasbinPolicyReq) {
  return axios.post('/api/v1/casbin/policy', data);
}

export function createCasbinPolicies(data: CasbinPoliciesReq) {
  return axios.post('/api/v1/casbin/policies', data.ps);
}

export function deleteCasbinPolicies(data: CasbinPoliciesDel) {
  return axios.delete('/api/v1/casbin/policies/all', { data });
}

export function createCasbinGroup(data: CasbinGroupReq) {
  return axios.post('/api/v1/casbin/group', data);
}

export function createCasbinGroups(data: CasbinGroupsReq) {
  return axios.post('/api/v1/casbin/groups', data.gs);
}

export function deleteCasbinAllGroups(data: CasbinGroupDel) {
  return axios.delete('/api/v1/casbin/groups/all', { data });
}
