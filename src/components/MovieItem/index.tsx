import { defineComponent, PropType, onMounted, ref } from 'vue';
import { Image, Cell } from 'vant';
import { useRouter } from 'vue-router';
import s from './style.module.less';
import imgSrc from '@/assets/images/movie/41000102982.webp';

export default defineComponent({
    props: {
        currentItem: {
            type: Object,
            default: () => ({})
        },
    },
    setup(props, context) {
        const router = useRouter();

        const handleMovie = item => {
            router.push({
                name: 'videos',
                params: {
                    video_id: item.video_id
                },
            })
        };

        onMounted(async () => {
            
        })
        return () => {
            const { currentItem } = props
            return <div class={`movieItemRow ${ s.movieItem }`}>
                {
                    // 非审核状态才有
                    <div class="movieItem-wrap" onClick={ () => handleMovie(currentItem) }>
                        <Image
                            width="29.07vw"
                            height="39.2vw"
                            src={ currentItem.cover || '' }
                            alt={ currentItem.title || '' }
                        />
                        <span>{ currentItem.title || '' }</span>
                    </div>
                }
            </div>
        }
    }
})