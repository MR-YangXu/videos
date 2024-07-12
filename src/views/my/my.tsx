import { defineComponent, reactive, ref, onMounted } from 'vue';
import { Image, Button, Cell, Dialog, Icon } from 'vant';
import { useRouter } from 'vue-router';
import s from './style.module.less';
import HomeBg from '@/components/HomeBg';
import user from '@/assets/images/movie/user.png';
import historyList from '@/assets/images/movie/history-list.png';
import myList from '@/assets/images/movie/my-list.png';
import { clientLogout, queryUUID } from '@/apis/common';
import { handleLoadingNew } from '@/utils/handleResponse';
import { showToast } from 'vant';
import { useUserInfoStore } from '@/store/modules/user'
import fblogo from '@/assets/images/movie/fblogo.png';
import PayPopup from '@/components/PayNow';
import AddToHomeScreen from '@/components/addToHomeScreen/index';

// 注册页
export default defineComponent({
    setup() {
        const router = useRouter();
        const userInfo = useUserInfoStore();
        const showDialog = ref(false);
        const showPayPopup = ref(false);
        const showAddToHomeScreen = ref(false);
        const userInfos = reactive({});
        const userImg = ref(user);
        const navList = reactive([
            {
                title: 'My List',
                imgSrc: myList,
                url: 'favorites',
                width: '6vw',
                height: '6vw',
            },
            {
                title: 'History',
                imgSrc: historyList,
                url: 'historys',
                width: '6.94vw',
                height: '6.94vw',
            },
        ]);

        onMounted(() => {
            FB.init({
                appId: '825333532426431',
                cookie: true,
                xfbml: true,
                version: 'v20.0'
            });
        })

        const goLibrary = (url: string) => {
            router.push({
                name: url
            })
        };
        const goShopping = () => {
            showPayPopup.value = true;
            // router.push({
            //     name: 'shopping',
            //     query: {
            //         return_url: window.location.href,
            //     }
            // })
        };
        const handleCancel = () => {
          showDialog.value = true
        }
        const handleLogin = () => {
            try {
                FB.getLoginStatus(function(response) {
                    FB.logout(response => {
                        // 用户退出登录后的逻辑
                        console.log('User logged out:', response);
                    });
                });
                router.push({
                    name: 'login',
                });
            } catch (error) {
                router.push({
                    name: 'login',
                });
            }
        };
        const getUUID = async () => {
            const domain = import.meta.env.VITE_DOMAIN || (window.location.hostname ? window.location.hostname.replace(/www./g, '') : '');
            const { data } = await handleLoadingNew(
                queryUUID({ isClient: false, domain }),
            )
            userInfo.initUserInfo();
            localStorage.setItem('UUID', data?.user_info?.uuid || '')
        }
        const initData = () => {
            userInfos.id = '';
            userInfos.uuid = '';
            userInfos.site_id = '';
            userInfos.avatar = '';
            userInfos.last_login_time = '';
            userInfos.user_name = '';
            userInfos.expire_time = '';
            userInfos.subscribe_status = '';
            userInfos.login_type = '';
            userInfos.show_discount_txt = '';
            userInfos.show_card_form = '';
            userInfos.show_mode_once = '';
            userInfos.show_unlock_history = '';
        }
        const initVideoPage = () => {
            initData()
            initPage();
        }
        const handleLoginOut = async () => {
            try {
                const res = await handleLoadingNew(
                    clientLogout()
                );
                await getUUID();
                initData()
                initPage();
                FB.getLoginStatus(function(response) {
                    FB.logout(response => {
                        // 用户退出登录后的逻辑
                        console.log('User logged out:', response);
                    });
                });
                router.push({
                    name: 'my',
                    replace: true,
                });
            } catch(err) {
                showToast(err?.msg || '');
            }
        };
        const initPage = async () => {
            // TODO: 待PWA一起上
            // 判断是否支付成功，如果支付成功，则弹窗指引用户添加到桌面
            const pay_success = localStorage.getItem('pay_success');
            const orderStatus = router.currentRoute.value.query?.orderStatus || '';
            // if (pay_success === '1' || (pay_success === '1' && ['-2', '-1', '1'].includes(String(orderStatus)))) {
            // 如果后端接口成功，进入页面清除成功标识
            pay_success === '1' && localStorage.removeItem('pay_success');
            if (pay_success === '1' && String(orderStatus) !== '0') {
                showAddToHomeScreen.value = true;
            }
            if (!userInfo.userInfo.uuid || !userInfo.userInfo.id) {
                const res = (await userInfo.getUserInfos()) || {};
                Object.assign(userInfos, res);
            } else {
                Object.assign(userInfos, userInfo.userInfo);
            }
            // userImg.value = userInfos?.avatar || user;
            userImg.value = user;
        };
        initPage();

        return () => <div class={s.my}>
            <HomeBg v-slots={{
                default: () => <div class='content'>
                    <div class="userInfo">
                        <div class="user-left">
                            <Image src={ userImg.value } alt="" />
                        </div>
                        <div class="user-right">
                            {
                                String(userInfos?.login_type) === '1' ? <div class="userName">{ userInfos?.user_name || 'Guest' }</div> : (<div class="userName">Guest</div>)
                            }
                            <div class="userId"><img v-show={ userInfos?.login_source === 1 } class="fblogo" src={ fblogo } alt="" />UID:{ userInfos?.uuid || '' }</div>
                        </div>
                    </div>
                    {/* TODO: 二期待做 */}
                    <div class="amount" v-show={ !['1'].includes(String(userInfos?.subscribe_status)) }>
                        <div class="amount-left">
                            <div class="num">Free plan</div>
                        </div>
                        <div class="amount-right">
                            <div class="amount-btn">
                                <Button onClick={ goShopping } type="primary" size="normal">Subscribe now</Button>
                            </div>
                        </div>
                    </div>
                    <div class="amount mb10" v-show={ ['1'].includes(String(userInfos?.subscribe_status)) }>
                        <div class="amount-left">
                            <div class="num">Premium</div>
                        </div>
                        <div class="amount-right">
                            <div class="text">
                                Expired on { userInfos?.expire_time || '' }
                            </div>
                            <div class="cancel-btn" onClick={ () => handleCancel() }>
                                Cancel
                            </div>
                        </div>
                    </div>
                    <div class="nav-list">
                        {
                            navList.map(item => <>
                                <Cell onClick={ () => goLibrary(item.url) } title={ item.title } is-link v-slots={{
                                    'icon': () => <Image width={ item.width } height={ item.height } src={ item.imgSrc } alt="" />
                                }}>
                                </Cell>
                            </>)
                        }
                        <Cell v-show={ String(userInfos.show_unlock_history) === '1' } onClick={ () => goLibrary('unlocked') } title="Unlocked" is-link v-slots={{
                            'icon': () => <Icon size="22" color="#e83a57ee" name="video-o" />
                        }}>
                        </Cell>
                    </div>
                    <div class="btn-logOut">
                        {
                            String(userInfos?.login_type) === '1'
                                ? <Button plain type="primary" size="large" onClick={ () => handleLoginOut() }>Login out</Button>
                                : <Button plain type="primary" size="large" onClick={ () => handleLogin() }>Sign in</Button>
                        }
                    </div>
                </div>
            }} />
            <Dialog v-model={[showDialog.value, 'show']} confirmButtonText="Confirm" confirmButtonColor="#e83a57" title="Cancel">
              <div class="cancel-dialog">
                <div>Could you please tell us the reason for your cancellation?</div>
                <div>You can send the reason for cancellation to our email address shel@kihole.com.</div>
                <div>We process within 1-3 working days.</div>
              </div>
            </Dialog>
            <PayPopup initVideoPage={ initVideoPage } v-model={ showPayPopup.value } />
            <AddToHomeScreen v-model={ showAddToHomeScreen.value } />
        </div>
    }
})