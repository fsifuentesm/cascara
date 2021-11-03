<template>
  <div class="card no-body">
    <div class="container-fluid">
      <b><app-md-render :raw-string="task.name"/></b>
      <br/>
      <small v-if="task.status === 'ongoing'"
        class="text-muted">
        <icon :icon="['fas', 'play']" size="xs"></icon>
        Tarea en curso
      </small>
      <small v-else-if="task.status === 'finished'"
        class="text-muted">
        <icon :icon="['fas', 'check']" size="xs"></icon>
        Tarea terminada
      </small>
      <small v-else-if="task.status === 'cancelled'"
        class="text-muted">
        <icon :icon="['fas', 'stop']" size="xs"></icon>
        Tarea cancelada
      </small>
      <br/>
      <small>{{ task.startedAt|fmtDate('LLLL') }}</small>
    </div>
  </div>
</template>

<script type="text/javascript">
import moment from 'moment';

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },

  filters: {
    fmtDate(val, fmt = 'llll') {
      return moment(val).format(fmt);
    },
  },
};
</script>
