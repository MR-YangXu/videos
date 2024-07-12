import { RouteComponent, RouteRecordRaw, RouterHistory } from 'vue-router';
import { uncapitalizeFirstLetter } from '@/utils/object';

function findRoute(routes: RouteRecordRaw[], name: string): RouteRecordRaw | undefined {
  for(const route of routes){
    if(route.name === name){
      return route;
    } if(route.children?.length) {
      const targetRoute = findRoute(route.children, name);
      if(targetRoute)
        return targetRoute;
    }
  }
}

declare type CustomRoute = {
  name: string;
  component: RouteComponent;
  meta?: any
}
export function appendRoute(routes: RouteRecordRaw[], route: CustomRoute): void;
export function appendRoute(routes: RouteRecordRaw[], parent: string, route: CustomRoute): void;
export function appendRoute(...args: any): void {
  let routes: RouteRecordRaw[];
  let parentName: string | undefined;
  let route: CustomRoute;
  if(!args[2]) {
    routes = args[0];
    parentName = undefined;
    route = args[1];
  } else {
    routes = args[0];
    parentName = args[1];
    route = args[2];
  }

  let comps: RouteRecordRaw[];
  let defaultPath: string;
  if(parentName) {
    const parent = findRoute(routes, parentName);
    if(!parent) throw new Error(`cannot found parent component [${parent}]`);
    if(!parent.children)
      parent.children = [];
    comps = parent.children;
    defaultPath = parent.path + '/';
  } else {
    comps = routes;
    defaultPath = '/';
  }

  const key = uncapitalizeFirstLetter(route.name || '');
  comps.push({
    path: defaultPath + key,
    name: key,
    component: injectTracks(route),
    meta: route.meta ?? {}
  });
}

// 往组件中注入逻辑
export function injectTracks(route: CustomRoute) {
  if(typeof route.component === 'function' && route.meta?.inject){
    const injects = Array.isArray(route.meta?.inject) ? route.meta?.inject : [route.meta?.inject];

    if(injects?.length) {
      return () => Promise.all([
        (route.component as () => Promise<typeof import('*.vue')>)(),
        Promise.all(injects.map((injectItem: any) => injectItem()))
      ])
        .then(([data, injectItems]) => {
          const _setup = data.default.setup;

          if(_setup){
            data.default.setup = function setup_wrapper(props, context){
              const setupResult = _setup?.(props, context);
              injectItems.forEach((injectItem: any) => injectItem.default(setupResult));
              return setupResult;
            };
          }

          return data;
        });
    }
  }

  return route.component;
}


export declare interface HistoryChangeInfo {
  delta: number,
  direction: 'back' | 'forward' | ''
};
export declare type HistoryChangeListener = (info: HistoryChangeInfo) => void;
// 处理浏览器自带前进回退引起的问题
export function listenHistoryChange(routerHistory: RouterHistory){
  let listeners: HistoryChangeListener[] = [];
  function fire(info: HistoryChangeInfo){
    listeners.forEach(listen => listen(info));
  }
  function destroy() {
    listeners = [];
  }

  routerHistory.listen((to, from, info) => {
    fire(info);
  });
  const routerHistoryGo = routerHistory.go;
  routerHistory.go = function (delta: number, triggerListeners?: boolean | undefined) {
    fire({
      delta,
      direction: delta
        ? delta > 0
          ? 'forward'
          : 'back'
        : ''
    });
    routerHistoryGo(delta, triggerListeners);
  };

  return {
    add(listen: HistoryChangeListener){
      listeners.push(listen);
      return function remove() {
        const index = listeners.indexOf(listen);
        if (index > -1)
          listeners.splice(index, 1);
      };
    },
    destroy
  };
}
