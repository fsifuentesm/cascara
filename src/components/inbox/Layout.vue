<template>
  <div
    class="container-fluid p-0"
    style="max-width: 1270px;"
  >
    <div class="row no-gutters"
      v-if="!showRight"
    >
      <div class="col">
        <slot name="top">
        </slot>
      </div>
    </div>

    <div class="row no-gutters">
      <div v-if="showLeft"
        :class="{
          'col-2': showRight,
          'col-3': !showRight,
          'pr-2': showCenter,
        }"
      >
        <slot name="left">
        </slot>
      </div>

      <div v-if="showCenter"
        :class="{
          'col-3': showLeft && showRight,
          'col-4': !showLeft && showRight,
          'col-9': showLeft && !showRight,
          'col-12': !showLeft && !showRight,
          'pl-2': showLeft,
          'pr-2': showRight,
        }"
      >
        <slot name="center">
        </slot>
      </div>

      <div v-if="showRight"
        :class="{
          'col-7': showLeft && showCenter,
          'col-8': !showLeft && showCenter,
          'col-12': !showLeft && !showCenter,
          'pl-2': showCenter,
        }"
      >
        <slot name="right">
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showLeft: Boolean,
    showCenter: Boolean,
    showRight: Boolean,
  },
};
</script>
