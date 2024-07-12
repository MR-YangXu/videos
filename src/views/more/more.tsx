import { defineComponent, reactive, ref } from 'vue';
import { Icon, List } from 'vant';
import s from './style.module.less';
import HomeBg from '@/components/HomeBg';
import MovieItem from '@/components/MovieItem';
import Nothing from '@/components/Nothing';
import { recommendCategoryVideos } from '@/apis/common';
import { handleLoadingNew } from '@/utils/handleResponse';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';

// 注册页
export default defineComponent({
    setup() {
        const router = useRouter();
        const loading = ref(false);
        const finished = ref(false);
        const isFinish = ref(false);
        const name = ref('');
        const movieList = reactive([]);
        const id = router.currentRoute.value.params.id || '';
        let page = 1;
        const page_size = 10;
        // const tabList = reactive([1, 2, 3, 4, 5, 6, 7, 8]);
        // const active = ref(0);

        const goHome = () => {
            router.push({
                name: 'home',
                replace: true
            })
        };
        const onLoad = async () => {
            try {
                const { data } = await recommendCategoryVideos({
                    category_id: id as string,
                    page,
                    page_size,
                });
                const list = data?.list || [];
                movieList.push(...list);
                name.value = data?.category?.name;
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
        onLoad();


        return () => <div class={s.more}>
            <HomeBg v-slots={{
                default: () => <div class='content'>
                    <div class="tab-box">
                        <div onClick={ () => goHome() }>Home</div>
                        <Icon class="tab-icon" name="arrow" />
                        <div>{ name.value }</div>
                    </div>
                    <div class="tab-title">{ name.value }</div>
                    <div class="list-box">
                        <List
                            v-show={ isFinish.value && movieList.length }
                            v-model:loading={ loading.value }
                            finished={ finished.value }
                            loading-text="loading"
                            finished-text="No more content"
                            onLoad={ onLoad }
                            v-slots={{
                                default: () => <div class="movie-wrap">
                                    {
                                        movieList.map(item => <MovieItem currentItem={ item } />)
                                    }
                                </div>
                            }}
                        >
                        </List>
                        <Nothing v-show={ isFinish.value && !movieList.length } />
                    </div>
                </div>
            }} />
        </div>
    }
})