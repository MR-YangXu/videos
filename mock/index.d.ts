import { Recordable } from 'vite-plugin-mock';

export interface MockResponse {
  body: Recordable;
  query: Recordable;
  headers: Recordable;
}