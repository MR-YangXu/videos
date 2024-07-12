import { defineComponent, PropType, onMounted, ref } from 'vue';
import { Swipe, SwipeItem, Image } from 'vant';
import s from './style.module.less';
// import imgSrc from '@/assets/images/movie/41000102982.webp';
import { useRouter } from 'vue-router';

export default defineComponent({
    props: {
        swipeLists: {
            type: Array,
            default: []
        },
    },
    setup(props, context) {
        const router = useRouter();

        const handleClick = item => {
            router.push({
                name: 'videos',
                params: {
                    video_id: item.video_id
                }
            })
        };
        onMounted(async () => {
            
        })
        return () => {
            const { swipeLists } = props
            return <div class={s.swiperList}>
                {
                    <div class="swiper-box">
                        <Swipe lazy-render={ true } autoplay={ 3000 }>
                            {
                                swipeLists.map((item, i) => {
                                    return (
                                        <SwipeItem key={ i } class="swiper-wrap" onClick={ () => handleClick(item) }>
                                            <Image width="29.07vw" height="39.2vw" src={ item.cover } alt={ item.title } />
                                            <div class="swiper-wrap-right">
                                                <div class="right-card-top">
                                                    <div class="title">{ item.title }</div>
                                                    <div class="count">{ item.total_episodes } Episodes</div>
                                                    <div class="desc">{ item.desc }</div>
                                                </div>
                                                <div class="right-bottom">
                                                    {
                                                        item.tags?.map?.(items => <div class="tag">{ items }</div>)
                                                    }
                                                </div>
                                            </div>
                                        </SwipeItem>
                                    )
                                })
                            }
                        </Swipe>
                    </div>
                }
            </div>
        }
    }
})