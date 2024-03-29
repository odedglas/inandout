import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';

const CategoriesIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <path d="M12 2l-5.5 9h11z"/>
      <circle cx="17.5" cy="17.5" r="4.5"/>
      <path d="M3 13.5h8v8H3z"/>
      <path fill="none" d="M0 0h24v24H0z"/>
    </SvgIcon>
  );
};

export default CategoriesIcon;