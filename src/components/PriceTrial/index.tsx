import { defineComponent, reactive, watch } from 'vue';
import { Image, Collapse, CollapseItem, Field, CellGroup, Cell, Calendar, Button, Dialog, Icon, showToast } from 'vant';
import s from './style.module.less';
import TrialIcon from '@/assets/images/trial-icon.png';
import dayjs from 'dayjs';
import { discountTrial } from '@/apis/user';
import { useRouter, useRoute } from 'vue-router';


export default defineComponent({

    setup(props, context) {
        const router = useRouter();
        const route = useRoute();
        const pageData = reactive({
            active: [],
            trialType: ['商票试算', '银票试算'],
            trialTypeActive: '商票试算',
            faceAmount: '', //面额
            dueDate: '', //到期时间
            showCalendar: false,
            maxDate: dayjs().add(6, 'month').toDate(), //最大可选择日期
            showDialog: false,
            showResult: false,
            disInterest: '' as any, // 贴现利息（元）
            payAmount: '' as any, // 实付金额（元）
            disInterestRate: '' as any, // 贴现利率
            unitIntAmt: '' as any, // 10w扣款
            acceptingBank: '', // 承兑银行
        });

        const changeCalendar = (val) => {
            Object.assign(pageData, {
                dueDate: dayjs(val).format('YYYY-MM-DD'),
                showCalendar: false
            })
        }

        const handelPriceTrial = async () => {

            if (!pageData.faceAmount) {
                showToast('请输入票面面额');
                return;
            }

            if (!pageData.dueDate) {
                showToast('请选择到期时间')
                return;
            }
            const { faceAmount, dueDate } = pageData;
            const params = {
                faceAmount,
                dueDate: dayjs(dueDate).format('YYYY-MM-DD')
            }

            const pageName = route.path.substring(1)
            try {
                const res = await discountTrial(params, pageName)
                pageData.disInterest = res?.data?.disInterest;
                pageData.payAmount = res?.data?.payAmount;
                pageData.disInterestRate = res?.data?.disInterestRate;
                pageData.unitIntAmt = res?.data?.unitIntAmt;
                pageData.showResult = true
            } catch (error) {
                console.log(error);

            }

        }
        const handleTrialTypeActive = (item) => {
            pageData.trialTypeActive = item;
            if (pageData.trialTypeActive === '商票试算') {
                // TODO: 需要增加默认值赋值
                pageData.faceAmount = '100000';
                pageData.dueDate = '2024-02-26';
            } else {
                // TODO: 需要增加默认值赋值
                pageData.faceAmount = '50000';
                pageData.dueDate = '2024-02-26';
            }
            pageData.showResult = false;
        }

        const formatNumber = () => {
            // 两位小数，不允许负数，不允许0在前面
            let newVal = pageData.faceAmount
            if (!newVal) return '';
            if (newVal.indexOf('.') > -1) {
                //保留两位小数
                const [val1, val2] = newVal.split('.')
                newVal = `${val1}.${val2.substring(0, 2)}`
            }
            newVal = String(Number(newVal));
            newVal = newVal.replace(/-/g, '');
            return newVal === '0' ? '' : newVal
        }

        const handleAllQuotation = () => {
            router.push({ name: 'quotation' });
        }

        const handleAcceptingBank = () => {
            router.push({ name: 'acceptingBank' });
        }

        const initPage = () => {
            pageData.acceptingBank = sessionStorage.getItem('session_acceptingBank') || '';
            sessionStorage.setItem('session_acceptingBank', '');
        }
        initPage();
        
        return () => <div class={s.priceTrial}>
            {/* <Collapse v-model={pageData.active}>
                <CollapseItem name="1" v-slots={{
                    title: () => <div class='title'>
                        <Image src={TrialIcon} width='16px' height='16px' />
                        价格试算
                    </div>
                }}> */}
                <div class="trial-box">
                    <div class='tab-box'>
                        <div class='tab'>
                            {
                                pageData.trialType.map(item => <span class={pageData.trialTypeActive === item ? 'active' : ''} onClick={() => handleTrialTypeActive(item)}>{item}</span>)
                            }
                        </div>
                        <div class="tab-box-right" onClick={() => handleAllQuotation()}>
                            查看全部报价
                        </div>
                    </div>
                    <CellGroup>
                        <Field
                            v-model={pageData.faceAmount}
                            label="票面面额"
                            placeholder="请输入票面金额"
                            input-align="right"
                            type='number'
                            maxlength={11}
                            v-slots={{
                                button: () => <span style='color: #333'>元</span>
                            }}
                            formatter={formatNumber}
                            format-trigger="onBlur"
                        />
                        {
                            pageData.trialTypeActive === '银票试算' &&
                             <Cell title="承兑银行" class={pageData.acceptingBank ? 'c333' : ''} value={pageData.acceptingBank || '请选择承兑银行'} is-link onClick={() => handleAcceptingBank()} />
                        }
                        <Cell title="到期时间" class={pageData.dueDate ? 'c333' : ''} value={pageData.dueDate || '请选择日期'} is-link onClick={() => pageData.showCalendar = true} />
                    </CellGroup>
                    {
                        pageData.showResult &&
                        (
                            <>
                                <div class='amount-content'>
                                    <div class='item'>
                                        <span class='title'>实收金额(元)</span>
                                        <span class='value'>{pageData.payAmount || '--'}</span>
                                    </div>
                                    <div class='item'>
                                        <span class='title'>贴现利息(元)</span>
                                        <span class='value'>{pageData.disInterest || '--'}</span>
                                    </div>
                                    <div class='item'>
                                        <span class='title'>贴现利率</span>
                                        <span class='value highlight'>{pageData.disInterestRate || '--'}%</span>
                                    </div>
                                </div>
                                <p class='sub-text'>相当于每10万元扣款{pageData.unitIntAmt}元</p>
                                <div class='desc'>
                                    最终贴现利率以您申请贴现额度后查询的结果为准
                                </div>
                            </>
                        )
                    }
                    <div class="btn-box">
                        <Button round block type="primary" onClick={handelPriceTrial}>试算</Button>
                    </div>
                    <div class='tip'>
                        商票贴现
                    </div>
                </div>
                {/* </CollapseItem>
            </Collapse> */}
            <Calendar v-model={[pageData.showCalendar, 'show']} maxDate={pageData.maxDate} onConfirm={changeCalendar} />
            <Dialog class='price-trial-dialog' v-model={[pageData.showDialog, 'show']} showConfirmButton={false}>
                <div class='content'>
                    <div class='item'>
                        <div>
                            <span class='title'>贴现利率</span>
                            <span class='value highlight'>{pageData.disInterestRate}%</span>
                        </div>
                        <p class='sub-text'>相当于每10万元扣款{pageData.unitIntAmt}元</p>
                    </div>
                    <div class='item'>
                        <span class='title'>贴现利息(元)</span>
                        <span class='value'>{pageData.disInterest}</span>
                    </div>
                    <div class='item'>
                        <span class='title'>实付金额(元)</span>
                        <span class='value'>{pageData.payAmount}</span>
                    </div>
                </div>
                <div class='tip'>
                    <Icon name="info-o" size={14} color='#1D1D26' />
                    最终贴现利率以您申请贴现额度后查询的结果为准
                </div>
                <div class='btn-box'>
                    <Button round block type="primary" onClick={() => pageData.showDialog = false}>我知道了</Button>
                </div>
            </Dialog>
        </div>
    }
})