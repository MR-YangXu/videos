import { PropType, defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import s from './style.module.less'
import { privacys } from '@/apis/common'

export default defineComponent({
  setup() {
    const router = useRouter()
    const siteName = ref(null)
    const email = ref(null)

    const handleUser = () => {
      router.push({name: 'serviceAgreement', query: {
        email: email.value,
        siteName: siteName.value
      }})
    }
    const handlePrivacy = () => {
      router.push({name: 'privacyPolicy', query: {
        email: email.value,
        siteName: siteName.value
      }})
    }
    const initPage = async () => {
      const res = await privacys({})
      console.warn(res, 'res1111')
      email.value = res?.data?.created_by_email || '';
      siteName.value = res?.data?.site_name || ''
    }

    onMounted(async () => {
      initPage()
    })
    return () => {
      return (
        <div class={s.protocolList}>
          {
            // 非审核状态才有
            <div class="footer-wrap">
              <div class="footer-content">
                <div class="footer-community">
                  <div class="communityItem" onClick={handlePrivacy}>Privacy Policy</div>
                  <div class="communityItem" onClick={handleUser}>Terms of Use</div>
                </div>
                <div class="footer-fText">
                  ©
                  {' '}
                  { siteName.value }
                  , All Rights Reserved { siteName.value && siteName.value.toUpperCase() } PTE.LTD.
                </div>
              </div>
            </div>
          }
        </div>
      )
    }
  },
})
