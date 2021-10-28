<template>
  <div class="card no-body">
    <div class="container-fluid">
      <small class="text-muted">
        {{ user.identifier }}
      </small><br>
      <b>{{ user.fullname }}</b><br>
      <small>
        {{ user.email }}
      </small>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>
