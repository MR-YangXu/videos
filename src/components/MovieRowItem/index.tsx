import { defineComponent, PropType, onMounted, ref } from 'vue';
import { Image, Icon } from 'vant';
import { useRouter } from 'vue-router';
import s from './style.module.less';
import imgSrc from '@/assets/images/movie/41000102982.webp';

export default defineComponent({
    props: {
        currentItem: {
            type: Object,
            default: () => ({})
        },
        isFavorites: {
            type: Boolean,
            default: true
        }
    },
    emits: ['favorite', 'click'],
    setup(props, { emit }) {
        const router = useRouter();
        const collectionFlag = ref(true);

        const handleMovie = item => {
            emit('click', item);
        };

        onMounted(async () => {
            
        })
        return () => {
            const { currentItem } = props

            const handlecollection = (e, item) => {
                emit('favorite', item);
                collectionFlag.value = !collectionFlag.value;
                e.stopPropagation();
            };
            return <div class={s.movieRowItem}>
                {
                    // 非审核状态才有
                    <div class="movieRowItem-wrap" onClick={ () => handleMovie(currentItem) }>
                        <Image
                            width="24vw"
                            height="32vw"
                            src={ currentItem?.video?.cover || '' }
                        />
                        <div class="movieRowItem-info">
                            <div class="info-title">{ currentItem?.video?.title || '' }</div>
                            <div class="info-chapter">Played to Episode { currentItem?.episode_num || '' }</div>
                        </div>
                        <div class="movieRowItem-collect" v-show={ props.isFavorites }>
                            <Icon
                                onClick={ e => handlecollection(e, currentItem) }
                                name="star"
                                size="30"
                                color={ collectionFlag.value ? '#ffb701' : '#fff' }
                            />
                        </div>
                    </div>
                }
            </div>
        }
    }
})