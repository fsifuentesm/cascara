<template>
  <div class="card no-body">
    <div class="container-fluid">
      <small class="text-muted">
        {{ group.identifier }}
      </small><br>
      <b>{{ group.name }}</b><br>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
</style>
