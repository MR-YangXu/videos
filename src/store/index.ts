import { createPinia } from 'pinia';
import { useAppStore } from './modules/app';
import { useUserInfoStore } from './modules/user';
import { useCounterStore } from './modules/counter';
import { useAuthStore } from './modules/auth';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export { useAppStore, useUserInfoStore, useCounterStore, useAuthStore };
export default pinia;
