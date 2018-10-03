import React from 'react';

import PropTypes from 'prop-types';
import ResourcesSummary from '../resources';
import PauseButton from '../pause';

import classNames from 'classnames';

const Header = ({ title, message, }) => (
  <div className="header">
    <h1 className="mt-3">{title}</h1>
    <div>{message}</div>
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

const Wrapper = ({ headerProps, MainComponent, RhsComponents, }) => (
  <div className="container">
    <Header {...headerProps} />

    <div className="container">
      <div className={classNames('row', 'border', 'mt-1')}>
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
          {RhsComponents.map((RhsComponent, compInd) => (
            <RhsComponent key={compInd} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Wrapper;
