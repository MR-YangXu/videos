import { defineComponent, reactive, ref } from 'vue'
import { showToast } from 'vant'
import s from './style.module.less'
import HomeBg from '@/components/HomeBg'
import SwiperList from '@/components/SwiperList'
import HomeItem from '@/components/HomeItem'
import ProtocolList from '@/components/ProtocolList'
import { bannerList, homeRecommend } from '@/apis/common'
import { handleLoadingNew } from '@/utils/handleResponse'
import { useRouter } from 'vue-router'

// 注册页
export default defineComponent({
  setup() {
    // const contentList = reactive([
    //     { type: 'must-sees', title: 'Must-sees' },
    //     { type: 'trending', title: 'Trending' },
    //     { type: 'hidden-gems', title: 'Hidden-gems' },
    // ]);
    const isFinite = ref(false)
    const contentList = reactive([])
    const swipeLists = reactive([])
    const router = useRouter()

    const initPage = async () => {
      try {
        swipeLists.splice(0)
        contentList.splice(0)
        const arr = [bannerList({ isClient: false }), homeRecommend({ lang_id: 1, page_size: 6, isClient: false })]
        const res = await handleLoadingNew(
          Promise.all(arr),
        )
        let swiperList = res?.[0]?.data?.list || []
        const recommendList = res?.[1]?.data?.list || []
        swiperList = swiperList.map(item => {
          if (item.cover.indexOf('?') === -1) {
            item.cover = item.cover + '?x-oss-process=image/resize,w_300/quality,q_85'
          }
          return item
        })
        swipeLists.push(...swiperList)
        contentList.push(...recommendList)
        isFinite.value = true
        if (router.currentRoute.value.query.xtoken) {
          router.push({
            name: 'home',
            replace: true,
          })
        }
      }
      catch (err) {
        showToast(err?.msg || '')
      }
    }
    initPage()

    return () => (
      <div class={s.home}>
        <HomeBg
          active="0"
          v-slots={{
            default: () => (
              <div class="content" v-show={isFinite.value}>
                <SwiperList swipeLists={swipeLists} />
                {
                  contentList.map(item => <HomeItem currentItem={item} rows={true} />)
                }
                <>
                  <ProtocolList />
                </>
              </div>
            ),
          }}
        />
      </div>
    )
  },
})
