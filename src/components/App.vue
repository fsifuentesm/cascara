<template>
  <div class="h-100">
    <app-header />
    <router-view />
  </div>
</template>

<script>
import { EventBus } from '../event-bus';

export default {
  data() {
    return {
      online: false,
      sseClient: null,
      sse: { cleanup: true },
    };
  },

  methods: {
    handleUpdate(evt) {
      EventBus.$emit('execution_update', evt);
    },
    handleDelete(evt) {
      EventBus.$emit('execution_delete', evt);
    },
    handlePatch(evt) {
      EventBus.$emit('execution_patch', evt);
    },
    handleCreate(evt) {
      EventBus.$emit('execution_create', evt);
    },

    connect() {
      this.disconnect();

      const vm = this;

      if (!process.env.SSE_ENABLED) { return; }

      vm.online = true;

      vm.sseClient = vm.$sse.create({
        format: 'json',
        polyfill: true,
        url: `${process.env.CACAHUATE_URL}/stream`,
        withCredentials: true,
      });

      if (!vm.sseClient) { return; }

      vm.sseClient.on('error', () => {
        vm.online = false;
      });

      vm.sseClient.on('execution_update', this.handleUpdate);
      vm.sseClient.on('execution_delete', this.handleDelete);
      vm.sseClient.on('execution_patch', this.handlePatch);
      vm.sseClient.on('execution_create', this.handleCreate);

      vm.sseClient.connect().then(() => { }).catch(() => {
        vm.online = false;
      });
    },

    disconnect() {
      const vm = this;

      if (vm.sseClient) {
        vm.sseClient.disconnect();
        vm.sseClient = null;
      }
    },
  },

  beforeDestroy() {
    this.disconnect();
  },

  watch: {
    online: {
      immediate: true,
      handler(newVal) {
        if (!newVal) {
          setTimeout(this.connect, 5000);
        }
      },
    },
  },
};
</script>
