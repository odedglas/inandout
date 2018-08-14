import React from 'react';
import Avatar from '@material-ui/core/Avatar';

const handleAvatarClick = (event, handler) => {

  handler && handler(event)
};

const UserAvatar = ({user, size, onClick, additionalClass, style, className, ...rest}) => {

  if(!user) return null;

  const avatarBackground = {
    'backgroundColor': user.avatarColor
  };
  const hasAvatarImage = user.avatarImage;
  size = size ? size : 'medium';

  style = {...(!hasAvatarImage ? avatarBackground : {} ), ...(style || {} )};
  className = `avatar ${size} ${additionalClass ? additionalClass : ''} ${className ? className : ''}`;

  return (
    <Avatar className={className}
            style={style}
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
