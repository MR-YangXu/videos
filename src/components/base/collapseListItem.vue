<template>
  <list-item
    class="collapse-list-item"
    :class="{ expanded: show, expanding: isExpanding }"
    v-bind="$attrs"
    padding="5px 5px 0 5px"
    @click="toggleBody(show)"
  >
    <div class="collapse-list-item-header">
      <div class="collapse-list-item-title">
        <slot name="title"></slot>
      </div>
      <div @click.stop="toggle(show)">
        <slot name="control" v-bind="show">
          <div class="collapse-list-item-control">
            <van-icon name="arrow-down" size="10" />
          </div>
        </slot>
      </div>
    </div>
    <div class="collapse-list-item-wrapper" ref="wrapper" @transitionend="onTransitionEnd">
      <div class="collapse-list-item-content" ref="content">
        <slot></slot>
      </div>
    </div>
  </list-item>
</template>

<script lang="ts">
  import { defineComponent, watch, ref, nextTick } from 'vue';
  import ListItem from '../base/listItem.vue';
  import { Icon, Checkbox } from 'vant';
  // import { useParent } from '@vant/use';

  export default defineComponent({
    name: 'CollapseListItem',
    components: {
      [Checkbox.name]: Checkbox,
      [Icon.name]: Icon,
      ListItem,
    },
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      toggleOnBody: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['change', 'update:modelValue'],
    setup: (props, { emit }) => {
      // const { parent, index } = useParent('List');
      const show = ref(props.modelValue);
      const wrapper = ref();
      const content = ref();
      const isExpanding = ref(show.value);

      function toggle(expand: boolean) {
        const { offsetHeight } = content.value;

        wrapper.value.style.height = expand ? '0' : offsetHeight + 'px';
        isExpanding.value = !expand;
      }

      watch(
        () => props.modelValue,
        (newVal, oldVal) => {
          if (newVal !== null) return;
          if (newVal === oldVal) return;

          nextTick(() => {
            toggle(newVal);
          });
        },
      );

      return {
        show,
        isExpanding,
        onTransitionEnd() {
          if (!wrapper.value.style.height) {
            console.error('missing wrapper height!');
          }
          show.value = wrapper.value.style.height !== '0px';
          emit('update:modelValue', show.value);
          emit('change', show.value);
        },
        wrapper,
        content,
        toggle,
        toggleBody: props.toggleOnBody ? toggle : () => {},
      };
    },
  });
</script>

<style lang="less" scoped>
  .collapse-list-item {
    &.expanded {
      .collapse-list-item-header {
        box-shadow: 0 4px 8px -8px rgba(0, 0, 0, 0.2);
      }
    }

    &.expanding {
      .collapse-list-item-control {
        font-size: 14px !important;
        transform: rotate(180deg);
        color: #ffffff;
        background-color: #3775ff;
      }
    }

    .collapse-list-item-header {
      display: flex;
      align-items: center;
      padding-bottom: 5px;

      .collapse-list-item-title {
        flex-grow: 1;
      }

      .collapse-list-item-control {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 19px;
        height: 19px;
        border: 1px solid #bdc5d7;
        border-radius: 50%;
        margin-left: 10px;
        transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out;
        will-change: transform;
        .van-icon-arrow-down {
          color: #bdc5d7;
          font-size: 14px !important;
        }
      }
    }

    .collapse-list-item-wrapper {
      height: 0;
      overflow: hidden;
      transition: height 0.3s ease-in-out;
      will-change: height;
    }

    .collapse-list-item-content {
      padding: 3px;
    }
  }
</style>
