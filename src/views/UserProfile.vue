<template>
  <div class="container-fluid p-0" style="max-width: 1270px;">
    <div class="row">
      <div class="col">
        <div v-if="currentUser && currentUser.loading">
          Cargando...
        </div>
        <div v-else-if="!currentUser || currentUser.errors">
          Hubo un error al cargar la información
        </div>
        <div v-else>
          <user-card v-bind:user="currentUser">
          </user-card>

          <div v-if="currentUser.tasks">
            <div v-for="task in currentUser.tasks"
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
      users: state => state.users.allItems,
    }),

    currentUser() {
      if (
        this.identifier &&
        this.users[this.identifier] &&
        this.users[this.identifier].data) {
        return this.users[this.identifier].data;
      }
      return null;
    },
  },

  methods: {
    ...mapActions('users', {
      getUser: 'getUser',
      getUserGroups: 'getUserGroups',
      getUserTasks: 'getUserTasks',
      getUserPermissions: 'getUserPremissions',
    }),
  },

  props: {
    identifier: {
      type: String,
      required: true,
    },
  },

  mounted() {
    this.getUser(this.identifier);
    this.getUserTasks(this.identifier);
  },

  watch: {
    identifier: {
      handler(newID) {
        this.getUser(newID);
        this.getUserTasks(newID);
      },
    },
  },

};

</script>

<style type="text/css"></style>
