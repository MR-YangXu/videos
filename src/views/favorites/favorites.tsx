import { defineComponent, reactive, ref, onMounted } from 'vue';
import { List } from 'vant';
import { useRouter } from 'vue-router';
import s from './style.module.less';
import HomeBg from '@/components/HomeBg';
import MovieRowItem from '@/components/MovieRowItem';
import Nothing from '@/components/Nothing';
import { favoriteList, userFavorite } from '@/apis/common';
import { handleLoadingNew } from '@/utils/handleResponse';
import { showToast } from 'vant';

// 注册页
export default defineComponent({
    setup() {
        const router = useRouter();
        const loading = ref(false);
        const finished = ref(false);
        const finishedText = ref('');
        const isFinish = ref(false);
        const movieList = reactive([]);
        let page = 1;
        const page_size = 10;

        onMounted(() => {
            finishedText.value = 'No more content';
        })

        const handleClick = async item => {
            await sessionStorage.setItem('CURRENTNUM', item.episode_num);
            router.push({
                name: 'videos',
                params: {
                    video_id: item.video_id,
                },
            })
        };
        const handleFavorite = async item => {
            try {
                const res = await handleLoadingNew(
                  userFavorite({
                    video_id: item.video_id,
                    episode_num: item.episode_num,
                    is_favorite: '2',
                  })
                );
                page = 1;
                onLoad(true);
            } catch(err: any) {
                showToast(err?.msg || '');
            }
        };
        const onLoad = async (isFirst: boolean) => {
            try {
                if (isFirst) {
                    movieList.splice(0);
                    page = 1;
                }
                const { data } = await favoriteList({
                    page,
                    page_size,
                });
                const list = data?.list || [];
                movieList.push(...list);
                isFinish.value=true;
                // 加载状态结束
                loading.value = false;
                page = page + 1;
                if (movieList.length >= data?.total) {
                    finished.value = true;
                }
            } catch(err) {
                isFinish.value=true;
                showToast(err?.msg || '');
            }
        };
        onLoad(true);

        return () => <div class={s.favorites}>
            <HomeBg v-slots={{
                default: () => <div class='content'>
                    <div class="movie-wrap">
                        {
                            <List
                                v-show={ isFinish.value && movieList.length }
                                v-model:loading={ loading.value }
                                finished={ finished.value }
                                loading-text="loading"
                                finished-text={ finishedText.value }
                                onLoad={ onLoad }
                                v-slots={{
                                    default: () => movieList.map(item => <MovieRowItem onClick={ handleClick } onFavorite={ handleFavorite }  currentItem={ item } />)
                                }}
                            >
                            </List>
                        }
                        <Nothing v-show={ isFinish.value && !movieList.length } />
                    </div>
                </div>
            }} />
        </div>
    }
})