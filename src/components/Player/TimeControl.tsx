import { Grid, Slider, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { AppContext } from '../../app-context';
import { formatDuration } from '../../utils';

const useStyles = makeStyles((theme: Theme) => ({
  slider: {
    marginTop: 5,
  },
}));

const TimeControl = () => {
  const classes = useStyles();
  const { playerStore } = useContext(AppContext);
  const duration = playerStore.track?.duration || 0;

  const value = Math.trunc(((playerStore.currentTime * 1000) / duration) * 100);

  const onChange = (event: any, newValue: number | number[]) => {
    const newProgress = ((duration / 100) * (newValue as number)) / 1000;
    playerStore.setCurrentTime(newProgress);
  };

  return (
    <Grid container item xs={12} alignItems="center" spacing={2}>
      <Grid item>
        <Typography variant="body2">
          {formatDuration(playerStore.currentTime * 1000)}
        </Typography>
      </Grid>
      <Grid item xs>
        <Slider
          value={value}
          onChange={onChange}
          aria-labelledby="progress"
          className={classes.slider}
        />
      </Grid>
      <Grid item>
        <Typography variant="body2">{formatDuration(duration)}</Typography>
      </Grid>
    </Grid>
  );
};

export default observer(TimeControl);
