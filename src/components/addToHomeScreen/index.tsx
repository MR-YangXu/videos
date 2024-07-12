import { defineComponent, onMounted, computed } from 'vue';
import { Button, Overlay } from 'vant';
import s from './style.module.less';
import browser from '@/assets/images/movie/browser.png';
import setting from '@/assets/images/movie/setting.png';
import addBlack from '@/assets/images/movie/addBlack.png';
import addRed from '@/assets/images/movie/addRed.png';

export default defineComponent({
    props: {
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
        const handleClose = () => {
            isVisible.value = false;
        }

        const isVisible = computed({
            get() {
                return props.modelValue;
            },
            set(value) {
                emit('update:modelValue', value);
            }
        })

        const initPage = async () => {
            
        }

        onMounted(() => {
            initPage();
        });

        return () => {
            return <div class={s.addToHomeScreen}>
                <Overlay
                    class="addHomePopup"
                    show={ isVisible.value }
                >
                    <div class="popup-content">
                        <div class="title">Follow the instructions below to add the website to your home screen and open it at any time, as conveniently as an app!</div>
                        <div class="subTitle">
                            <div class="left">
                                <img src={ browser } alt="" />
                            </div>
                            <div class="right">1. Click the upper left corner and find <span>[Open with external browser]</span> in the menu</div>
                        </div>
                        <div class="subTitle">
                            <div class="left">
                                <img src={ setting } alt="" />
                            </div>
                            <div class="right">2. After jumping to the default browser, click <span>[Settings]</span></div>
                        </div>
                        <div class="subTitle">
                            <div class="left">
                                <img src={ addBlack } alt="" />
                            </div>
                            <div class="right">3. Find <span>[Add to Desktop]</span> or [Add to Home Screen] and click it.</div>
                        </div>
                        <div class="btn-box">
                            <Button onClick={ () => handleClose() } type="primary" size="large">
                                <img src={ addRed } alt="" />
                                <span>Go to add</span>
                            </Button>
                        </div>
                    </div>
                </Overlay>
            </div>
        }
    }
})