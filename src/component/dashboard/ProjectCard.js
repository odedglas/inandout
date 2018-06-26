import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import { compose } from 'recompose';

import { withStyles } from '@material-ui/core/styles';
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
  };

  state = {
    show: false,
  };

  componentDidMount() {
    this.setState({show:true})
  }

  gotoProject = () => {

    let project = this.props.project;
    const projectName = project.name;
    console.log("Navigation to : /dashboard/project/" + projectName);
    this.props.history.push({
      pathname: '/dashboard/project/' + projectName,
      state: {
        selectedProject: project
      }
    });
  };

  render () {

    const { classes, project } = this.props;
    const { show } = this.state;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <div>
        <Zoom in={show} timeout={400} >
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
                well meaning and kindly.<br />
                {'"a benevolent smile"'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small"
                      color={'secondary'}
                      onClick={this.gotoProject}>VIEW PROJECT</Button>
            </CardActions>
          </Card>
        </Zoom>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  withRouter
)(ProjectCard);