import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import ChessPanel from './ChessPanel';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  wrap: {
    width: 200,
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
        <ChessPanel ref={node => {this.chessPanel = node} } />
        <div>
          <Button variant="raised" className={classes.button} onTouchTap={() => { this.chessPanel.reset(); }}>重置</Button>
          <Button variant="raised" color="primary" className={classes.button} onTouchTap={() => { this.chessPanel.undo(); }}>悔棋</Button>
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
