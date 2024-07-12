import { defineComponent, PropType, onMounted, ref, reactive, computed } from 'vue';
import { Button, Popup, showToast } from 'vant';
import s from './style.module.less';
import payBg from '@/assets/images/movie/payBg.png';
import listActive from '@/assets/images/movie/listActive.png';
import listDefault from '@/assets/images/movie/listDefault.png';
import lockIcon from '@/assets/images/movie/lockIcon.png';
import { fbUserLogin } from '@/apis/common.ts'
import { useUserInfoStore } from '@/store/modules/user'
import { useRouter } from 'vue-router';
import report from '@/utils/report';
import PayItem from './PayItem/index.tsx';
import { createSubscribe } from '@/apis/common';
import { fbTrack } from '@/utils/facebook.js';
import { getCookie } from '@/utils/util';

export default defineComponent({
    props: {
        episodes_name: {
            type: String,
            default: ''
        },
        videoInfo: {
            type: Object,
            default: () => ({})
        },
        modelValue: {   // 使用modelValue作为v-model的默认属性名
            type: Boolean,
            default: false
        },
        initVideoPage: {
          type: Function,
          default: () => {}
        }
    },
    emits: ['update:modelValue'], // 声明事件，用于更新v-model的值
    setup(props, { emit }) {
        const router = useRouter();
        const UserStore = useUserInfoStore()
        const userInfo = ref({});
        const showBottom = ref(false);
        const paylist = reactive([]);
        const isActive = ref(0);
        function debounce(func, wait) {
            let timeout;
            return function() {
              const context = this;
              const args = arguments;
          
              clearTimeout(timeout);
              timeout = setTimeout(function() {
                func.apply(context, args);
              }, wait);
            };
        }
        const handleSubmit = async (query) => {
            try {
                const { from, id, current_episode_num, return_url, type, price } = query;
                const url = (return_url || '') as string;
                const utm_json = JSON.parse(getCookie('ga_utm')) || {};
                const res = await createSubscribe({
                    video_id: id,
                    return_url: url.indexOf('?') > 0 ? url?.split('?')[0] : url,
                    // 1=单包，2=周，3=月，4=年
                    subscribe_cycle_type: type,
                    // 广告id
                    utmct: utm_json.utm_content,
                });
                fbTrack({
                    eventName: 'Purchase',
                    customAttributes: {
                        content_ids: id || "default",
                        content_type: "product",
                        // // TODO: 待增加其他国家
                        currency: 'USD',
                        value: price,
                        num_items: "1",
                    }
                })
                if (from === 'video') {
                    report({
                        eventId: '3',
                        customAttributes: {
                            vi: id,
                            ep: current_episode_num
                        }
                    })
                } else {
                    report({
                        eventId: '3',
                        customAttributes: {}
                    })
                }
                await UserStore.getUserInfos();
                // TODO: 待PWA一起上
                await localStorage.setItem('ANDROID_PAY_SUCCESS', 'Y');
                await localStorage.setItem('pay_success', '1');
                const redirect_url = res?.data?.redirect_url || '';
                if (redirect_url) {
                    window.location.href = redirect_url;
                    return;
                }
                showToast('Success');
                handleClose();
                props?.initVideoPage?.();
            } catch(err: any) {
                showToast(err?.msg || 'The system is busy, please try again later');
                // errorMsg.value = err?.msg || 'The system is busy, please try again later';
            }
        };
        const handlePay = debounce(async () => {
            const types = {
                0: 1,
                7: 2,
                30: 3,
                365: 4,
            }
            const period = paylist[isActive.value]?.period || 0;
            const price = paylist[isActive.value]?.price || 0;
            try {
                const query = {
                    return_url: window.location.href,
                    type: types[period],
                    price,
                    id: '',
                    from: '',
                    current_episode_num: '',
                };
                if (props.videoInfo.from === 'video') {
                    Object.assign(query, props.videoInfo);
                }
                const { from, id, current_episode_num } = query;
                // 发起订阅埋点
                if (from === 'video') {
                    report({
                        eventId: '6',
                        customAttributes: {
                            vi: id,
                            ep: current_episode_num
                        }
                    })
                } else {
                    report({
                        eventId: '6',
                        customAttributes: {}
                    })
                }
                if (UserStore?.userInfo?.show_card_form === 0) {
                    handleSubmit(query);
                    return;
                }
                router.push({
                    name: 'shopping',
                    query
                })
            } catch(error) {
                console.warn(error, 'error')
            }
        }, 1000)
        const handleClose = () => {
            isVisible.value = false;
        }

        const isVisible = computed({
            get() {
                console.warn(props.modelValue, '===modelValue')
                return props.modelValue;
            },
            set(value) {
                console.warn(value, '===value')
                emit('update:modelValue', value);
            }
        })

        const initPage = async () => {
            // const sitInfo = await UserStore.getSiteInfo()
            const userInfo = UserStore.userInfo || {}
            const siteInfo = UserStore.siteInfo || {}
            console.warn(userInfo, '====userInfo', siteInfo)
            paylist.splice(0);
            const subscribe_mode = siteInfo.subscribe_mode || {};

            const arr = [
                { ...subscribe_mode.subscribe_mode_week },
                { ...subscribe_mode.subscribe_mode_month },
                { ...subscribe_mode.subscribe_mode_year },
            ]
            isActive.value = 1;
            if (userInfo.show_mode_once === 1 && window.location.pathname.indexOf('/my') === -1) {
                arr.unshift({ ...subscribe_mode.subscribe_mode_once })
                isActive.value = 2;
            }
            paylist.push(...arr);
        }

        onMounted(() => {
            initPage();
        });

        return () => {
            return <div class={s.payNow}>
                <Popup
                    class="payNowPopup"
                    v-model={[isVisible.value, 'show']}
                    round
                    position="bottom"
                    onClose={ () => handleClose() }
                >
                    <div class="popup-content">
                        <div class="pupop-header">
                            <img class="lockIcon" src={ lockIcon } alt="" />
                            <span class="text">Unlock subsequent episodes</span>
                        </div>
                        <div class="pupop-body">
                            <div class="title">Subscribe</div>
                            <div class="pay-list">
                            {
                                paylist.map((item, index) => <PayItem onClick={ () => { isActive.value = index }} currentItem={ item } currentIndex={ index } isActive={ isActive.value } episodes_name={ props.episodes_name }></PayItem> )
                            }
                            </div>
                        </div>
                        <div class="popup-footer">
                            <Button onClick={ () => handlePay() } type="primary" size="large">
                                Pay Now
                            </Button>
                        </div>
                    </div>
                </Popup>
            </div>
        }
    }
})