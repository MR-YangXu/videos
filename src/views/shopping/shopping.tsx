import { defineComponent, ref, computed, onMounted, watch, getCurrentInstance, nextTick } from 'vue';
import { Checkbox, Button, Image, Field, showToast, NavBar, Form } from 'vant';
import { useRouter } from 'vue-router';
import s from './style.module.less';
import HomeBg from '@/components/HomeBg';
import { createSubscribe, privacys, initSite } from '@/apis/common';
import { useUserInfoStore } from '@/store/modules/user';
import { fbTrack } from '@/utils/facebook.js';
import report from '@/utils/report';
import creditBg from '@/assets/images/movie/creditBg.png';
import mastercard from '@/assets/images/movie/mastercard.png';
import visa from '@/assets/images/movie/visa.png';
import { cardValidator, dateValidator, cvvValidator } from '@/utils/form/validator';
import { getCookie } from '@/utils/util';

// 注册页
export default defineComponent({
    setup() {
        const router = useRouter();
        const cardNum = ref('');
        const date = ref('');
        const cvv = ref('');
        const checked = ref(true);
        const firstName = ref('');
        const lastName = ref('');
        const created_by_email = ref('');
        const siteName = ref('');
        const videoId = ref('');
        const subscription_price = ref('');
        const period = ref('');
        const subscription_discount_price = ref('');
        const first_discount_price = ref('');
        const unlocked_episode = ref('');
        const errorMsg = ref('');
        const userInfo = useUserInfoStore();
        const { proxy } = getCurrentInstance();
        const form = ref<any>(null);
        const { type } = router.currentRoute.value.query;

        watch(() => date.value, (newVal, oldVal) => {
            let isReset = false;
            date.value = newVal.replace(
                /^(\d{1,2})(\d{1,2})?$/,
                (match, p1, p2) => {
                  if (p1.length === 2 && p2) {
                    isReset = true;
                    return `${p1}/${p2}`; // 假设输入是 MMYY
                  } else if (p1.length === 1) {
                    isReset = false;
                    return p1; // 只输入了一位数字，暂时不格式化
                  }
                  isReset = false;
                  return match;
                }
            );
            proxy.$refs.date.blur();
            nextTick(() => {
                proxy.$refs.date.focus();
            })
        })
        
        const disabled = computed(() => !(cardNum.value && date.value && cvv.value && firstName.value && lastName.value && checked.value))

        const goBack = () => {
            router.back();
        }
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
        const handleSubmit = debounce(async () => {
            try {
                const { from, id, current_episode_num, return_url, type } = router.currentRoute.value.query;
                const url = (return_url || '') as string;
                const utm_json = JSON.parse(getCookie('ga_utm')) || {};
                const res = await createSubscribe({
                    card_no: cardNum.value,
                    expire_date: date.value,
                    cvv: cvv.value,
                    first_name: firstName.value,
                    last_name: lastName.value,
                    video_id: videoId.value,
                    return_url: url.indexOf('?') > 0 ? url.split('?')[0] : url,
                    // 1=单包，2=周，3=月，4=年
                    subscribe_cycle_type: type,
                    // 广告id
                    utmct: utm_json.utm_content,
                })
                fbTrack({
                    eventName: 'Purchase',
                    customAttributes: {
                        content_ids: videoId.value || "default",
                        content_type: "product",
                        // // TODO: 待增加其他国家
                        currency: 'USD',
                        value: subscription_price.value,
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
                await userInfo.getUserInfos();
                // TODO: 待PWA一起上
                await localStorage.setItem('ANDROID_PAY_SUCCESS', 'Y');
                await localStorage.setItem('pay_success', '1');
                const redirect_url = res?.data?.redirect_url || '';
                if (redirect_url) {
                    window.location.href = redirect_url;
                    return;
                }
                showToast('Success');
                router.back();
            } catch(err) {
                // showToast(err?.msg || 'The system is busy, please try again later');
                errorMsg.value = err?.msg || 'The system is busy, please try again later';
            }
        }, 1000)

        const initPage = async () => {
            if (userInfo?.userInfo?.show_card_form === 0 || ['1'].includes(String(userInfo?.userInfo?.subscribe_status))) {
                router.push({ name: 'home' })
                return;
            }
            const res = await privacys({})
            console.warn(res, 'res1111')
            created_by_email.value = res?.data?.created_by_email || '';
            siteName.value = res?.data?.site_name || ''
        }
        const getSite = async () => {
            videoId.value = router.currentRoute.value.query?.id || '' as any;
            const site = await initSite();
            console.warn(site, '======');
            const subscribe_mode = site?.data?.subscribe_mode || {};
            if (String(type) === '2') {
                // 周
                subscription_price.value = subscribe_mode.subscribe_mode_week?.original_price;
                period.value = subscribe_mode.subscribe_mode_week?.period;
            } else if (String(type) === '3') {
                // 月
                subscription_price.value = subscribe_mode.subscribe_mode_month?.original_price;
                period.value = subscribe_mode.subscribe_mode_month?.period;
            } else if (String(type) === '4') {
                // 年
                subscription_price.value = subscribe_mode.subscribe_mode_year?.original_price;
                period.value = subscribe_mode.subscribe_mode_year?.period;
            }
            // subscription_price.value = site?.data?.subscription_price;
            unlocked_episode.value = site?.data?.unlocked_episode;
            // first_discount_price.value = (site?.data?.first_discount_price * 100 || '0') as string;
            // subscription_discount_price.value = ((site?.data?.subscription_price * site?.data?.first_discount_price).toFixed(2) || 0) as string;
            if (userInfo.userInfo?.show_discount_txt === 1) {
                first_discount_price.value = '0';
            }

            fbTrack({
                eventName: 'InitiateCheckout',
                customAttributes: {
                    content_ids: videoId.value || "default",
                    content_type: "product",
                    // TODO: 待增加其他国家
                    currency: 'USD',
                    value: subscription_price.value,
                    num_items: "1",
                }
            })
        }
        getSite()
    
        onMounted(async () => {
            initPage()
        })
        
        return () => <div class={s.shopping}>
            <div class='content'>
                <NavBar
                    title=""
                    left-arrow
                    onClickLeft={ goBack }
                />
                <div class="header">
                    <div class="header-left">
                        <div class="title">Set up your credit or debit card</div>
                        <div class="icon-box">
                            <Image width="8.54vw" height="5.4vw" src={ visa } alt="" />
                            <Image width="8.54vw" height="5.4vw" src={ mastercard } alt="" />
                        </div>
                    </div>
                    <div class="header-right">
                        <Image width="21.34vw" height="18.14vw" src={ creditBg } alt="" />
                    </div>
                </div>
                <Form ref={form} onSubmit={handleSubmit}>
                    {/* TODO: 待写校验规则 */}
                    <div class="creditCard-box">
                        <Field v-model={ cardNum.value } rules={[{ validator: cardValidator, message: 'Card number entered incorrectly' }]} 
                            maxlength="16" class="cardNum" label="" placeholder="Card number" />
                        <div class="item-box">
                            <Field ref="date" v-model={ date.value } rules={[{ validator: dateValidator, message: 'Date entered incorrectly' }]} maxlength="5" class="date" label="" placeholder="MM/YY" />
                            <Field v-model={ cvv.value } rules={[{ validator: cvvValidator, message: 'CVV filled in incorrectly' }]} class="cvv" maxlength="4" label="" placeholder="CVV" />
                        </div>
                        <div class="item-box">
                            <Field v-model={ firstName.value } class="date" label="" placeholder="FirstName" />
                            <Field v-model={ lastName.value } class="cvv" label="" placeholder="LastName" />
                        </div>
                    </div>
                    {/* <div class="amount-box">
                        <div class="amount-popup" v-show={ Number(first_discount_price.value) && Number(first_discount_price.value) !== 100 }>
                            { first_discount_price.value }% off First month
                        </div>
                        <div class="amount-main">
                            {
                                Number(first_discount_price.value) && Number(first_discount_price.value) !== 100 ?
                                <>
                                <div class="box-left">USD{ subscription_discount_price.value }/30days</div>
                                <div class="box-right">USD{ subscription_price.value }/30days</div>
                                </> :
                                <div class="box-left">USD{ subscription_price.value }/30days</div>
                            }
                        </div>
                        <div class="premium">Premium</div>
                        <div class="unlock-desc">(Unlock { unlocked_episode.value } movies in 30 days)</div>
                    </div> */}
                    <div class="desc" v-show={ String(type) !== '1' }>
                        we will automatically continue your membership and charge the membership fee (<span class="price-desc">currently USD { subscription_price.value }/{ period.value }days</span>) to your payment method until you cancel. You may cancel at any time to avoid future charges.
                    </div>
                    <Checkbox class="checkbox" v-model={ checked.value }>I agree.</Checkbox>
                    <div v-show={ errorMsg.value } class="error-msg">{ errorMsg.value }</div>
                    <div class="btn-logOut">
                        <Button type="primary" disabled={ disabled.value } size="large" native-type="submit">Pay Now</Button>
                    </div>
                </Form>
            </div>
        </div>
    }
})