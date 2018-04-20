import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  wrap: {
    width: 800,
  },
  button: {
    margin: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Home extends Component {
  state = {

  }
  componentDidMount() {

  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="center">
          <Grid item xs={6} sm={12}>
            <Paper className={classes.paper}>content</Paper>
          </Grid>
          <Grid item xs={6} sm={12}>
            <Button variant="raised" color="secondary" className={classes.button} onTouchTap={() => { console.log('reset') }}>重置</Button>
            <Button variant="raised" color="primary" className={classes.button} onTouchTap={() => { console.log('undo') }}>悔棋</Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
