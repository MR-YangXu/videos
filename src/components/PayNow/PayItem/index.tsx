import { defineComponent, PropType, onMounted, ref, reactive, computed } from 'vue';
import { Button, Popup } from 'vant';
import s from './style.module.less';
import lockIcon from '@/assets/images/movie/lockIcon.png';
import { useUserInfoStore } from '@/store/modules/user'
import { useRouter } from 'vue-router';

export default defineComponent({
    props: {
        modelValue: {   // 使用modelValue作为v-model的默认属性名
            type: Boolean,
            default: false
        },
        currentItem: {
            type: Object,
            default: () => ({})
        },
        currentIndex: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Number,
            default: 0
        },
        episodes_name: {
            type: String,
            default: ''
        },
    },
    emits: ['click'], // 声明事件，用于更新v-model的值
    setup(props, { emit }) {
        const router = useRouter();
        const UserStore = useUserInfoStore()
        const userInfo = ref({});
        const showBottom = ref(false);

        const handleClick = () => {
            emit('click');
        }

        onMounted(() => {
            
        });

        return () => {
            return <div class={s.payItem} onClick={ () => handleClick() }>
                {
                    props.currentItem.period === 0 ?
                    <div class={ props.currentIndex === props.isActive ? 'isActive pay-item-box' : 'pay-item-box' }>
                        <div class="pay-item-left">
                            <div class="left-total-price">
                                <span>$</span>{ props.currentItem.price }
                            </div>
                        </div>
                        <div class="pay-item-right">
                            <div class="right-title">Unlock full episodes</div>
                            <div class="right-desc">{ props.episodes_name }</div>
                        </div>
                        <div class="amount-popup">Exclusive for new users</div>
                    </div> :
                    <div class={ props.currentIndex === props.isActive ? 'isActive pay-item-box' : 'pay-item-box' }>
                        <div class="pay-item-left">
                            <div class="left-total-price">
                                <span>$</span>{ props.currentItem.price }
                            </div>
                            <div class="left-day-price">
                                ${ props.currentItem.price_avg }/day
                            </div>
                        </div>
                        <div class="pay-item-right">
                            <div class="right-title">{ props.currentItem.mode_name }<span>（Unlock all series for { props.currentItem.period } days）</span></div>
                            <div class="right-desc">Auto renewal - Cancel anytime</div>
                        </div>
                        <div class="amount-popup" v-show={ props.currentItem.subscribe_month_discount && String(UserStore.userInfo?.show_discount_txt) === '1' }>{ props.currentItem.subscribe_month_discount * 100}% off first month</div>
                    </div>
                }
            </div>
        }
    }
})