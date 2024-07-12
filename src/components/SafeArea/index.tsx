import { defineComponent } from 'vue';
import s from './style.module.less';

export default defineComponent({
    props: {
        swipeLists: {
            type: Array,
            default: []
        },
    },
    setup(props, context) {
        return () => {
            const { slots } = context
            return <div class={s.safeArea}>
                { slots.default ? slots.default() : null }
            </div>
        }
    }
})