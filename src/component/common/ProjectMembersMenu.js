import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import UserAvatar from '@common/UserAvatar';
import Tooltip from '@material-ui/core/Tooltip';
import util from '@util/'
import DynamicIcon from "@common/DynamicIcon";

class ProjectMembersMenu extends Component {

  static propTypes = {
    users: PropTypes.array,
    projectMembers: PropTypes.array,
    projectOwner: PropTypes.string,
  };

  state = {
    membersMenuOpen: false,
    members: []
  };

  static getDerivedStateFromProps(props, state) {

    if (props.projectMembers) {
      const usersMap = props.users ? util.toIdsMap(props.users) : [];
      return {
        members: props.projectMembers.map(m => usersMap[m])
      }
    }

    return null;
  }

  handleMembersMenuStateChange = show => {
    this.setState({
      membersMenuOpen: show
    })
  };

  render() {

    const {projectOwner} = this.props;
    const {members, membersMenuOpen} = this.state;

    const moreThanOneMember = members.length > 1;
    const membersMenuWidth = membersMenuOpen ? ((members.length * 30) + 16) : 0;
    const menuStyle = {
      width: `${membersMenuWidth}px`,
      transform: `translate(-${membersMenuWidth}px)`
    };

    return (
      moreThanOneMember ? <div className={'project-members'}
                               onMouseLeave={() => this.handleMembersMenuStateChange(false)}
                               onMouseEnter={() => this.handleMembersMenuStateChange(true)}>


        <DynamicIcon className={'icon'} name={'projectMembers'}/>

        <div className={`members-menu-holder ${membersMenuOpen ? 'open' : ''}`} style={menuStyle}>
          {members.reverse().map(member => <Tooltip key={member.id}
                                                    title={`Project ${projectOwner === member.id ?
                                                      'Owner' :
                                                      'Member'}: ${member.displayName}`}>
              <UserAvatar user={member}
                          className={'member'}
                          size={'smallest'}/>
            </Tooltip>
          )}
        </div>

      </div> : null
    )
  }
}

export default connect(state => ({
  breadcrumbs: state.breadcrumbs,
  users: state.dashboard.users,
  projectOwner: state.project.selectedProject.owner,
  projectMembers: state.project.members,
}), {})(ProjectMembersMenu);

