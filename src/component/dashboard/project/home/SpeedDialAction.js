import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';


//TODO - Remove this to infra when https://github.com/mui-org/material-ui/pull/12405/commits is resolved
export const styles = theme => ({
  /* Styles applied to the root (`Tooltip`) component. */
  root: {
    position: 'relative',
  },
  /* Styles applied to the `Button` component. */
  button: {
    margin: 8,
    color: theme.palette.text.secondary,
    backgroundColor: emphasize(theme.palette.background.default, 0.12),
    '&:hover': {
      backgroundColor: emphasize(theme.palette.background.default, 0.15),
    },
    transition: `${theme.transitions.create('transform', {
      duration: theme.transitions.duration.shorter,
    })}, opacity 0.8s`,
    opacity: 1,
  },
  /* Styles applied to the `Button` component if `open={false}`. */
  buttonClosed: {
    opacity: 0,
    transform: 'scale(0)',
  },
});

class SpeedDialAction extends React.Component {
  state = {
    tooltipOpen: false,
  };

  handleTooltipClose = () => {
    this.setState({ tooltipOpen: false });
  };

  handleTooltipOpen = () => {
    this.setState({ tooltipOpen: true });
  };

  handleItemClick = (e) => {
    this.handleTooltipClose();
    this.props.onClick(e);
  };

  render() {
    const {
      classes,
      delay,
      icon,
      open,
      tooltipTitle,
      tooltipPlacement,
    } = this.props;

    return (
      <Tooltip
        title={tooltipTitle}
        placement={tooltipPlacement}
        onClose={this.handleTooltipClose}
        onOpen={this.handleTooltipOpen}
        open={this.state.tooltipOpen}
      >
        <Button
          variant="fab"
          mini
          className={classNames(classes.button, !open && classes.buttonClosed)}
          style={{ transitionDelay: `${delay}ms` }}
          onClick={this.handleItemClick}
          role="menuitem"
        >
          {icon}
        </Button>
      </Tooltip>
    );
  }
}

SpeedDialAction.propTypes = {
  /**
   * Properties applied to the [`Button`](/api/button) component.
   */
  ButtonProps: PropTypes.object,
  /**
   * Useful to extend the style applied to components.
   */
  classes: PropTypes.object.isRequired,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * Adds a transition delay, to allow a series of SpeedDialActions to be animated.
   */
  delay: PropTypes.number,
  /**
   * The Icon to display in the SpeedDial Floating Action Button.
   */
  icon: PropTypes.node.isRequired,
  /**
   * @ignore
   */
  id: PropTypes.string,
  /**
   * @ignore
   */
  onClick: PropTypes.func,

  /**
   * @ignore
   */
  open: PropTypes.bool,
  /**
   * Placement of the tooltip.
   */
  tooltipPlacement: PropTypes.string,
  /**
   * Label to display in the tooltip.
   */
  tooltipTitle: PropTypes.node,
};

SpeedDialAction.defaultProps = {
  delay: 0,
  open: false,
  tooltipPlacement: 'left',
};

export default withStyles(styles, { name: 'MuiSpeedDialAction' })(SpeedDialAction);