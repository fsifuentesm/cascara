<template>
  <div>
    <b-collapse :id="collapseId" v-model="visible" class="mb-3">
      <b-form
        class="w-100"
        @submit.prevent="submit"
      >
        <b-form-group>
          <b-form-input
            v-model="searchForm.searchText"
            placeholder="Título o Id"
            type="search"
            :disabled="disabled"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="¿Que estas buscando?"
        >
          <b-form-radio-group
            id="btn-radios-2"
            v-model="searchForm.objType"
            :options="objTypeOptions"
            button-variant="outline-primary"
            name="radio-btn-outline"
            @input="onObjTypeInput"
            :disabled="disabled || typeof fixedArgs.objType !== 'undefined'"
          ></b-form-radio-group>
        </b-form-group>

        <b-form-group
          v-if="(
            searchForm.objType === 'pointer'
          )"
          label="Estado de la tarea"
        >
          <b-form-checkbox-group
            v-model="searchForm.pointerStatus"
            :options="itemStatusOptions"
            switches
            :disabled="disabled || typeof fixedArgs.pointerStatus !== 'undefined'"
          ></b-form-checkbox-group>
        </b-form-group>

        <b-form-group>
          <template v-slot:label>
            <span v-if="searchForm.objType === 'pointer'"
            >Estado del flujo de autorización al que pertence la tarea</span>
            <span v-else
            >Estado del flujo de autorización</span>
          </template>

          <b-form-checkbox-group
            v-model="searchForm.executionStatus"
            :options="itemStatusOptions"
            switches
            :disabled="disabled || typeof fixedArgs.executionStatus !== 'undefined'"
          ></b-form-checkbox-group>
        </b-form-group>

        <b-form-row>
          <b-form-group
            class="col-6"
            label="Desde"
          >
            <b-form-input
              v-model="searchForm.minDate"
              type="date"
              :disabled="disabled"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            class="col-6"
            label="Hasta"
          >
            <b-form-input
              v-model="searchForm.maxDate"
              type="date"
              :disabled="disabled"
            ></b-form-input>
          </b-form-group>
        </b-form-row>

        <b-form-group
          label="¿Buscas algun usuario en particular?"
        >
          <b-form-checkbox
            v-model="searchForm.searchUsers"
            switch
            @input="onUserSearchInput"
            :disabled="disabled || typeof fixedArgs.searchUsers !== 'undefined'"
          >Sí, buscar usuario</b-form-checkbox>
        </b-form-group>

        <b-form-group
          v-if="searchForm.searchUsers"
        >
          <user-input
            :label="'Usuarios que realizaron tareas'"
            :placeholder="'Introduce un id de usuario'"
            v-model="searchForm.actoredUsers"
            :disabled="disabled || typeof fixedArgs.actoredUsers !== 'undefined'"
          ></user-input>
        </b-form-group>

        <b-form-group
          v-if="(
            searchForm.objType === 'pointer' &&
            searchForm.searchUsers
          )"
        >
          <user-input
            :label="'Usuarios asignados'"
            :placeholder="'Introduce un id de usuario'"
            v-model="searchForm.notifiedUsers"
            :disabled="disabled || typeof fixedArgs.notifiedUsers !== 'undefined'"
          ></user-input>
        </b-form-group>

        <b-button
          type="submit"
          variant="secondary"
          :disabled="disabled"
        >
          <span>
            <icon :icon="['fa', 'search']"/>
            Buscar
          </span>
        </b-button>
      </b-form>
    </b-collapse>

    <div class="w-100 text-center">
      <a
        v-b-toggle="collapseId"
        href="#"
        @click.prevent
      >
        <span v-if="!visible">
          <icon :icon="['fas', 'caret-down']"/>
          Mostrar controles de busqueda</span>
        <span v-else>
          <icon :icon="['fas', 'caret-up']"/>
          Ocultar controles de busqueda</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fixedArgs: Object,
    value: {
      type: Object,
      required: true,
    },
    defaultForm: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      uuid: Math.random(),
      visible: false,

      searchForm: Object.assign(this.value),

      objTypeOptions: [
        { text: 'Flujo de autorización', value: 'execution' },
        { text: 'Tarea', value: 'pointer' },
      ],

      itemStatusOptions: [
        { text: 'En curso', value: 'ongoing' },
        { text: 'Finalizado', value: 'finished' },
        { text: 'Cancelado', value: 'cancelled' },
      ],
    };
  },

  computed: {
    collapseId() {
      const vm = this;
      const modalId = `collapse-${vm.uuid}`;

      return modalId;
    },

    cleanForm() {
      const cleaned = Object.assign({}, this.searchForm);

      if (cleaned.objType === 'execution') {
        delete cleaned.notifiedUsers;
        delete cleaned.pointerStatus;
      }

      if (!cleaned.searchUsers) {
        delete cleaned.notifiedUsers;
        delete cleaned.actoredUsers;
      }

      return cleaned;
    },
  },

  methods: {
    submit() {
      this.$emit('submit', this.cleanForm);
    },

    onObjTypeInput(v) {
      if (v === 'execution') {
        this.searchForm.pointerStatus = this.itemStatusOptions.map(x => x.value);
      }
    },

    onUserSearchInput(v) {
      if (!v) {
        this.searchForm.actoredUsers = null;
        this.searchForm.notifiedUsers = null;
      }
    },
  },

  watch: {
    fixedArgs: {
      handler(newVal) {
        this.searchForm = Object.assign({}, this.defaultForm, this.value, newVal);
      },
    },

    value: {
      handler(newVal) {
        this.searchForm = Object.assign({}, this.defaultForm, newVal, this.fixedArgs);
      },
    },
  },
};
</script>
