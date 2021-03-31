const updateActivityList = (flag) => {
  if (flag) {
    return (list) => list.push(flag);
  }
  return (list) => list.pop();
};

const updatePipelinesList = (flag) => {
  if (flag) {
    return (list) => list.push(flag);
  }
  return (list) => list.pop();
};

const pushDatasetToList = (payload) => {
  return (list) => list.push(payload);
};

// eslint-disable-next-line import/prefer-default-export
export { updateActivityList, pushDatasetToList, updatePipelinesList };
