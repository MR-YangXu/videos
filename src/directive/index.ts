import { App } from 'vue';
import track from '@/directive/track';
import longpress from '@/directive/longpress';

export default function installDirective(app: App<Element>) {
  track(app);
  longpress(app);
}
