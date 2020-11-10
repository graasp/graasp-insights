// CustomToolTip used in ActionsByTimeOfDayChart
// x-axis labels in that chart say 'morning', 'afternoon', etc.
// this tooltip adds the time of day those labels refer to
/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  LATE_NIGHT,
  EARLY_MORNING,
  MORNING,
  AFTERNOON,
  EVENING,
  NIGHT,
} from '../../../config/constants';

const useStyles = makeStyles((theme) => ({
  customTooltipDiv: {
    backgroundColor: 'white',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    border: '0.5px solid #cccccc',
  },
  customTooltipCount: {
    color: theme.palette.primary.main,
  },
}));

const CustomTooltip = ({ active, payload, label }) => {
  const classes = useStyles();

  const generateAddedTooltipText = (input) => {
    switch (input) {
      case LATE_NIGHT:
        return '00:00-04:00';
      case EARLY_MORNING:
        return '04:00-08:00';
      case MORNING:
        return '08:00-12:00';
      case AFTERNOON:
        return '12:00-16:00';
      case EVENING:
        return '16:00-20:00';
      case NIGHT:
        return '20:00-00:00';
      default:
        return null;
    }
  };

  if (active) {
    return (
      <div className={classes.customTooltipDiv}>
        <p>{`${label} (${generateAddedTooltipText(label)})`}</p>
        <p className={classes.customTooltipCount}>
          {`Count : ${payload[0].value}`}
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
