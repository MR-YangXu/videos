import { defineComponent, PropType, onMounted, ref, reactive } from 'vue';
import { Cell } from 'vant';
import s from './style.module.less';
import MovieItem from '../MovieItem/index';
import { useRouter } from 'vue-router';

export default defineComponent({
    props: {
        currentItem: {
            type: Object,
            default: () => ({})
        },
        rows: {
            type: Boolean,
            default: false
        }
    },
    setup(props, context) {
        const router = useRouter();
        // const movieList = reactive([1, 2, 3, 4, 5, 6]);

        const handleList = item => {
            router.push({
                name: 'more',
                params: {
                    id: item.id
                }
            })
        }

        onMounted(async () => {
            
        })
        return () => {
            const { slots } = context;
            const { currentItem, rows } = props;
            return <div class={s.homeItem}>
                {
                    // 非审核状态才有
                    <div>
                        <Cell title={ currentItem.name || '' } is-link onClick={ () => handleList(currentItem) } />
                        <div class={ rows ? "movie-wrap-rows" : "movie-wrap" }>
                            {
                                currentItem?.video_list?.map?.(item => <MovieItem currentItem={ item } />)
                            }
                        </div>
                    </div>
                }
                {slots.default ? slots.default() : null}
            </div>
        }
    }
})