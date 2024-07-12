import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
// import Layout from 'layout/index.vue';
// import register from '@/views/register/index.vue';
// import EnterpriseBeneficiary from '@/views/enterpriseBeneficiary.vue';
// import { appendRoute, listenHistoryChange } from '../helper';

// import { error } from '@/utils/log';
// import { exceptionLogs as error } from '@/utils/reportTools/logs';

const routes: RouteRecordRaw[] = [
  {
    // 注册页
    path: '/',
    redirect: '/home',
    meta: { name: 'shortvedio' },
    children: [
      {
        // 注册页
        path: '/',
        name: 'home',
        component: () => import('@/views/home/home'),
        meta: { name: 'shortvedio' },
      },
    ]
  },
  {
    // 注册页
    path: '/browse/:id',
    name: 'browse',
    component: () => import('@/views/browse/browse'),
    meta: { name: 'shortvedio' },
  },
  {
    // 用户信息
    path: '/more/:id',
    name: 'more',
    component: () => import('@/views/more/more'),
    meta: { name: 'shortvedio' },
  },
  {
    // 用户信息
    path: '/my',
    name: 'my',
    component: () => import('@/views/my/my'),
    meta: { name: 'shortvedio' },
  },
  {
    // 用户信息
    path: '/videos/:video_id',
    name: 'videos',
    component: () => import('@/views/videos/videos'),
    meta: { name: 'shortvedio' },
  },
  {
    // 购买金币
    path: '/shopping',
    name: 'shopping',
    component: () => import('@/views/shopping/shopping'),
    meta: { name: 'shortvedio' },
  },
  {
    // 收藏记录
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/favorites/favorites'),
    meta: { name: 'shortvedio' },
  },
  {
    // 历史记录
    path: '/historys',
    name: 'historys',
    component: () => import('@/views/historys/historys'),
    meta: { name: 'shortvedio' },
  },
  {
    // 登录页
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login'),
    meta: { name: 'shortvedio' },
  },
  {
    // 注册页
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/register'),
    meta: { name: 'shortvedio' },
  },
  {
    // 忘记密码
    path: '/retrievePassword',
    name: 'retrievePassword',
    component: () => import('@/views/retrievePassword/retrievePassword'),
    meta: { name: 'shortvedio' },
  },
  {
    // 注册页
    path: '/privacyPolicy',
    name: 'privacyPolicy',
    component: () => import('@/views/privacyPolicy/privacyPolicy'),
    meta: { name: 'shortvedio' },
  },
  {
    // 注册页
    path: '/serviceAgreement',
    name: 'serviceAgreement',
    component: () => import('@/views/serviceAgreement/serviceAgreement'),
    meta: { name: 'shortvedio' },
  },
  {
    // 注册页
    path: '/unlocked',
    name: 'unlocked',
    component: () => import('@/views/unlocked/unlocked'),
    meta: { name: 'shortvedio' },
  },
  {
    // 注册页
    path: '/404',
    name: '404',
    component: () => import('@/views/404/index'),
    meta: { name: 'shortvedio' },
  },
  /** 页面列表 */
  // {
  //   path: '/pageList',
  //   name: 'pageList',
  //   component: () => import('@/views/demo/pageList.vue'),
  //   meta: { name: '所有demo 页面' },
  // },
];

export const wxRouteRecordRaw = routes;

const routerHistory = createWebHistory(import.meta.env.VITE_BASE_URL as string);

const router = createRouter({
  history: routerHistory,
  routes,
});

export default router;
