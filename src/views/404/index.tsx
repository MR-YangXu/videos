import { defineComponent } from 'vue';
import s from './style.module.less';
import Nothing from '@/components/Nothing';
import imgSrc from '@/assets/images/movie/404.png';

// 注册页
export default defineComponent({
    setup() {

        return () => <div class={s.pageBox}>
            <div class='content'>
                <div class="list-box">
                    <Nothing title="Oh, the page is missing, please refresh and try again." imgSrc={ imgSrc } />
                </div>
            </div>
        </div>
    }
})