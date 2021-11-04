<template>
  <div class="container-fluid p-0" style="max-width: 1270px;">
    <div class="row">
      <div class="col">
        <div v-for="group in currentGroups"
          :key="group.id">
          <groups-list v-bind:group="group.data">
          </groups-list>
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

    currentGroups() {
      if (this.groups) {
        return this.groups;
      }
      return null;
    },

  },

  methods: {
    ...mapActions('groups', {
      getAllGroups: 'getAllGroups',
    }),
  },

  props: {
  },

  mounted() {
    this.getAllGroups();
  },

  watch: {
    identifier: {
      handler() {
        this.getAllGroups();
      },
    },
  },

};
</script>

<style type="text/css"></style>
