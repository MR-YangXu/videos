import { defineComponent, reactive, ref, onMounted } from 'vue';
import { Form, Field, Button, Checkbox, showDialog, showToast } from 'vant';
import s from './style.module.less';
import { telValidator } from '@/utils/form/validator';
import { debounce } from 'lodash-es';
import { getTelSms, userRegister } from '@/apis/login';
import { getProtocol, agreementSign } from '@/apis/common';
import { userWXStore, useUserInfoStore } from '@/store';
import { ProtocolOutEntity } from '@/apis/model/login.model';
import Protocol from '@/components/protocol/viewer.vue';
import { getStep } from '@/apis/user';
import router from '@/router';
import Checked from '@/assets/icons/checked.png';
import Unchecked from '@/assets/icons/unchecked.png';

let timer = null as any
export default defineComponent({
    setup(props) {
        const { code, openId } = userWXStore();
        const { setUserInfo } = useUserInfoStore();
        const form = ref<any>(null);

        const pageData = reactive({
            form: {
                mobile: '',
                smsCode: '',
                agreement: false,
            },
            smsBtnDisabled: false,
            smsBtnText: '获取验证码',
            countDown: 60,
            verifyId: '' as any,
        })

        const protocolOptions = reactive({
            show: false,
            list: [] as ProtocolOutEntity[] | null,
            active: -1,
            confirm: false,
            signList: [] as ProtocolOutEntity[] | null,
            openProtocol(index: number) {
              protocolOptions.active = index;
              protocolOptions.show = true;
            },
            confirmProtocol(item) {
            //   protocolOptions.signList = item;
              protocolOptions.confirm = true;
              pageData.form.agreement = true;
            },
          });

        const getSms = debounce(() => {
            form.value?.validate('mobile').then(async () => {
                
            try {
                if (timer) {
                    return;
                };
                const res = await getTelSms({
                    type: 'registry',
                    mobileNo: pageData.form.mobile,
                    code,
                    openId
                })

                if (res?.flag !== 'S') {
                    showDialog({
                        message: res?.msg
                    })
                    return;
                }

                // 验证码订单id
                pageData.verifyId = res?.data?.verifyId
                pageData.countDown = 60; // 重置
                pageData.smsBtnDisabled = true;
                timer = setInterval(() => {
                    if (pageData.countDown === 1) {
                        pageData.smsBtnText = '重新发送';
                        pageData.smsBtnDisabled = false;
                        timer && clearInterval(timer);
                        timer = null; // 定时器id可能没有被清除
                    } else {
                        pageData.countDown--;
                        pageData.smsBtnText = `${pageData.countDown < 10 ? `0${pageData.countDown}` : pageData.countDown}s`;
                    }
                }, 1000);
            } catch (error) {
                console.log(error);
            }
            })
        }, 300);

        const renderDialogMsg = (msg) => {
            return <div class={s.dialogContent}>
                <p class='msg'>{msg}</p>
                <p class='tip'>如有疑问，请联系客服：<a href='tel:4006360360'>4006-360-360</a></p>
            </div>
        }


        const queryProtocol = async () => {
            const res = await getProtocol({
                flowType: '0'
            });
            console.log(res);
            protocolOptions.list = res as any;
        }

        const submit = async () => {
            
            const { verifyId, form: { mobile, smsCode } } = pageData
            const userInfo = await userRegister({
                inputSmsCode: smsCode,
                verifyId: verifyId,
                code,
                openId,
                mobileNo: mobile,
                templateList: protocolOptions.list
            })

            if (userInfo?.flag !== 'S') {
                if(userInfo?.code === 'B_KCMS_2911') {
                    showDialog({ message: () => renderDialogMsg(userInfo?.msg), confirmButtonText: '我知道了' });
                }else {
                    showToast(userInfo?.msg)
                } 
            } else {
                // 跳转法人认证
                if(!userInfo.data?.token) {
                    showDialog({ message: '系统异常', confirmButtonText: '我知道了' });
                    return;
                }
                // 更新用户信息
                setUserInfo(userInfo?.data || {})
                const stepRes = await getStep();
                if (stepRes?.flag === 'S') {
                    const name = stepRes.data?.routePage as any
                    const { mobileNo, certNo, certName, cardNo, bankMobileNo } = stepRes.data || {}
                    name && router.replace({
                        name,
                        query: name === 'idCardCert' ? {
                            mobileNo,
                            certNo,
                            certName,
                            cardNo,
                            bankMobileNo
                        } : {}
                    })
                }
            }
        }
        
        onMounted(() => {
            queryProtocol()
        })


        return () => <div class={s.form}>
            <Form ref={form} onSubmit={submit}>
                <Field
                    v-model={pageData.form.mobile}
                    name="mobile"
                    label="手机号"
                    type='digit'
                    maxlength={11}
                    placeholder="请填写企业法人手机号"
                    rules={[
                        { required: true, message: '请填写企业法人手机号' },
                        { validator: telValidator, message: '请输入正确的手机号' }
                    ]}
                />
                <Field
                    v-model={pageData.form.smsCode}
                    name="code"
                    label="验证码"
                    type='digit'
                    maxlength={6}
                    placeholder="请填写验证码"
                    rules={[
                        { required: true, message: '请填写验证码' },
                        { validator: () => !!pageData.verifyId, message: '请先获取验证码' }
                    ]}
                    v-slots={{
                        button: () => <Button class='sms-btn' size="small" onClick={getSms} disabled={pageData.smsBtnDisabled}>{pageData.smsBtnText}</Button>
                    }}
                />
                <Field 
                    class='agreement-box' 
                    name="checkbox"  
                    rules={[{ required: true, message: '请先阅读该协议并勾选确认' }]} 
                    v-slots={{
                                input: () => <Checkbox class='agreement' v-model={pageData.form.agreement} shape="square" icon-size="16px" v-slots={{icon: () => <img class="img-icon" src={pageData.form.agreement ? Checked : Unchecked} />}}  >
                                我同意
                                {
                                     protocolOptions.list && protocolOptions.list.map((item, index) => <span onClick={(e) => {
                                        e.stopPropagation();
                                        protocolOptions.openProtocol(index)
                                    }}>《{item.templateName}》</span>)
                                } 
                            </Checkbox>
                            }} 
                />

                <div style="margin: 0 16px;">
                    <Button class='submit-btn' round block type="primary" native-type="submit">
                        查看额度
                    </Button>
                </div>
            </Form>
            <Protocol 
               v-model:protocolShow={protocolOptions.show}
               v-model:active={protocolOptions.active}
               protocols={protocolOptions.list}
               onConfirm={protocolOptions.confirmProtocol}/>
        </div >
    }
})