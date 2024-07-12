import { defineComponent, PropType, onMounted, ref } from 'vue';
import { Image, Cell } from 'vant';
import { useRouter } from 'vue-router';
import s from './style.module.less';
import nothing from '@/assets/images/movie/nothing.webp';

export default defineComponent({
    props: {
        title: {
            type: String,
            default: 'Nothing inside ...'
        },
        imgSrc: {
            type: String,
            default: nothing
        },
    },
    setup(props, context) {
        const router = useRouter();

        onMounted(async () => {
            
        })
        return () => {
            const { imgSrc, title } = props
            return <div class={s.nothingBox}>
                {
                    // 非审核状态才有
                    <div class="nothing-wrap">
                        <Image src={ imgSrc || '' } />
                        <div class="title">{ title || '' }</div>
                    </div>
                }
            </div>
        }
    }
})