import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import { filterActionsByUser } from '../../utils/charts';
import {
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  DEFAULT_ZOOM,
  MAX_CLUSTER_ZOOM,
  CLUSTER_RADIUS,
  ENTER_KEY_CODE,
} from '../../config/constants';

const useStyles = makeStyles((theme) => ({
  clusterMarker: {
    color: '#fff',
    background: theme.palette.primary.main,
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '0.5rem',
  },
  typography: {
    textAlign: 'center',
    marginTop: theme.spacing(4),
  },
  mapContainer: {
    width: '100%',
    height: 400,
    marginTop: 30,
    marginBottom: 30,
  },
}));

const Marker = ({ children }) => children;

const ActionsMap = ({ actions, allUsersConsolidated, usersToFilter }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  // actionsToChart is the array converted to GeoJSON Feature objects below
  // (1) if you remove all names in the react-select dropdown, usersToFilter becomes null; in this case, show all actions
  // (2) if no users are selected (i.e. usersToFilter.length === 0), show all actions
  // (3) if all users are selected (i.e. usersToFilter.length === allUsers.length), also show all actions
  // #3 above is necessary: some actions are made by users NOT in the users list (e.g. user account deleted)
  // e.g. we retrieve 100 total actions and 10 users, but these 10 users have only made 90 actions
  // therefore, to avoid confusion: when all users are selected, show all actions
  let actionsToChart;
  if (
    usersToFilter === null ||
    usersToFilter.length === 0 ||
    usersToFilter.length === allUsersConsolidated.length
  ) {
    actionsToChart = actions;
  } else {
    actionsToChart = filterActionsByUser(actions, usersToFilter);
  }

  // GeoJSON Feature objects
  const points = actionsToChart
    .filter((action) => action.geolocation)
    .map((action) => ({
      type: 'Feature',
      properties: { cluster: false, actionId: action._id },
      geometry: {
        type: 'Point',
        coordinates: [action.geolocation.ll[1], action.geolocation.ll[0]],
      },
    }));

  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: CLUSTER_RADIUS, maxZoom: MAX_CLUSTER_ZOOM },
  });

  // function used to calculate size (in px) of clusters drawn on the map
  // based on total count of points in a cluster divided by total point count
  const calculateClusterRadius = (
    clusterCount,
    totalCount,
    baseRadius,
    scalar,
  ) => {
    return baseRadius + (clusterCount / totalCount) * scalar;
  };

  const handleClusterZoom = (longitude, latitude) => {
    mapRef.current.setZoom(mapRef.current.zoom + 1);
    mapRef.current.panTo({ lng: longitude, lat: latitude });
  };

  return (
    <>
      <Typography variant="subtitle1" className={classes.typography}>
        {t('Actions by Location')}
      </Typography>
      <Container className={classes.mapContainer}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
          defaultCenter={{ lat: DEFAULT_LATITUDE, lng: DEFAULT_LONGITUDE }}
          defaultZoom={DEFAULT_ZOOM}
          distanceToMouse={() => {}}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map }) => {
            mapRef.current = map;
          }}
          onChange={(map) => {
            setZoom(map.zoom);
            setBounds([
              map.bounds.nw.lng,
              map.bounds.se.lat,
              map.bounds.se.lng,
              map.bounds.nw.lat,
            ]);
          }}
        >
          {clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const {
              cluster: isCluster,
              point_count: pointCount,
            } = cluster.properties;
            if (isCluster) {
              return (
                <Marker key={cluster.id} lat={latitude} lng={longitude}>
                  <div
                    className={classes.clusterMarker}
                    style={{
                      width: `${calculateClusterRadius(
                        pointCount,
                        points.length,
                        10,
                        20,
                      )}px`,
                      height: `${calculateClusterRadius(
                        pointCount,
                        points.length,
                        10,
                        20,
                      )}px`,
                    }}
                    onClick={() => handleClusterZoom(longitude, latitude)}
                    onKeyPress={(event) => {
                      if (event.keyCode === ENTER_KEY_CODE) {
                        handleClusterZoom(longitude, latitude);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {pointCount}
                  </div>
                </Marker>
              );
            }
            return null;
          })}
        </GoogleMapReact>
      </Container>
    </>
  );
};

ActionsMap.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  allUsersConsolidated: PropTypes.arrayOf(PropTypes.object).isRequired,
  usersToFilter: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ActionsMap;
