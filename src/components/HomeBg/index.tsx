import { defineComponent, ref, reactive } from 'vue';
import { Image, Popover } from 'vant';
import s from './style.module.less';
import language from '@/assets/images/movie/language.webp';
import user from '@/assets/images/movie/user.png';
import { useRouter } from 'vue-router';


export default defineComponent({
    props: {
        active: {
            type: String,
            default: ''
        }
    },
    setup(props, context) {
        const router = useRouter();
        const { slots } = context;
        const active = ref(props.active);
        const currentLanguage = ref('EN');
        const actions = reactive([
            { text: 'English', language: 'EN', value: '1' },
            { text: 'Português', language: 'POR', value: '2' },
            { text: 'español', language: 'ESP', value: '3' },
            { text: 'Français', language: 'FRA', value: '4' },         
        ]);
        const showPopover = ref(false);

        const handleToggle = value => {
            if (value === '0') {
                router.push({
                    name: 'home'
                })
            } else {
                router.push({
                    name: 'browse',
                    params: { id: '0' },
                    query: { tag: 'All' }
                })
            }
        };
        const toggleLanguage = (language, value) => {
            currentLanguage.value = language;
            showPopover.value = false;
            sessionStorage.setItem('LANGID', value);
        };
        const goUser = () => {
            router.push({
                name: 'my',
            })
        };
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredPrompt = event;
        });

        function showAddToHomeScreenPrompt() {
            // 显示自定义的提示信息
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }
                    deferredPrompt = null;
                });
            }
        }

        return () => <div class={s.homeBg}>
            <div class="home-header-box">
                <div class="header-box-navMenu">
                    <div class={ `header-box-navItem ${ active.value === '0' ? 'active' : '' }` } onClick={ () => handleToggle('0') }>
                        Recommend
                    </div>
                    <div class={ `header-box-navItem ${ active.value === '1' ? 'active' : '' }` } onClick={ () => handleToggle('1') }>
                        Browse
                    </div>
                </div>
                <div class="hader-box-language">
                    <div class="language-box">
                        <div class="language-popover">
                            <Image onClick={ showAddToHomeScreenPrompt } width="4.27vw" height="4.27vw" src={ language } alt="" />
                            <span>{ currentLanguage.value }</span>
                        </div>
                        {/* <Popover class="language-popover" v-model:show={ showPopover.value } v-slots={{
                            reference: () => <>
                                <Image width="4.27vw" height="4.27vw" src={ language } alt="" />
                                <span>{ currentLanguage.value }</span>
                            </>,
                            default: () => actions.map(item => <>
                                <div class="action-box" onClick={ () => toggleLanguage(item.language, item.value) }>
                                    <div class={`action-box-text ${currentLanguage.value === item.language && 'active'}`}>{ item.text }</div>
                                </div>
                            </>)
                        }}>
                        </Popover> */}
                    </div>
                    <Image onClick={ goUser } width="5.4vw" height="5.4vw" src={ user } alt="" />
                </div>
            </div>
            <div class='bottom'>
            { slots.default ? slots.default() : null }
            </div>
        </div>
    }
})