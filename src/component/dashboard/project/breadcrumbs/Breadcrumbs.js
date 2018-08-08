import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';
import UserAvatar from '@common/UserAvatar';
import Tooltip from '@material-ui/core/Tooltip';
import util from '@util/'
import DynamicIcon from "@common/DynamicIcon";

class Breadcrumbs extends Component {

  static propTypes = {
    breadcrumbs: PropTypes.array.isRequired,
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

  handleItemClick = (item) => {

    !item.render && this.props.history.push(item.path)
  };

  handleMembersMenuStateChange = show => {
    this.setState({
      membersMenuOpen: show
    })
  };

  render() {

    const {breadcrumbs, projectOwner} = this.props;
    const {members, membersMenuOpen} = this.state;
    const length = breadcrumbs.length;

    const moreThanOneMember = members.length > 1;
    const membersMenuWidth = membersMenuOpen ? ((members.length * 30) + 16) : 0;
    const menuStyle = {
      width: `${membersMenuWidth}px`,
      transform: `translate(-${membersMenuWidth}px)`
    };

    return (
      <div className={'breadcrumbs px-4'}>

        {breadcrumbs.map((breadcrumb, i) => {

          const isSingle = length === 1;
          const isLast = i === length - 1;
          const isEmpty = util.isUndefined(breadcrumb.value);

          const breadcrumbItemClassList = `breadcrumb ${isLast ? 'active' : ''} ${isSingle ? 'single' : ''} ${isEmpty ?
            'empty' : ''}`;

          return (
            <div className={'breadcrumb-holder'} key={breadcrumb.id}>
              <div className={breadcrumbItemClassList} onClick={() => !isLast && this.handleItemClick(breadcrumb)}>
                {!breadcrumb.render ? breadcrumb.value : breadcrumb.render(breadcrumb.value)}
              </div>
              {!isLast ? <span className={'divider mx-2'}> / </span> : null}
            </div>
          )
        })}

        <div className={'flex'}></div>
        <div className={'project-members'}
             onMouseLeave={() => this.handleMembersMenuStateChange(false)}
             onMouseEnter={() => this.handleMembersMenuStateChange(true)}>


          <DynamicIcon className={'icon'} name={'projectMembers'}/>

          <div className={`members-menu-holder ${membersMenuOpen ? 'open' : ''}`} style={menuStyle}>
            {moreThanOneMember && members.reverse().map(member => <Tooltip key={member.id}
                                                                           title={`Project ${projectOwner === member.id ?
                                                                             'Owner' :
                                                                             'Member'}: ${member.displayName}`}>
                <UserAvatar user={member}
                            className={'member'}
                            size={'smallest'}/>
              </Tooltip>
            )}
          </div>

        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    breadcrumbs: state.breadcrumbs,
    users: state.dashboard.users,
    projectOwner: state.project.selectedProject.owner,
    projectMembers: state.project.members,
  }), {})
)(Breadcrumbs);
