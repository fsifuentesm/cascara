const dashboardViewMixin = {
  props: {
    routeDefinitions: Array,
    required: true,
  },

  data() {
    return {
      title: 'Mixin',
      description: 'Desc',
      feed: 'feed',
      executionId: '',
      nodeId: '',
      fixedPayload: {},
      payload: {},
      availableFeedOptions: [],
    };
  },

  async beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      const props = await vm.parseRouteQuery(to);
      vm.setValues(props);
    });
  },

  async beforeRouteUpdate(to, from, next) {
    const vm = this;

    const props = await vm.parseRouteQuery(to);
    vm.setValues(props);

    next();
  },

  methods: {
    setValues(props) {
      const vm = this;

      Object.keys(props).forEach((k) => {
        vm[k] = props[k];
      });
    },

    async parseRouteQuery(to) {
      let actualRoute = this.routeDefinitions.find(x => x.feed === to.query.feed);

      if (!actualRoute) {
        actualRoute = this.routeDefinitions[0];
      }

      const props = {
        executionId: to.query.exe,
        nodeId: to.query.node,
        payload: {},
        fixedPayload: {},
        availableFeedOptions: this.routeDefinitions.map(x => ({
          label: typeof x.title === 'function' ? x.title(to) : x.title,
          value: x.feed,
        })),
      };

      if (to.query.searchText) {
        props.payload.searchText = to.query.searchText;
      }
      if (to.query.objType) {
        props.payload.objType = to.query.objType;
      }
      if (to.query.pointerStatus) {
        props.payload
          .pointerStatus = to.query.pointerStatus.split(',');
      }
      if (to.query.executionStatus) {
        props.payload
          .pointerStatus = to.query.executionStatus.split(',');
      }
      if (to.query.minDate) {
        props.payload.minDate = to.query.minDate;
      }
      if (to.query.maxDate) {
        props.payload.maxDate = to.query.maxDate;
      }
      if (to.query.searchUsers) {
        props.payload.searchUsers = to.query.searchUsers;
      }
      if (to.query.notifiedUsers) {
        props.payload
          .notifiedUsers = to.query.notifiedUsers.split(',');
      }
      if (to.query.actoredUsers) {
        props.payload
          .actoredUsers = to.query.actoredUsers.split(',');
      }

      [
        'feed',
        'title',
        'description',
      ].forEach((k) => {
        if (typeof actualRoute[k] === 'function') {
          props[k] = actualRoute[k](to);
        } else {
          props[k] = actualRoute[k];
        }
      });

      Object.keys(actualRoute.fixedPayload).forEach(async (k) => {
        let res;

        if (typeof actualRoute.fixedPayload[k] === 'function') {
          res = await Promise.resolve(
            actualRoute.fixedPayload[k](),
          ).then(data => data);
        } else {
          res = actualRoute.fixedPayload[k];
        }

        props.fixedPayload[k] = res;

        delete props.payload[k];
      });

      return props;
    },
  },
};

export default dashboardViewMixin;
