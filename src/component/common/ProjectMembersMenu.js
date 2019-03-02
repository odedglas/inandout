import React, {Component} from 'react';

import UserAvatar from '@common/UserAvatar';
import Tooltip from '@material-ui/core/Tooltip';
import DynamicIcon from "@common/DynamicIcon";
import {ProjectContext} from '../dashboard/project/ProjectContext';

class ProjectMembersMenu extends Component {

  state = {
    membersMenuOpen: false,
  };

  handleMembersMenuStateChange = show => {
    this.setState({
      membersMenuOpen: show
    })
  };

  render() {

    return (
      <ProjectContext.Consumer>
        {(projectContext) => {

          const {project, members} = projectContext;
          const {membersMenuOpen} = this.state;

          const moreThanOneMember = members.length > 1;
          const membersMenuWidth = membersMenuOpen ? ((members.length * 30) + 16) : 0;
          const menuStyle = {
            width: `${membersMenuWidth}px`,
            transform: `translate(-${membersMenuWidth}px)`
          };

          const _members = [...members.filter(m => m)].reverse();

          return (
            moreThanOneMember ? <div className={'project-members'}
                                     onMouseLeave={() => this.handleMembersMenuStateChange(false)}
                                     onMouseEnter={() => this.handleMembersMenuStateChange(true)}>


              <DynamicIcon className={'icon'} name={'projectMembers'}/>

              <div className={`members-menu-holder ${membersMenuOpen ? 'open' : ''}`} style={menuStyle}>
                {_members.map(member => <Tooltip key={member.id}
                                                          title={`Project ${project.owner.id === member.id ?
                                                            'Owner' :
                                                            'Member'}: ${member.displayName}`}>
                    <UserAvatar user={member}
                                className={'member'}
                                size={'smallest'}/>
                  </Tooltip>
                )}
              </div>

            </div> : null
          );
        }}
      </ProjectContext.Consumer>
    )
  }
}

export default ProjectMembersMenu;

