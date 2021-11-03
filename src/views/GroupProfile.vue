<template>

  <div class="container-fluid p-0" style="max-width: 1270px;">
    "{{ currentGroup }}"
    <div class="row">
      <div class="col">
        <div v-if="currentGroup && currentGroup.loading">
          Cargando...
        </div>
        <div v-else-if="!currentGroup || currentGroup.errors">
          Hubo un error al cargar la información
        </div>
        <div v-else>
          <group-card v-bind:group="currentGroup">
          </group-card>
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
      groups: state => state.groups.allItems,
    }),

    currentGroup() {
      if (
        this.identifier &&
        this.groups[this.identifier] &&
        this.groups[this.identifier].data) {
        return this.groups[this.identifier].data;
      }
      return null;
    },
  },

  methods: {
    ...mapActions('groups', {
      getGroup: 'getGroup',
      getGroups: 'getGroups',
    }),
  },

  props: {
    identifier: {
      type: String,
      required: true,
    },
  },

  mounted() {
    this.getGroup(this.identifier);
  },

  watch: {
    identifier: {
      handler(newID) {
        this.getGroup(newID);
      },
    },
  },

};
</script>

<style type="text/css"></style>
