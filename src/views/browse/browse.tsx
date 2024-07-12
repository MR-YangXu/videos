import { defineComponent, reactive, ref } from 'vue';
import { Tabs, Tab, Overlay, List } from 'vant';
import s from './style.module.less';
import HomeBg from '@/components/HomeBg';
import MovieItem from '@/components/MovieItem'
import browserMore from '@/assets/images/movie/browser-more.webp';
import browserMoreTop from '@/assets/images/movie/browser-more-top.png';
import { tagLists, browses } from '@/apis/common';
import { handleLoadingNew } from '@/utils/handleResponse';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
import Nothing from '@/components/Nothing';

// 注册页
export default defineComponent({
    setup() {
        const router = useRouter();
        const loading = ref(false);
        const finished = ref(false);
        const isFinish = ref(false);
        const movieList = reactive([]);
        const tabList = reactive([
            // { tag_name: 'All' },
            // { text: 'Concealed Identity' },
            // { text: 'Counterattack' },
            // { text: 'Cinta Pahit' },
            // { text: 'Popular' },
            // { text: 'Avenge' },
            // { text: 'Sweet Love' },
            // { text: 'Revenge' },
            // { text: 'Paranormal' },
            // { text: 'Betrayal' },
            // { text: 'Underdog Rise' },
            // { text: 'Urban' },
            // { text: 'Secret Identity' },
            // { text: 'Werewolf' },
            // { text: 'Mafia' },
            // { text: 'Rebirth' },
            // { text: 'Romance' },
            // { text: 'CEO' },
            // { text: 'Miliarder' },
            // { text: 'True Love' },
            // { text: 'Marriage Before Love' },
            // { text: 'Comeback' },
            // { text: 'Fantasy' },
            // { text: 'Contract Marriage' },
            // { text: 'Time Travel' },
            // { text: 'Bitter Love' },
            // { text: 'Destiny' },
        ]);
        const active = ref(0);
        const show = ref(false);
        let tag = 'All';
        let page = 1;
        const page_size = 10;

        const handleDropDown = () => {
            show.value = true;
        }
        const handleDropTop = () => {
            show.value = false;
        }
        const handleOverlay = e => {
            e.stopPropagation();
        }
        const handleSelect = (item, index) => {
            active.value = index;
            show.value = false;
            handleClickTab({ title: item?.tag_name || '' })
        }
        const handleClickTab = value => {
            tag = value.title;
            movieList.splice(0);
            isFinish.value = false;
            finished.value = false;
            page = 1;
            onLoad();
            router.push({
                name: 'browse',
                params: {
                    id: active.value
                },
                query: {
                    tag: value.title
                }
            })
        }
        const onLoad = async () => {
            try {
                const { data } = await browses({
                    tag_name: tag as string,
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
        const initPage = async () => {
            try {
                const id = router.currentRoute.value.params.id as string;
                tag = router.currentRoute.value.query.tag as string;
                onLoad();
                const { data } = await tagLists({})
                let list = data?.list || [];
                list = list.map((item: any, index: number) => ({
                    ...item,
                    id: index + 1
                }))
                console.warn(list, "list");
                tabList.push({ tag_name: 'All', id } as never, ...list)
                active.value = Number(id);
            } catch(err) {
                showToast(err?.msg || '');
            }
        };
        initPage();

        return () => <div class={s.browse}>
            <HomeBg active="1" v-slots={{
                default: () => <div class='content'>
                    <div class="tab-box">
                        <div class="box-left">
                            <Tabs onClickTab={ handleClickTab } v-model:active={ active.value }>
                                {
                                    tabList.map((item, index) => <>
                                        <Tab title={ item.tag_name }></Tab>
                                    </>)
                                }
                            </Tabs>
                        </div>
                        <div class="box-right">
                            <div class="dropdown">
                                <img onClick={ handleDropDown } src={ browserMore } alt="" />
                            </div>
                        </div>
                    </div>
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
            <Overlay class="browse-overlay" show={ show.value } onClick={ () => show.value = false } v-slots={{
                default: () => <div class="menu-box" onClick={ (e) => handleOverlay(e) }>
                    <div class="menu-head">
                        <span>Browse</span>
                        <img onClick={ handleDropTop } src={ browserMoreTop } alt="" />
                    </div>
                    <div class="menu-content">
                        {
                            tabList.map((item, index) => <>
                                <div onClick={ () => handleSelect(item, index) } class={`menu-item ${ active.value === index && 'menu-active' }`}>{ item.tag_name }</div>
                            </>)
                        }
                    </div>
                </div>
            }}></Overlay>
        </div>
    }
})