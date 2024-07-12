import { defineComponent, PropType, onMounted, ref, reactive } from 'vue';
import { Button } from 'vant';
import s from './style.module.less';
import fblogo from '@/assets/images/movie/fblogo.png';
import { fbUserLogin } from '@/apis/common.ts'
import { useUserInfoStore } from '@/store/modules/user'
import { useRouter } from 'vue-router';
import report from '@/utils/report';
import axios from 'axios';

const fb = window.FB;
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
    setup() {
        const router = useRouter();
        const UserStore = useUserInfoStore()
        const userInfo = ref({});
        const fbUserLogins = async () => {
            try {
                if (!userInfo.value.id) return;
                const { from, id, current_episode_num } = router.currentRoute.value.query;
                const res = await fbUserLogin({
                    user_name: userInfo.value.email || userInfo.value.name,
                    oauth_user_id: userInfo.value.id,
                    avatar: userInfo.value?.picture?.data?.url,
                    nickname: userInfo.value.name,
                })
                if (res?.data?.user_info?.first_register) {
                    if (from === 'video') {
                        report({
                            eventId: '2',
                            customAttributes: {
                                vi: id,
                                ep: current_episode_num
                            }
                        })
                    } else {
                        report({
                            eventId: '2',
                            customAttributes: {}
                        })
                    }
                }
                UserStore.setUserInfo(res?.data?.user_info || {});
                localStorage.setItem('UUID', res?.data?.user_info?.uuid || '')
                if (from === 'video') {
                    router.push({
                        name: 'my',
                        replace: true,
                    });
                    return;
                }
                router.push({
                    name: 'my',
                    replace: true,
                });
                console.warn(res, 'res======')
            } catch(error) {
                console.warn(error, 'error')
                const m = error?.msg || ''
                report({
                    eventId: '5',
                    customAttributes: {
                        m,
                    }
                })
            }
        }
        function endsWithSlash(strs) {
            if (!strs) return '';
            const str = strs.replace('register', 'login');
            return str.charAt(str.length - 1) === '/' ? str : str + '/';
        }
        const handleFbSign = () => {
            const redirect_uri = window.location.href.indexOf('?') > 0 ? window.location.href.split('?')[0] : window.location.href;
            const url = `https://www.facebook.com/v18.0/dialog/oauth?client_id=825333532426431&redirect_uri=${endsWithSlash(redirect_uri)}&response_type=token`;
            console.warn(url, 'url')
            window.location.href = url;
            // getLoginStatus();
            // fb.login(
            //     (res) => {
            //         if (res.authResponse) {
            //             // 获取用户信息
            //             fb.api("/me?fields=name,email,picture", (res) => {
            //                 userInfo.value = res || {};
            //                 // 发送res.authResponse.accessToken到你的服务器进行验证
            //                 console.warn(userInfo, '----userInfo')
            //                 fbUserLogins();
            //             });
            //         } else {
            //             console.log("User cancelled login or did not fully authorize.");
            //         }
            //     },
            //     // { scope: "public_profile, email" }
            //     { scope: "email, public_profile" }
            // );
            
        };
        function setCookie(name, value, days) {
            let expires = "";
            if (days) {
              let date = new Date();
              date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
              expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
        }
        const getFbloKey = () => {
            const str = document.cookie;
            const regex = /fblo_([^=]+)/; // 正则表达式匹配 fbsr_ 后面的内容直到等号
            const match = str.match(regex);

            if (match) {
                const result = match[1]; // 捕获组中的内容
                return 'fblo_' + result;
            } else {
                return '';
            }
        }
        const getUrlParam = (searchString) => {
            const params = new URLSearchParams(searchString);
            // 将参数转换为对象
            const obj = Object.fromEntries(params.entries());
            return obj;
        }
        const getAccessToken = async (code) => {
            const redirect_uri = window.location.href.indexOf('?') > 0 ? window.location.href.split('?')[0] : window.location.href;
            const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
                params: {
                    client_id: '825333532426431',
                    redirect_uri: endsWithSlash(redirect_uri),
                    client_secret: '3159517d0faeda70f93378888dacd4fe',
                    code: code,
                }
            });
            return response.data.access_token;
        }
        const getUserInfo = async (accessToken) => {
            const response = await axios.get('https://graph.facebook.com/me', {
                params: {
                    access_token: accessToken,
                    fields: 'id,name,email,picture',
                }
            });
            return response.data;
        };
        const getLoginStatus = async () => {
            const hashString = window.location.hash?.substr?.(1);
            const hashParams = getUrlParam(hashString);
            const searchString = window.location.search?.substr?.(1);
            const urlParams = getUrlParam(searchString);
            const access_token = hashParams.access_token || urlParams.access_token;
            const code = urlParams.code || hashParams.code;
            if (access_token) {
                // 获取用户信息
                userInfo.value = await getUserInfo(access_token) || {};
                // 发送res.authResponse.accessToken到你的服务器进行验证
            } else if (code) {
                // 获取accessToken
                const access_token = await getAccessToken(code);
                // 获取用户信息
                userInfo.value = await getUserInfo(access_token) || {};
            }
            // 发送res.authResponse.accessToken到你的服务器进行验证
            console.warn(userInfo.value, '----userInfo')
            fbUserLogins();
        }

        onMounted(() => {
            fb.init({
                appId: '825333532426431',
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
            // 清除facebook 退出登录状态，获取fbsr
            const fblo = getFbloKey();
            setCookie(fblo, '', 0);
            getLoginStatus();

            // fb.getLoginStatus(function(response) {
            //     if (response.status === 'connected') {
            //         // 已经登录
            //         console.log('User is logged in.');
            //         // 获取用户信息
            //         fb.api("/me?fields=name,email,picture", (res) => {
            //             userInfo.value = res || {};
            //             // 发送res.authResponse.accessToken到你的服务器进行验证
            //             console.warn(userInfo, '----userInfo')
            //             fbUserLogins();
            //         });
            //     } else if (response.status === 'not_authorized') {
            //         // 用户未授权
            //         console.log('User is not authorized.');
            //     } else {
            //         // 用户未登录
            //         console.log('User is not logged in.');
            //     }
            // });
        });

        return () => {
            return <div class={s.fbButton}>
                <Button onClick={ () => handleFbSign() } type="primary" size="large">
                    <img class="fblogo" src={ fblogo } alt="" />Sign in with Facebook
                </Button>
            </div>
        }
    }
})