import React from 'react';
import DynamicIcon from "@common/DynamicIcon";

const PageTitle = ({ text, icon, ...iconProps}) => (
  <div className={'row mb-2'}>
    <div className={'page-title'}>
      <DynamicIcon name={icon} {...iconProps}/>
      <span className={'mx-3 text'}> {text} </span>
    </div>
  </div>
);

export default PageTitle;