import { defineComponent, ref } from 'vue';
import { Image, Icon } from 'vant';
import s from './style.module.less';
import user from '@/assets/images/movie/user.png';
import logo from '@/assets/images/movie/m-logo.webp';
import { useRouter } from 'vue-router';


export default defineComponent({
    props: {
        active: {
            type: String,
            default: '0'
        }
    },
    setup(props, context) {
        const router = useRouter();
        const { slots } = context;
        const active = ref(props.active);

        return () => <div class={s.MyBg}>
            <div class="my-header-box">
                <div class="header-box-navMenu">
                    <img src={ logo } alt="" />
                </div>
                <div class="hader-box-user" v-show={ active.value === '0' }>
                    <Icon name="underway-o" class="history-icon" />
                    <Image src={ user } alt="" />
                </div>
            </div>
            <div class='bottom'>
            { slots.default ? slots.default() : null }
            </div>
        </div>
    }
})