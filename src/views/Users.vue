<template>
  <div class="container-fluid p-0" style="max-width: 1270px;">
    <div class="row">
      <div class="col">
        <div v-for="user in currentUsers"
          :key="user.id">
          <users-list v-bind:user="user.data">
          </users-list>
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
      users: state => state.users.allItems,
    }),

    currentUsers() {
      if (this.users) {
        return this.users;
      }
      return null;
    },

  },

  methods: {
    ...mapActions('users', {
      getAllUsers: 'getAllUsers',
    }),
  },

  props: {
  },

  mounted() {
    this.getAllUsers();
  },

  watch: {
    identifier: {
      handler() {
        this.getAllUsers();
      },
    },
  },

};
</script>

<style type="text/css"></style>
