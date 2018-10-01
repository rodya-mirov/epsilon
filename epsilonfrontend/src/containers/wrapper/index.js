import React from 'react';

import PropTypes from 'prop-types';
import ResourcesSummary from '../resources';
import PauseButton from '../pause';

import classNames from 'classnames';

const Header = ({ title, message, }) => (
  <div className="header">
    <h1 className="mt-5">{title}</h1>
    <p>{message}</p>
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

const Wrapper = ({
  headerProps,
  MainComponent,
  UpgradeComponent = undefined,
  SummaryComponent,
}) => (
  <div className="container">
    <Header {...headerProps} />

    <div className="container">
      <div className={classNames('row')}>
        <div>
          <MainComponent />
        </div>
        <div style={{ width: '25px', }} />
        <div>
          <ResourcesSummary />
          {UpgradeComponent ? <UpgradeComponent /> : ''}
          <SummaryComponent />
        </div>
      </div>
    </div>

    <PauseButton />
  </div>
);

export default Wrapper;
