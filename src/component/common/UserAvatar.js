import React from 'react';
import Avatar from '@material-ui/core/Avatar';

const handleAvatarClick = (event, handler) => {

  handler && handler(event)
};

const UserAvatar = ({user, size, onClick, additionalClass, ...rest}) => {

  const avatarBackground = {
    'backgroundColor': user.avatarColor
  };
  size = size ? size : 'medium';

  return (
    <Avatar className={`avatar ${size} ${additionalClass ? additionalClass : ''}`}
            style={avatarBackground}
            {...rest}
            onClick={(e) => handleAvatarClick(e, onClick)}>
      {
        user.avatarImage ?
          <img className={'h-100'} alt={'user-profile'} src={user.avatarImage}/>
          :
          user.initials
      }
    </Avatar>)
};

export default UserAvatar;