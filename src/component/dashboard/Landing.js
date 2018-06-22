import React from 'react';


class Landing extends React.Component {

  render () {

    const landingHeaderBackground = {
      'background-image': `url('${require('@img/dashboard-header.jpg')}')`,
    };

    return (
      <div className={'lading-page h-100'}  style={landingHeaderBackground}>
        <div className={'landing-header'}>
          <div className={'landing-text'}>
            <h2> Welcome to In&Out !</h2>
            <span>Create a project and start managing your income / outcome.</span>
            <br/>
            <span>Stay in control.</span>
          </div>
          <div className={'triangle'}>
          </div>
        </div>
        <div className={'projects-container'}>
          <div> Projects goes here </div>
          <div className={'projects-inner'}></div>
        </div>
      </div>
    );
  }
}

export default Landing;
