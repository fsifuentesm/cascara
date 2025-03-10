<template>
  <div v-if="actualNodes.length" class="text-right">
    <span>
      <small
        class="text-muted"
      >Tareas clave finalizadas:
        <b>{{ validNodesCount }}</b> de <b>{{ actualNodes.length }}</b>
      </small>

      <div class="progress mb-2">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          :aria-valuenow="validNodesCount"
          :aria-valuemin="0"
          :aria-valuemax="actualNodes.length"
          :style="{
            'width': progressAsString,
          }"
        >{{ progressAsString }}</div>
      </div>
    </span>

    <div class="d-flex">
      <div class="table-responsive w-auto">
        <table class="table table-secondary table-sm table-bordered m-0">
          <tbody>
            <tr>
              <td
                v-for="(node, index) in actualNodes"
                v-bind:key="index"
                class="p-0"
              >
                <button
                  :id="node.id + '-' + uuid"
                  type="button"
                  class="btn btn-light btn-sm"
                  :class="{
                    'btn-outline-primary': node.state === 'valid',
                    'btn-outline-danger': node.state === 'invalid',
                    'btn-outline-warning': node.state === 'ongoing',
                    'btn-outline-secondary': node.state === 'unfilled',
                    'active': node.id === selectedNode,
                  }"
                  @click.prevent="$emit('click', node.id)"
                >
                  <icon :icon="['fas', 'check']"
                    v-if="node.state === 'valid'"
                  />
                  <icon :icon="['fas', 'times']"
                    v-else-if="node.state === 'invalid'"
                  />
                  <icon :icon="['fas', 'play']"
                    v-else-if="node.state === 'ongoing'"
                  />
                  <icon :icon="['fas', 'circle']"
                    v-else-if="node.state === 'unfilled'"
                  />
                </button>

                <b-popover
                  :target="node.id + '-' + uuid"
                  triggers="hover"
                  placement="top"
                  boundary="viewport"
                >
                  <span v-html="nodeName(node)"></span>
                </b-popover>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const md = require('markdown-it')();

export default {
  props: {
    nodes: {
      required: true,
    },
    selectedNode: String,
  },

  data() {
    return {
      uuid: Math.random(),
    };
  },

  computed: {
    actualNodes() {
      const index = this.nodes
        .slice().reverse()
        .findIndex(node => ['valid', 'ongoing'].includes(node.state));
      const count = this.nodes.length - 1;
      const lastValid = index >= 0 ? count - index : index;

      return this.nodes.filter((node, i) => {
        const valid = node.milestone && node.state === 'valid';
        const invalid = node.milestone && node.state === 'invalid' && lastValid < i;
        const ongoing = node.state === 'ongoing';
        const unfilled = node.milestone && node.state === 'unfilled' && lastValid < i;

        return valid || invalid || ongoing || unfilled;
      });
    },

    progressAsString() {
      const value = Math.trunc(
        (this.validNodesCount / this.actualNodes.length) * 100,
      );
      return `${value}%`;
    },

    validNodesCount() {
      return this.actualNodes.filter(node => node.state === 'valid').length;
    },
  },

  methods: {
    nodeName(node) {
      if (!['action', 'validation'].includes(node.type)) {
        return '[Tarea de sistema]';
      }

      return this.mdRender(node.name);
    },

    mdRender(str) {
      if (!str) return '';

      return md.renderInline(str);
    },
  },
};
</script>
