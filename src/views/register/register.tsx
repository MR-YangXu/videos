import { defineComponent, onMounted, ref, computed } from 'vue';
import { Field, Button, NavBar } from 'vant';
import { useRouter } from 'vue-router';
import s from './style.module.less';
import HomeBg from '@/components/HomeBg';
import { memberRegister, privacys } from '@/apis/common';
import { handleLoadingNew } from '@/utils/handleResponse';
import { showToast } from 'vant';
import { useUserInfoStore } from '@/store/modules/user';
import report from '@/utils/report';
import fblogo from '@/assets/images/movie/fblogo.png';
import FbButton from '@/components/FbButton';

// 登录页
export default defineComponent({
    setup() {
        const router = useRouter();
        const email = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const created_by_email = ref('');
        const siteName = ref('');
        const userStore = useUserInfoStore();
        const passwordType = ref('text');
        const confirmPasswordType = ref('text');

        const disabled = computed(() => !(email.value && password.value && confirmPassword.value));

        const goBack = () => {
            router.push({
                name: 'my',
                replace: true
            });
        }
        const handleClick = () => {
            router.push({
                name: 'login',
                replace: true,
                query: {
                    from: router.currentRoute.value.query?.from || '',
                }
            });
        };
        const handleRegister = async () => {
            try {
                const { from, id, current_episode_num } = router.currentRoute.value.query;
                const domain = import.meta.env.VITE_DOMAIN || (window.location.hostname ? window.location.hostname.replace(/www./g, '') : '');
                const res = await handleLoadingNew(
                    memberRegister({
                        user_name: email.value,
                        password: password.value,
                        repeat_password: confirmPassword.value,
                        episode_num: Number(current_episode_num) as number,
                        video_id: Number(id) as number,
                        domain,
                    })
                );
                userStore.setUserInfo(res?.data?.user_info || {});
                localStorage.setItem('UUID', res?.data?.user_info?.uuid || '');
                if (from === 'video') {
                    report({
                        eventId: '2',
                        customAttributes: {
                            vi: id,
                            ep: current_episode_num
                        }
                    })
                    router.back();
                    return;
                }
                report({
                    eventId: '2',
                    customAttributes: {}
                })
                router.push({
                    name: 'my',
                    replace: true,
                });
            } catch(err) {
                const m = err?.msg || ''
                showToast(m);
                report({
                    eventId: '5',
                    customAttributes: {
                        m,
                    }
                })
            }
        };
        const handleUser = () => {
            router.push({ name: 'serviceAgreement', query: {
                email: created_by_email.value,
                siteName: siteName.value
            } });
        };
        const handlePrivacy = () => {
            router.push({ name: 'privacyPolicy', query: {
                email: created_by_email.value,
                siteName: siteName.value
            } });
        };
        const handleFbSign = () => {
            console.warn('facebook登录')
        };

        const initPage = async () => {
            const res = await privacys({})
            console.warn(res, 'res1111')
            created_by_email.value = res?.data?.created_by_email || '';
            siteName.value = res?.data?.site_name || ''
        }
        const onFocus = (type: string) => {
            if (type === 'password') {
                passwordType.value = 'password';
            } else {
                confirmPasswordType.value = 'password';
            }
        };
        
        const onBlur = (type: string) => {
            if (type === 'password') {
                if (!password.value) {
                    passwordType.value = 'text';
                }
            } else {
                if (!confirmPassword.value) {
                    confirmPasswordType.value = 'text';
                }
            }
        };
    
        onMounted(async () => {
            initPage()
        })

        return () => <div class={s.register}>
            <div class='content'>
                <NavBar
                    title=""
                    left-arrow
                    right-text="Already A Member"
                    onClickLeft={ goBack }
                    onClickRight={ handleClick }
                />
                <div class="title">Register</div>
                {/* <div class="subTitle" onClick={ () => handleClick() }>Already A Member?</div> */}
                <Field
                    v-model={ email.value }
                    label="*Email"
                    placeholder="Please enter your email address"
                    label-align="top"
                    autocomplete="off"
                />
                <Field
                    v-model={ password.value }
                    type={ passwordType.value }
                    label="*Password"
                    placeholder="Please enter password"
                    label-align="top"
                    ref="passwordInput"
                    onFocus={ () => onFocus('password') }
                    onBlur={ () => onBlur('password') }
                    autocomplete="off"
                />
                <Field
                    v-model={ confirmPassword.value }
                    type={ confirmPasswordType.value }
                    label="*Repeat password"
                    placeholder="Please enter repeat password"
                    label-align="top"
                    onFocus={ () => onFocus('confirmPassword') }
                    onBlur={ () => onBlur('confirmPassword') }
                    autocomplete="off"
                />
                <div class="btn-logOut">
                    <Button plain type="primary" size="large" disabled={ disabled.value } onClick={ () => handleRegister() }>Register</Button>
                </div>
                <div class="line-box">
                    <span class="line-left"></span>
                    <span class="line-text">or</span>
                    <span class="line-right"></span>
                </div>
                <div class="btn-fbsign">
                    <FbButton></FbButton>
                </div>
                <div class="agreement">
                    By continuing, I agree to the <span class="protocol" onClick={ handleUser }>Service Agreement</span> and <span class="protocol" onClick={ handlePrivacy }>Privacy Policy</span>.
                </div>
            </div>
        </div>
    }
})