import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {compose} from 'recompose';

import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';

const styles = {
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

class ProjectCard extends Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    showAnimation: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      animating: props.showAnimation
    }
  }

  componentWillReceiveProps(nextProps) {

    if (!nextProps.showAnimation && !this.props.showAnimation)
      this.setState({
        animating: false
      });
  }

  gotoProject = () => {

    let project = this.props.project;
    const projectName = project.name;

    this.props.history.push({
      pathname: '/dashboard/project/' + projectName,
      state: {
        selectedProject: project
      }
    });
  };

  renderProjectCard = () => {

    const {classes, project} = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <Card className={'project-card'}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            {project.name}
          </Typography>
          <Typography variant="headline" component="h2">
            be{bull}nev{bull}o{bull}lent
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            adjective
          </Typography>
          <Typography component="p">
            well meaning and kindly.<br/>
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small"
                  color={'secondary'}
                  onClick={this.gotoProject}>VIEW PROJECT</Button>
        </CardActions>
      </Card>
    );
  };

  render() {

    const {animating} = this.state;

    return (
      <div>
        {
          animating ?
            <Zoom in={true} timeout={400}>
              {this.renderProjectCard()}
            </Zoom> :
            this.renderProjectCard()
        }
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withRouter
)(ProjectCard);