<template>
  <ec-popover
    v-bind="{
      placement: 'bottom-end',
      distance: 10,
      ...popoverOptions,
    }"
  >
    <slot />
    <template #popper>
      <div
        class="ec-inline-actions"
        data-test="ec-inline-actions"
      >
        <template
          v-for="(list, index) in items"
          :key="`${index}__list`"
        >
          <ul data-test="ec-inline-actions__list">
            <li
              v-for="(item, indexList) in list"
              :key="item.text"
              v-ec-tooltip.left="item.tooltip"
              class="ec-inline-actions__item"
              :data-test="`ec-inline-actions__item ec-inline-actions__item--${index}-${indexList}`"
            >
              <component
                :is="componentTag(item)"
                v-ec-close-popover="!item.disabled"
                class="ec-inline-actions__button"
                data-test="ec-inline-actions__button"
                :class="{ 'ec-inline-actions__button--disabled': item.disabled }"
                :disabled="getDisabledAttr(item)"
                :href="getHrefAttr(item)"
                :download="getDownloadAttr(item)"
                @click="doAction(item)"
              >
                <slot
                  :name="`item-${item.name}`"
                  :item="item"
                >
                  <ec-icon
                    v-if="item.icon"
                    :name="item.icon"
                    :size="24"
                    :type="item.iconType ? item.iconType : null"
                    class="ec-inline-actions__icon"
                    data-test="ec-inline-actions__icon"
                    :class="{ 'ec-inline-actions__icon--no-type': !item.iconType || item.disabled }"
                  />
                  <span>{{ item.text }}</span>
                </slot>
              </component>
            </li>
          </ul>
          <hr
            :key="`${index}__delimiter`"
            v-if="items.length !== index + 1"
            class="ec-inline-actions__delimiter"
            data-test="ec-inline-actions__delimiter"
          >
        </template>
      </div>
    </template>
  </ec-popover>
</template>

<script setup>
import VEcClosePopover from '../../directives/ec-close-popover';
import VEcTooltip from '../../directives/ec-tooltip';
import EcIcon from '../ec-icon';
import EcPopover from '../ec-popover';

defineProps({
  items: {
    type: Array,
    required: true,
  },
  popoverOptions: {
    type: Object,
  },
});

function doAction(item) {
  return (item.action && !item.disabled) && item.action();
}

function componentTag(item) {
  if (item.href) {
    return 'a';
  }
  return 'button';
}

function getDownloadAttr(item) {
  if (item.disabled) {
    return null;
  }
  if (!!item.href && !!item.download) {
    return item.download;
  }
  if (!!item.href && item.download === '') {
    return '';
  }
  return null;
}

function getHrefAttr(item) {
  return item.href && !item.disabled ? item.href : null;
}

function getDisabledAttr(item) {
  return !item.href ? item.disabled : null;
}
</script>

<style>
.ec-inline-actions {
  @apply tw-m-0;
  @apply tw-p-0;

  min-width: 160px;
  max-width: 320px;

  &__item {
    @apply tw-list-none;
    @apply tw-w-full;
  }

  &__button {
    @apply tw-text-left tw-text-gray-3 tw-btn-text;
    @apply tw-w-full;
    @apply tw-bg-gray-8;
    @apply tw-border-none;
    @apply tw-cursor-pointer;
    @apply tw-py-8 tw-px-16;
    @apply tw-flex tw-items-center;

    &:hover {
      @apply tw-bg-gray-7;
      @apply tw-no-underline;
    }

    &--disabled {
      @apply tw-text-gray-6;
      @apply tw-cursor-auto;

      &:hover {
        @apply tw-bg-gray-8;
      }
    }
  }

  &__delimiter {
    @apply tw-border-none;
    @apply tw-m-0;
    @apply tw-border-t tw-border-solid tw-border-gray-6;
  }

  &__icon {
    @apply tw-mr-8;
    @apply tw-flex-shrink-0;

    &--no-type {
      @apply tw-fill-current;
    }
  }
}
</style>
