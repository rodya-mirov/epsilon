import React from 'react';

import PropTypes from 'prop-types';
import ResourcesSummary from '../resources';
import PauseButton from '../pause';

import classNames from 'classnames';
import FarmerSummary from '../farm/farmerStates';

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
      <div className={classNames('row', 'border-bottom')}>
        <div className="col-9">
          <ResourcesSummary />
        </div>
        <div className="col-3 mt-5">
          <PauseButton />
        </div>
      </div>
      <div className={classNames('row mt-4')}>
        <div className="col-7">
          <MainComponent />
        </div>
        <div className="col-5">
          {UpgradeComponent ? <UpgradeComponent /> : ''}
          <SummaryComponent />
        </div>
      </div>
    </div>
  </div>
);

export default Wrapper;
