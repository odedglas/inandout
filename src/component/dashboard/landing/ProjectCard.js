import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Zoom from '@material-ui/core/Zoom';

import PersonIcon from '@material-ui/icons/Person';
import SmallBusinessIcon from '@material-ui/icons/LocalGroceryStore';
import MediumBusinessIcon from '@material-ui/icons/LocalMall';
import HomeIcon from '@material-ui/icons/Home';

import themeService from '@service/theme'
import { PROJECT_TYPES } from '@const/'

class ProjectCard extends Component {

  static propTypes = {
    project: PropTypes.object.isRequired,
    onProjectClick: PropTypes.func.isRequired,
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

  handleProjectClick = () => {

    let project = this.props.project;

    this.props.onProjectClick(project);
  };

  projectIcon = type => {

    switch(type) {
      case PROJECT_TYPES.PERSONAL.key:
        return {icon: <PersonIcon/>, color: themeService.getColor('pink') };
      case PROJECT_TYPES.HOUSE_HOLD.key:
        return {icon: <HomeIcon/>, color: themeService.getColor('deep orange') };
      case PROJECT_TYPES.SMALL_BUSINESS.key:
        return {icon: <SmallBusinessIcon/>, color: themeService.getColor('deep purple') };
      case PROJECT_TYPES.MEDIUM_BUSINESS.key:
        return {icon: <MediumBusinessIcon/>, color: themeService.getColor('green') };
      default :
        return null;
    }
  };

  renderProjectCard = () => {

    const {project} = this.props;
    const iconMeta = this.projectIcon(project.type);
    return (
      <Card className={'project-card'}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" style={{'backgroundColor': iconMeta.color}}>
              {iconMeta.icon}
            </Avatar>
          }

          title={project.name}
          subheader={project.description}
        />
        <CardContent>
          <Typography className={'card-meta mb-2'} color="textSecondary">
            <span className={'mx-3'}> {project.identifier} </span>
          </Typography>

        </CardContent>
        <CardActions>
          <Button size="small"
                  color={'primary'}
                  onClick={this.handleProjectClick}>VIEW PROJECT</Button>
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

export default ProjectCard;