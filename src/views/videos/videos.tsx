import { defineComponent, reactive, getCurrentInstance, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import s from './style.module.less';
import Videocom from '@/components/videoPlay/videocom.vue';
import { videoEpisode, getLanding } from '@/apis/common';
import { handleLoadingNew } from '@/utils/handleResponse';
import { showToast } from 'vant';
import report from '@/utils/report';

// 注册页
export default defineComponent({
    setup() {
        const router = useRouter();
        const video_id = router.currentRoute.value.params?.video_id || '';
        const token = router.currentRoute.value.query?.token || '' as any;
        // 获取当前组件实例
        const { proxy } = getCurrentInstance();
        const playsData = reactive({});
        let treeSelect = reactive([]);

        const initPage = async () => {
            let landing = {};
            try {
                landing = await handleLoadingNew(
                    getLanding({
                        token
                    })
                ) as any
            } catch(err) {}
            try {
                treeSelect.splice(0);
                const res = await handleLoadingNew(
                    videoEpisode({
                        video_id: video_id as string,
                        // episode_num: '',
                    })
                );
                const obj = res?.data?.list || {}
                Object.assign(playsData, obj);
                const time = landing?.data?.play_begin;
                if (landing?.data?.episode_num) {
                    playsData.current_episode_num = landing?.data?.episode_num
                }
                const len = Math.ceil((playsData?.episode_list?.length || 0) / 50);
                const arr = Array.from({ length: len }).map((item, index) => {
                    if (len === index + 1) {
                        return {
                            name: (index * 50 + 1) + '-' + playsData?.episode_list?.length,
                            info: playsData?.episode_list?.slice(index * 50, (index + 1) * 50),
                        };    
                    }
                    return {
                        name: (index * 50 + 1) + '-' + ((index + 1) * 50),
                        info: playsData?.episode_list?.slice(index * 50, (index + 1) * 50),
                    };
                })
                report({
                    eventId: '1',
                    customAttributes: {
                        vi: playsData?.id,
                        ep: playsData?.current_episode_num,
                    },
                })
                report({
                    eventId: '4',
                    customAttributes: {
                        vi: playsData?.id,
                        ep: playsData?.current_episode_num,
                    }
                })
                treeSelect.push(...arr);
                proxy.$refs.videoCom?.initPage({ time });
            } catch(err) {
                showToast(err?.msg || '');
            }
        };
        onMounted(() => {
            initPage();
        })

        return () => <div class={s.videos}>
            {
               <Videocom ref="videoCom" playsData={ playsData } initVideoPage={ initPage } treeSelect={ treeSelect } total_favorite={ playsData.total_favorite }></Videocom>
            }
        </div>
    }
})