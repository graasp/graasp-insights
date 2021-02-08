import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import Main from './common/Main';
import AddVisualizationForm from './charts/AddVisualizationForm';
import ChartsLayout from './charts/ChartsLayout';
import { getDatasets, getDataset, clearDataset } from '../actions';

const useStyles = makeStyles((theme) => ({
  infoAlert: {
    margin: theme.spacing(2),
  },
}));

const Visualizations = () => {
  // i18next, material-ui, and react-redux hooks
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  // initialize component state holding the selected dataset to be visualized
  const [selectedDatasetId, setSelectedDatasetId] = useState('');

  // on component load, dispatch getDatasets action
  useEffect(() => {
    dispatch(getDatasets());
    // in react hooks, the return statement acts as a clean-up function simmilar to componentWillUnmount
    return () => {
      dispatch(clearDataset());
    };
  }, [dispatch]);

  // retrieve datasets from redux store
  // (note: react-redux useSelector roughly equivalent to mapStateToProps)
  const datasets = useSelector((state) => state.dataset.get('datasets'));
  // retrieve selected dataset's content from redux store
  const retrievedDatasetContent = useSelector((state) =>
    state.dataset.getIn(['current', 'content']).get('content'),
  );

  // function triggered when 'Visualize' button is clicked
  const fetchDatasetToBeVisualized = () => {
    dispatch(getDataset({ id: selectedDatasetId }));
  };

  if (!datasets.size) {
    return (
      <Main>
        <Alert severity="info" className={classes.infoAlert}>
          {t('Load a dataset first')}
        </Alert>
      </Main>
    );
  }

  return (
    <Main>
      <AddVisualizationForm
        selectedDatasetId={selectedDatasetId}
        setSelectedDatasetId={setSelectedDatasetId}
        fetchDatasetToBeVisualized={fetchDatasetToBeVisualized}
        datasets={datasets}
      />
      <ChartsLayout retrievedDatasetContent={retrievedDatasetContent} />
    </Main>
  );
};

export default Visualizations;
