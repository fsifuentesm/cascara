<template>
  <div class="container-fluid p-0" style="max-width: 1270px;">
    <div class="row">
      <div class="col">
        <div v-if="currentExecution && currentExecution.loading">
          Cargando...
        </div>
        <div v-else-if="!currentExecution || currentExecution.errors">
          Hubo un error al cargar la información
        </div>
        <div v-else>
          <execution-card v-bind:execution="currentExecution">
          </execution-card>

          <div v-if="currentPointers">
            <div v-for="task in currentPointers"
              :key="task.id"
            >
              <task-card v-bind:task="task">
              </task-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      executions: state => state.executions.allItems,
      pointers: state => state.pointers.allItems,
    }),

    currentExecution() {
      if (
        this.identifier &&
        this.executions[this.identifier] &&
        this.executions[this.identifier].data) {
        return this.executions[this.identifier].data;
      }
      return null;
    },

    currentPointers() {
      if (
        this.currentExecution &&
        this.currentExecution.pointers) {
        return this.currentExecution.pointers
          .map(x => this.pointers[x].data);
      }
      return [];
    },
  },

  methods: {
    ...mapActions('executions', {
      getExecution: 'getExecution',
      getExecutionPointers: 'getExecutionPointers',
    }),
  },

  props: {
    identifier: {
      type: String,
      required: true,
    },
  },

  mounted() {
    this.getExecution(this.identifier);
    this.getExecutionPointers(this.identifier);
  },

  watch: {
    identifier: {
      handler(newID) {
        this.getExecution(newID);
        this.getExecutionPointers(newID);
      },
    },
  },

};
</script>

<style type="text/css"></style>
