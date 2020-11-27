const defaultFieldSelectorParameters = {
  children: {
    data: {
      selected: false,
      expanded: true,
      children: {
        actions: {
          selected: false,
          expanded: false,
          children: {
            _id: { selected: false },
            user: { selected: false },
            sessionId: { selected: false },
            data: { selected: true },
            visibility: { selected: false },
            verb: { selected: false },
            space: { selected: false },
            format: { selected: false },
            appInstance: { selected: false },
            userType: { selected: false },
            geolocation: {
              selected: true,
              expanded: false,
              children: {
                range: { selected: false },
                country: { selected: false },
                eu: { selected: false },
                timezone: { selected: false },
                city: { selected: false },
                ll: { selected: false },
                metro: { selected: false },
                area: { selected: false },
              },
            },
            createdAt: { selected: false },
            updatedAt: { selected: false },
            __v: { selected: false },
          },
        },
        users: {
          selected: false,
          expanded: false,
          children: {
            _id: { selected: false },
            name: { selected: false },
            type: { selected: false },
          },
        },
        appInstances: {
          selected: false,
          expanded: false,
          children: {
            _id: { selected: false },
            url: { selected: false },
            name: { selected: false },
            settings: { selected: true },
          },
        },
        appInstanceResources: {
          selected: false,
          expanded: false,
          children: {
            _id: { selected: false },
            user: { selected: false },
            sessionId: { selected: false },
            data: { selected: true },
            ownership: { selected: false },
            visibility: { selected: false },
            type: { selected: false },
            format: { selected: false },
            appInstance: { selected: false },
            createdAt: { selected: false },
            updatedAt: { selected: false },
            __v: { selected: false },
          },
        },
        metadata: {
          selected: false,
          expanded: false,
          children: {
            spaceTree: {
              selected: false,
              expanded: false,
              children: {
                id: { selected: false },
                name: { selected: false },
                parentId: { selected: false },
              },
            },
            createdAt: { selected: false },
          },
        },
      },
    },
  },
};

module.exports = defaultFieldSelectorParameters;
