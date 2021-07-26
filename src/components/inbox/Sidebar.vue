<template>
  <div>
    <b-nav
      class="mb-2"
      vertical
      pills
    >
      <b-nav-item
        href="#"
        v-on:click.prevent="$emit('click-feed', item.value)"
        v-for="(item, index) in options"
        :key="index"
        :active="item.value === selectedSearch"
        :disabled="disabled"
      >{{ item.label }}</b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  props: {
    selectedSearch: {
      type: String,
    },
    options: {
      type: Array,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
