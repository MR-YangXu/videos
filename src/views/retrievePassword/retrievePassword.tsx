import { defineComponent, onMounted, ref, computed, reactive } from 'vue';
import { Field, Button, Image, NavBar } from 'vant';
import { useRouter } from 'vue-router';
import s from './style.module.less';
import HomeBg from '@/components/HomeBg';
import { resetPassword, privacys, getVerificationCode } from '@/apis/common';
import { handleLoadingNew } from '@/utils/handleResponse';
import { showToast, Form } from 'vant';
import { useUserInfoStore } from '@/store/modules/user';
import report from '@/utils/report';
import { debounce } from '@/utils/util';
import retrievePg from '@/assets/images/movie/retrievePg.png';

let timer = null as any
// 登录页
export default defineComponent({
    setup() {
        const router = useRouter();
        const created_by_email = ref('');
        const siteName = ref('');
        const userStore = useUserInfoStore();
        const form = ref<any>(null);
        const pageData = reactive({
            form: {
                email: '',
                smsCode: '',
                password: '',
                confirmPassword: '',
            },
            smsBtnDisabled: false,
            smsBtnText: 'Send Code',
            countDown: 60,
            verifyId: '' as any,
        })
        const passwordType = ref('text');
        const confirmPasswordType = ref('text');
        const disabled = computed(() => !(pageData.form.email && pageData.form.smsCode && pageData.form.password && pageData.form.confirmPassword));

        const handleConfirm = async () => {
            try {
                await handleLoadingNew(
                    resetPassword({
                        user_name: pageData.form.email,
                        code: pageData.form.smsCode,
                        new_password: pageData.form.password,
                        confirm_password: pageData.form.confirmPassword,
                    })
                );
                // if (from === 'video') {
                //     report({
                //         eventId: '2',
                //         customAttributes: {
                //             vi: id,
                //             ep: current_episode_num
                //         }
                //     })
                //     router.back();
                //     return;
                // }
                // report({
                //     eventId: '2',
                //     customAttributes: {}
                // })
                router.push({
                    name: 'my',
                    replace: true,
                });
            } catch(err) {
                const m = err?.msg || ''
                showToast(m);
            }
        };
        const handleUser = () => {
            router.push({ name: 'serviceAgreement', query: {
                email: created_by_email.value,
                siteName: siteName.value
            } });
        };
        const goBack = () => {
            router.back();
        }
        const handlePrivacy = () => {
            router.push({ name: 'privacyPolicy', query: {
                email: created_by_email.value,
                siteName: siteName.value
            } });
        };
        // const handleFbSign = () => {
        //     console.warn('facebook登录')
        // };

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
                if (!pageData.form.password) {
                    passwordType.value = 'text';
                }
            } else {
                if (!pageData.form.confirmPassword) {
                    confirmPasswordType.value = 'text';
                }
            }
        };
        const getSms = debounce(() => {
            console.warn(form.value, 'form.value====')
            form.value?.validate('email').then(async () => {
                
            try {
                if (timer) {
                    return;
                };
                const domain = import.meta.env.VITE_DOMAIN || (window.location.hostname ? window.location.hostname.replace(/www./g, '') : '');
                const res = await getVerificationCode({
                    user_name: pageData.form.email,
                    domain,
                });
                console.warn(res, 'res=======');

                // 验证码订单id
                pageData.verifyId = res?.data?.verifyId
                pageData.countDown = 60; // 重置
                pageData.smsBtnDisabled = true;
                timer = setInterval(() => {
                    if (pageData.countDown === 1) {
                        pageData.smsBtnText = 'Send Code';
                        pageData.smsBtnDisabled = false;
                        timer && clearInterval(timer);
                        timer = null; // 定时器id可能没有被清除
                    } else {
                        pageData.countDown--;
                        pageData.smsBtnText = `${pageData.countDown < 10 ? `0${pageData.countDown}` : pageData.countDown}s`;
                    }
                }, 1000);
            } catch (error: any) {
                showToast(error?.msg || '');
            }
            })
        }, 300);
    
        onMounted(async () => {
            initPage()
        })

        return () => <div class={s.retrievePassword}>
            <div class='content'>
                <NavBar
                    title=""
                    left-arrow
                    onClickLeft={ goBack }
                />
                <div class="retrievePg">
                    <Image width="21.3333vw" height="20vw" src={ retrievePg } alt="" />
                </div>
                <div class="title">Retrieve Password</div>
                <Form ref={form} onSubmit={handleConfirm}>
                    <Field
                        v-model={ pageData.form.email }
                        name="email"
                        label="*Email"
                        placeholder="Please enter your email address"
                        label-align="top"
                        autocomplete="off"
                    />
                    {/* rules={[
                            { required: true, message: '请填写验证码' },
                            { validator: () => !!pageData.verifyId, message: '请先获取验证码' }
                        ]} */}
                    <Field
                        v-model={ pageData.form.smsCode }
                        name="code"
                        class="smsCode"
                        label="*Verification code"
                        type='digit'
                        maxlength={6}
                        placeholder="Please enter Verification code"
                        label-align="top"
                        v-slots={{
                            button: () => <Button class='sms-btn' size="small" onClick={getSms} disabled={pageData.smsBtnDisabled}>{pageData.smsBtnText}</Button>
                        }}
                    />
                    <Field
                        v-model={ pageData.form.password }
                        type={ passwordType.value }
                        label="*New Password"
                        placeholder="Please enter new password"
                        label-align="top"
                        ref="passwordInput"
                        onFocus={ () => onFocus('password') }
                        onBlur={ () => onBlur('password') }
                        autocomplete="off"
                    />
                    <Field
                        v-model={ pageData.form.confirmPassword }
                        type={ confirmPasswordType.value }
                        label="*Repeat password"
                        placeholder="Please enter repeat password"
                        label-align="top"
                        onFocus={ () => onFocus('confirmPassword') }
                        onBlur={ () => onBlur('confirmPassword') }
                        autocomplete="off"
                    />
                    <div class="btn-logOut">
                        <Button plain type="primary" size="large" disabled={ disabled.value } onClick={ () => handleConfirm() }>Confirm</Button>
                    </div>
                    {/* <div class="btn-fbsign">
                        <Button onClick={ () => handleFbSign() } type="primary" size="large">Sign in with Facebook</Button>
                    </div> */}
                    <div class="agreement">
                        By continuing, I agree to the <span class="protocol" onClick={ handleUser }>Service Agreement</span> and <span class="protocol" onClick={ handlePrivacy }>Privacy Policy</span>.
                    </div>
                </Form>
            </div>
        </div>
    }
})