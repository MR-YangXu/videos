import { defineComponent, onMounted, ref, computed } from 'vue';
import { Field, Button, NavBar } from 'vant';
import { useUserInfoStore } from '@/store/modules/user'
import { useRouter } from 'vue-router';
import s from './style.module.less';
import HomeBg from '@/components/HomeBg';
import { memberLogin, privacys } from '@/apis/common';
import { handleLoadingNew } from '@/utils/handleResponse';
import { showToast } from 'vant';
import FbButton from '@/components/FbButton';

// 登录页
export default defineComponent({
    setup() {
        const router = useRouter();
        const UserStore = useUserInfoStore()
        const email = ref('');
        const password = ref('');
        const created_by_email = ref('');
        const siteName = ref('');
        const passwordType = ref('text');

        const disabled = computed(() => !(email.value && password.value));

        const goBack = () => {
            router.push({
                name: 'my',
                replace: true
            });
        }
        const handleClick = () => {
            router.push({
                name: 'register',
                replace: true
            });
        };
        const handleLogin = async () => {
            try {
                const { from } = router.currentRoute.value.query;
                const domain = import.meta.env.VITE_DOMAIN || (window.location.hostname ? window.location.hostname.replace(/www./g, '') : '');
                const res = await handleLoadingNew(
                    memberLogin({
                        user_name: email.value,
                        password: password.value,
                        domain,
                    })
                );
                UserStore.setUserInfo(res?.data?.user_info || {});
                localStorage.setItem('UUID', res?.data?.user_info?.uuid || '')
                if (from === 'video') {
                    router.back();  
                    return;
                }
                router.push({
                    name: 'my',
                    replace: true,
                });
            } catch(err) {
                showToast(err?.msg || '');
            }
        };
        const handleRetrieve = () => {
            router.push({
                name: 'retrievePassword',
            });
        }
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

        const onFocus = () => {
            passwordType.value = 'password';
        };
        
        const onBlur = () => {
            if (!password.value) {
                passwordType.value = 'text';
            }
        };

        const initPage = async () => {
            const res = await privacys({})
            console.warn(res, 'res1111')
            created_by_email.value = res?.data?.created_by_email || '';
            siteName.value = res?.data?.site_name || ''
        }
    
        onMounted(async () => {
            initPage()
        })

        return () => <div class={s.login}>
            <div class='content'>
                <NavBar
                    title=""
                    left-arrow
                    right-text="No account"
                    onClickLeft={ goBack }
                    onClickRight={ handleClick }
                />
                <div class="title">Login</div>
                {/* <div class="subTitle" onClick={ () => handleClick() }>No account?</div> */}
                <Field
                    v-model={ email.value }
                    label="*Email"
                    placeholder="Please enter your email address"
                    label-align="top"
                    autocomplete="off"
                />
                <div class="password-box">
                    <Field
                        v-model={ password.value }
                        type={ passwordType.value }
                        label="*Password"
                        placeholder="Please enter password"
                        label-align="top"
                        ref="passwordInput"
                        onFocus={ () => onFocus() }
                        onBlur={ () => onBlur() }
                        autocomplete="off"
                    />
                    <div class="retrievePw" onClick={ () => handleRetrieve() }>Retrieve Password</div>
                </div>
                <div class="btn-logOut">
                    <Button plain type="primary" size="large" disabled={ disabled.value } onClick={ () => handleLogin() }>Sign in</Button>
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