<template>
  <div
    ref="inboxTop"
  >
    <app-inbox-layout
      :show-left="showLeft"
      :show-center="showCenter"
      :show-right="showRight"
    >
      <template v-slot:top>
        <div class="px-3 py-2 text-center">
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
        </div>
        <hr/>
      </template>

      <template v-slot:left>
        <app-inbox-sidebar
          :selected-search="feed"
          :disabled="fixedPayload.loading"
          :options="availableFeedOptions"
          v-on:click-feed="selectFeed($event)"
        />
      </template>

      <template v-slot:center>
        <div class="container-fluid p-0">
          <div class="row no-gutters mb-3">
            <div class="col">
              <b-card
                v-if="!showLeft"
                class="mb-3"
              >
                <b-form-select
                  @change="selectFeed($event)"
                  @input="selectFeed($event)"
                  text-field="label"
                  :value="feed"
                  :disabled="fixedPayload.loading"
                  :options="availableFeedOptions"
                />
              </b-card>

              <b-card>
                <span
                  v-if="fixedPayload.loading"
                >{{ $t("commons.loading") }}</span>

                <app-inbox-search-card
                  :fixed-args="fixedPayload.data"
                  :default-form="defaultForm"
                  v-model="searchForm"
                  v-on:submit="submitForm"
                  :disabled="fixedPayload.loading"
                />
              </b-card>
            </div>
          </div>

          <hero v-if="listItems.loading"
            icon="spinner"
            title="commons.loading"
            spin
          />

          <div v-else-if="listItems.error"
            class="text-center my-2"
          >
            <icon :icon="['fas', 'times']"/>
            <span class="ml-1">Error al cargar elementos</span>
          </div>

          <div
            v-else
          >
            <div class="row no-gutters mb-1"
              v-if="!listItems.data.length"
            >
              <div class="col">
                <h4 class="text-center">No hay elementos para mostrar</h4>
              </div>
            </div>
            <div class="row no-gutters mb-1"
              v-else
            >
              <div class="col text-left"
                v-if="searchForm.objType === 'pointer'"
              >
                <b-form-checkbox
                  v-model="loadIfDoable"
                  switch
                >{{ $t('dashboard.showDoableTasks') }}</b-form-checkbox>
              </div>

              <div class="col text-right">
                <span>Mostrando <b>{{ listItems.data.length }}</b>
                de <b>{{ listItems.totalCount }}</b></span>
              </div>
            </div>

            <div class="row no-gutters mb-3"
              v-for="item in listItems.data"
              :key="item.id"
            >
              <div class="col">
                <component
                  :is="itemComponent(item)"
                  :execution='item'
                  :pointer='item'
                  :show-execution='true'
                  :show-detail="!showRight"
                  :load-if-doable="loadIfDoable"
                  :selected-node="item.id === executionId ? nodeId : ''"
                  :selected="item.node ?
                    (item.node.id === nodeId && item.execution.id === executionId) :
                    false"
                  v-on:complete="reloadPointer(item.id)"
                  v-on:click-execution="handleItemClickExecution($event, item);"
                  v-on:click-username="selectUser($event);"
                  v-on:click-node="handleClickNode($event, item);"
                >
                  <template v-slot:content
                    v-if="item.execution && item.execution.id"
                  >
                    <timeline-summary
                      :execution-id="item.execution.id"
                    />
                  </template>
                </component>
              </div>
            </div>

            <hero v-if="olderItems.loading"
              icon="spinner"
              title="commons.loading"
              spin
            />
            <div class="row no-gutters mb-3"
              v-else-if="listItems.data.length < listItems.totalCount"
            >
              <div class="col">
                <button
                  type="button"
                  class="btn btn-primary w-100"
                  @click="loadMore"
                >Cargar más</button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:right>
        <div>
          <h3
            class="text-center"
          >Flujo de autorizacion</h3>

          <div
            class="text-right my-2"
          >
            <a
              href="#"
              v-on:click.prevent="selectExecution()"
            >
              <icon :icon="['fas', 'arrow-circle-left']"/>
              <span class="ml-1">Volver al buscador</span>
            </a>
          </div>

          <app-inbox-execution-timeline
            :execution-id="executionId"
            :selected-node="nodeId"
            v-on:complete="reloadPointer($event)"
            v-on:click-username="selectUser($event);"
            v-on:click-node="handleClickNode($event, executionId);"
          />
        </div>
      </template>
    </app-inbox-layout>
  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';

