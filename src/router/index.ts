// import { listenHistoryChange } from './helper';

import { wxRouteRecordRaw as routes } from './routers/index';
import { createRouter, createWebHistory } from 'vue-router';

const routerHistory = createWebHistory(import.meta.env.VITE_BASE_URL as string);
// export const historyChangeListeners = listenHistoryChange(routerHistory);

console.log('routes', routes);
const router = createRouter({
  history: routerHistory,
  routes,
});

export default router;
