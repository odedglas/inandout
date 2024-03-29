import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import UserAvatar from '@common/UserAvatar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Zoom from '@material-ui/core/Zoom';

import DynamicIcon from '@common/DynamicIcon';

import themeService from '@service/theme'
import {PROJECT_TYPES} from '@const/'

class ProjectCard extends Component {

  static propTypes = {
    project: PropTypes.object,
    users: PropTypes.array,
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

    switch (type) {
      case PROJECT_TYPES.PERSONAL.key:
        return {icon: <DynamicIcon name={'person'}/>, color: themeService.getColor('pink')};
      case PROJECT_TYPES.HOUSE_HOLD.key:
        return {icon: <DynamicIcon name={'home'}/>, color: themeService.getColor('deep orange')};
      case PROJECT_TYPES.SMALL_BUSINESS.key:
        return {icon: <DynamicIcon name={'smallBusiness'}/>, color: themeService.getColor('deep purple')};
      case PROJECT_TYPES.MEDIUM_BUSINESS.key:
        return {icon: <DynamicIcon name={'mediumBusiness'}/>, color: themeService.getColor('green')};
      default :
        return null;
    }
  };

  renderProjectCard = () => {

    const {project, users} = this.props;
    const iconMeta = this.projectIcon(project.type);

    return (
      <Card className={'project-card'} onClick={this.handleProjectClick}>
        <CardHeader
          avatar={
            <Avatar style={{'backgroundColor': iconMeta.color}}>
              {iconMeta.icon}
            </Avatar>
          }

          title={project.name}
          subheader={project.description}
        />
        <CardContent>
          <div className={'mx-3 mb-3 flex'}>
            {
              project.members.map(memberId => {
                const member = users.find(u => u.id === memberId);

                return member ? <UserAvatar user={member}
                                            key={member.id}
                                            className={'member'}
                                            size={'smallest'}/> : null;
              })
            }
          </div>
          <Typography className={'card-meta mb-2'} color="textSecondary">
            <span className={'mx-3'}> {project.identifier} </span>
          </Typography>

        </CardContent>
        <CardActions className={'flex-end'}>
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

export default connect(state => ({
  users: state.dashboard.users,
}), {})(ProjectCard)
