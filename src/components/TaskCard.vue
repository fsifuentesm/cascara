<template>
  <div class="card no-body">
    <div class="container-fluid">
      <b>
        <icon v-if="task.status === 'ongoing'"
          :icon="['fas', 'play']"
        ></icon>
        <icon v-else-if="task.status === 'finished'"
          :icon="['fas', 'check']"
        ></icon>
        <icon v-else-if="task.status === 'finished'"
          :icon="['fas', 'stop']"
        ></icon>
        {{ task.name }}
      </b>
      <br/>
      <small v-if="task.status === 'ongoing'"
        class="text-muted">Tarea en curso</small>
      <small v-else-if="task.status === 'finished'"
        class="text-muted">Tarea terminada</small>
      <small v-else-if="task.status === 'cancelled'"
        class="text-muted">Tarea cancelada</small>
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
