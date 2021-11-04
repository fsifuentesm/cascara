<template>
  <div class="card no-body">
    <div class="container-fluid">
      <small class="text-muted">
        {{ execution.identifier }}
      </small><br>
      <b>{{ execution.name }}</b><br>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    execution: {
      type: Object,
      required: true,
    },
  },
};
</script>