import { EventBus } from '../event-bus';

export default {
  props: {
    routeDefinitions: {
      type: Array,
      required: true,
      validator: function validator(value) {
        return value.length > 1;
      },
    },
    defaultForm: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      title: '',
      description: '',
      feed: '',
      executionId: '',
      nodeId: '',

      loadIfDoable: false,

      fixedPayload: {
        data: {},
        loading: false,
      },

      searchForm: Object.assign({}, this.defaultForm),

      listItems: {
        data: [],
        loading: false,
        error: false,
        totalCount: 0,
      },

      recentItems: {
        loading: false,
        error: false,
      },

      olderItems: {
        loading: false,
        error: false,
      },
    };
  },

  computed: {
    showLeft() {
      return (
        (this.showRight === false && (this.$mq === 'md' || this.$mq === 'lg')) ||
        (this.showRight === true && (this.$mq === 'lg'))
      );
    },

    showCenter() {
      return (
        this.showRight === false ||
        (this.showRight === true && (this.$mq === 'md' || this.$mq === 'lg'))
      );
    },

    showRight() {
      return !!this.executionId;
    },

    availableFeedOptions() {
      if (Array.isArray(this.routeDefinitions)) {
        return this.routeDefinitions.map(x => ({
          label: x.title,
          value: x.feed,
        }));
      }

      return [];
    },
  },

  methods: {
    compareItems(a, b) {
      const dateA = moment(a.started_at);
      const dateB = moment(b.started_at);

      if (dateA < dateB) { return 1; }
      if (dateA > dateB) { return -1; }
      return 0;
    },

    handleMessage() {
      this.loadRecent();
    },

    handleClickNode(v, item) {
      this.nodeId = v;
      if (item.execution) {
        this.executionId = item.execution.id;
      } else if (item.id) {
        this.executionId = item.id;
      } else {
        this.executionId = item;
      }

      this.updateRoute();
    },

    handleItemClickExecution(v, item) {
      if (item.node) {
        this.nodeId = item.node.id;
      }

      this.executionId = v;

      this.updateRoute();
    },

    loadInitial: _.debounce(function loadInitial() {
      const vm = this;

      vm.listItems.data = [];
      vm.listItems.loading = true;
      vm.listItems.error = false;

      const payload = {
        ...vm.searchForm,
      };

      if (payload.minDate) {
        payload.minDate = moment(payload.minDate).toISOString();
      }

      if (payload.maxDate) {
        payload.maxDate = moment(payload.maxDate).add(1, 'days').toISOString();
      }

      let serviceCallback = null;
      if (payload.objType === 'pointer') {
        serviceCallback = vm.$pointerService.getPointers;
      } else if (payload.objType === 'execution') {
        serviceCallback = vm.$executionService.getExecutions;
      }

      if (!serviceCallback) {
        vm.listItems.loading = false;
        vm.listItems.error = true;
        return;
      }

      serviceCallback(payload)
        .then(({ items, totalCount }) => {
          const currentItems = vm.listItems.data.map(x => x.id);
          items.forEach((x) => {
            if (!currentItems.includes(x.id)) {
              vm.listItems.data.push(x);
            }
          });

          vm.listItems.data.sort(vm.compareItems);

          vm.listItems.totalCount = totalCount;
          vm.listItems.loading = false;
        }).catch(() => {
          vm.listItems.loading = false;
          vm.listItems.error = true;
        });
    }, 250),

    reloadPointer: _.debounce(function reloadPointer(ptrId) {
      const vm = this;
      vm.$pointerService.getPointer(ptrId)
        .then((data) => {
          const index = vm.listItems.data
            .findIndex(x => x.id === ptrId);

          if (index >= 0) {
            vm.listItems.data.splice(index, 1, data);
          }
        }).catch(() => {
        });

      vm.loadRecent();
    }, 250),

    loadRecent: _.debounce(function loadRecent() {
      const vm = this;

      vm.recentItems.loading = true;
      vm.recentItems.error = false;

      const payload = {
        ...vm.searchForm,
      };

      if (payload.minDate && vm.listItems.data.length) {
        const qMinDate = moment(payload.minDate);
        const lastMinDate = moment(vm.listItems.data[0].started_at);

        payload.minDate = _.max([lastMinDate, qMinDate]).toISOString();
      } else if (vm.listItems.data.length) {
        payload.minDate = moment(vm.listItems.data[0].started_at).toISOString();
      }

      if (payload.maxDate) {
        payload.maxDate = moment(payload.maxDate).add(1, 'days').toISOString();
      }

      let serviceCallback = null;
      if (payload.objType === 'pointer') {
        serviceCallback = vm.$pointerService.getPointers;
      } else if (payload.objType === 'execution') {
        serviceCallback = vm.$executionService.getExecutions;
      }

      serviceCallback(payload)
        .then(({ items }) => {
          const currentItems = vm.listItems.data.map(x => x.id);
          items.forEach((x) => {
            if (!currentItems.includes(x.id)) {
              vm.listItems.data.push(x);
              vm.listItems.totalCount += 1;
            }
          });

          vm.listItems.data.sort(vm.compareItems);

          vm.recentItems.loading = false;
        }).catch(() => {
          vm.recentItems.loading = false;
          vm.recentItems.error = true;
        });
    }, 250),

    loadMore: _.debounce(function loadMore() {
      const vm = this;

      vm.olderItems.loading = true;
      vm.olderItems.error = false;

      const payload = {
        ...vm.searchForm,
      };

      if (payload.minDate) {
        payload.minDate = moment(payload.minDate).toISOString();
      }

      if (payload.maxDate && vm.listItems.data.length) {
        const listLength = vm.listItems.data.length;

        const qMaxDate = moment(payload.maxDate).add(1, 'days');
        const lastMaxDate = moment(vm.listItems.data[listLength - 1].started_at);

        payload.maxDate = _.min([lastMaxDate, qMaxDate]).toISOString();
      } else if (vm.listItems.data.length) {
        const listLength = vm.listItems.data.length;
        payload.maxDate = moment(vm.listItems.data[listLength - 1].started_at).toISOString();
      }

      let serviceCallback = null;
      if (payload.objType === 'pointer') {
        serviceCallback = vm.$pointerService.getPointers;
      } else if (payload.objType === 'execution') {
        serviceCallback = vm.$executionService.getExecutions;
      }

      serviceCallback(payload)
        .then(({ items }) => {
          const currentItems = vm.listItems.data.map(x => x.id);
          items.forEach((x) => {
            if (!currentItems.includes(x.id)) {
              vm.listItems.data.push(x);
            }
          });

          vm.listItems.data.sort(vm.compareItems);

          vm.olderItems.loading = false;
        }).catch(() => {
          vm.olderItems.loading = false;
          vm.olderItems.error = true;
        });
    }, 250),

    itemComponent(obj) {
      // case execution
      const k = '_type';
      if (obj[k] === 'execution') {
        return 'app-execution-card';
      }
      // case pointer
      return 'app-pointer-card';
    },

    selectExecution(newExecution) {
      this.executionId = newExecution;

      this.updateRoute();
    },

    selectUser(username) {
      this.feed = 'general';
      this.searchForm.actoredUsers = [username];
      this.searchForm.notifiedUsers = [username];
      this.searchForm.searchUsers = true;
      this.searchForm.searchText = '';
      this.searchForm.objType = 'pointer';
      this.searchForm.pointerStatus = ['ongoing', 'finished', 'cancelled'];
      this.searchForm.executionStatus = ['ongoing', 'finished', 'cancelled'];
      this.searchForm.minDate = '';
      this.searchForm.maxDate = '';

      this.searchForm = Object.assign(
        {},
        this.defaultForm,
        this.searchForm,
        this.fixedPayload.data,
      );
      this.loadInitial();

      this.updateRoute();
    },

    submitForm(form) {
      this.searchForm = Object.assign(
        {},
        form,
        this.fixedPayload.data,
      );
      this.loadInitial();

      this.updateRoute();
    },

    updateRoute() {
      const query = this.buildQueryData();
      this.$router.push({
        name: this.$router.name,
        query,
      });
    },

    selectFeed(newFeed) {
      this.$router.push({
        name: this.$route.name,
        query: { feed: newFeed },
      });
    },

    setFeedData(feed) {
      const vm = this;

      const actualRoute = vm.routeDefinitions
        .find(x => x.feed === feed) || vm.routeDefinitions[0];
      if (!actualRoute) { return new Promise(); }

      vm.title = actualRoute.title;
      vm.description = actualRoute.description;
      vm.feed = actualRoute.feed;
      vm.fixedPayload.loading = true;

      const fs = Object.keys(actualRoute.fixedPayload)
        .map((k) => {
          if (typeof actualRoute.fixedPayload[k] === 'function') {
            return Promise.resolve(actualRoute.fixedPayload[k]())
              .then(v => [k, v]);
          }
          return Promise.resolve(actualRoute.fixedPayload[k])
            .then(v => [k, v]);
        });

      return Promise.all(fs).then((values) => {
        const map = new Map(values);
        const obj = Object.fromEntries(map);
        vm.fixedPayload = {
          data: obj,
          loading: false,
        };
      });
    },

    setQueryData() {
      const vm = this;

      const urlQuery = this.$route.query;

      if (urlQuery.executionId) {
        this.executionId = urlQuery.executionId;
      } else {
        this.executionId = null;
      }

      if (urlQuery.nodeId) {
        this.nodeId = urlQuery.nodeId;
      } else {
        this.nodeId = null;
      }

      if (urlQuery.pointerId) {
        this.pointerId = urlQuery.pointerId;
      } else {
        this.pointerId = null;
      }

      const newSearchForm = {};

      Object.keys(vm.defaultForm).filter(x => urlQuery[x]).forEach((k) => {
        if ([
          'actoredUsers',
          'notifiedUsers',
          'pointerStatus',
          'executionStatus',
        ].includes(k) && (
          typeof urlQuery[k] === 'string' || urlQuery[k] instanceof String
        )) {
          newSearchForm[k] = urlQuery[k].split(',');
        } else {
          newSearchForm[k] = urlQuery[k];
        }
      });

      this.searchForm = Object.assign(
        {},
        this.defaultForm,
        newSearchForm,
        this.fixedPayload.data,
      );
    },

    buildQueryData() {
      const vm = this;

      const query = { };

      if (this.feed) {
        query.feed = this.feed;
      }

      if (this.executionId) {
        query.executionId = this.executionId;
      }

      if (this.nodeId) {
        query.nodeId = this.nodeId;
      }

      Object.keys(vm.searchForm).forEach((k) => {
        if (Array.isArray(vm.searchForm[k])) {
          query[k] = vm.searchForm[k].join(',');
        } else {
          query[k] = vm.searchForm[k];
        }
      });

      Object.keys(this.fixedPayload.data).forEach((k) => {
        delete query[k];
      });

      Object.keys(this.searchForm).forEach((k) => {
        if (!this.searchForm[k]) {
          delete query[k];
        }
      });

      return query;
    },
  },

  mounted() {
    EventBus.$on('execution_update', this.handleMessage);
    EventBus.$on('execution_delete', this.handleMessage);
    EventBus.$on('execution_patch', this.handleMessage);
    EventBus.$on('execution_create', this.handleMessage);

    const vm = this;
    vm.setFeedData(vm.$route.query.feed)
      .then(() => {
        vm.setQueryData();
        vm.loadInitial();
      });
  },

  beforeDestroy() {
    EventBus.$off('execution_update', this.handleMessage);
    EventBus.$off('execution_delete', this.handleMessage);
    EventBus.$off('execution_patch', this.handleMessage);
    EventBus.$off('execution_create', this.handleMessage);
  },

  beforeRouteUpdate(to, from, next) {
    const vm = this;

    let bReload = !vm.listItems.data;
    if (to.query.feed !== from.query.feed) {
      bReload = true;
    }

    vm.setFeedData(to.query.feed)
      .then(() => {
        vm.setQueryData();

        if (bReload) {
          vm.loadInitial();
        }
      });

    next();
  },
};
</script>
