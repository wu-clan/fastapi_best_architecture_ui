import { PaginationProps } from '@arco-design/web-vue';

export interface AnyObject {
  [key: string]: unknown;
}

export type Pagination = PaginationProps;

export interface treeSelectDataType<T = any> {
  id?: number | null;
  title?: string;
  name?: string;
  disabled?: boolean;
  children: T[];
}
