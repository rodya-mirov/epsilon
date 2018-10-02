import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import { Redirect, } from 'react-router-dom';
import classNames from 'classnames';
import {
  UNPLOWED,
  PLOWED,
  PLANTED,
  READY_FOR_HARVEST,
  makeUpgrades,
} from '../../modules/farm';
import { squarePropType, gridPropType, } from './propTypes';

import './farm.css';
import FarmerSummary from './farmerStates';
import Wrapper from '../wrapper';
import UpgradeButtons from '../upgrades';

const squareToAscii = state => {
  switch (state) {
  case UNPLOWED:
    return '~';
  case PLOWED:
    return '-';
  case PLANTED:
    return 'o';
  case READY_FOR_HARVEST:
    return 't';
  default:
    throw new Error(`Unrecognized plot state ${state}`);
  }
};

const farmerAscii = () => 'f';

const Square = ({ square, isFarmer, }) => {
  const plotClass = isFarmer ? 'farmplot-farmer' : 'farmplot-' + square.state;
  return (
    <td className={classNames('farmplot', plotClass)}>
      {isFarmer ? farmerAscii() : squareToAscii(square.state)}
    </td>
  );
};

Square.propTypes = {
  square: squarePropType,
  isFarmer: PropTypes.bool,
};

const PlotGrid = ({ squares, isFarmer, }) => (
  <div className="farm rounded border-success">
    <table className="farm rounded">
      <tbody>
        {squares.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((square, colIndex) => (
              <Square
                square={square}
                isFarmer={isFarmer(rowIndex, colIndex)}
                key={colIndex}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

PlotGrid.propTypes = {
  squares: gridPropType,
  isFarmer: PropTypes.func,
};

const makeIsFarmer = (farmers, oddTick) => {
  if (oddTick) {
    return () => false;
  }
  return (row, col) =>
    farmers.some(farmer => farmer.row === row && farmer.col === col);
};

const WrappedFarm = ({
  numRows,
  numCols,
  squares,
  farmers,
  oddTick,
  isActive,
  upgrades,
}) => {
  if (!isActive) {
    return (
      <div>
        <p>Sup</p>
        <Redirect to="/" />
      </div>
    );
  }

  const ParamGrid = () => (
    <PlotGrid squares={squares} isFarmer={makeIsFarmer(farmers, oddTick)} />
  );

  const UpgradeComponent = () => (
    <UpgradeButtons header={'Upgrade your Farm'} upgrades={upgrades} />
  );

  const SummaryComponent = () => (
    <FarmerSummary farmers={farmers} squares={squares} />
  );
  return Wrapper({
    headerProps: {
      title: 'Farming is Repetitive',
      message: `Welcome to your lovely ${numCols}x${numRows} farm`,
    },
    MainComponent: ParamGrid,
    UpgradeComponent,
    SummaryComponent,
  });
};

const mapStateToProps = state => {
  const { farm, general, } = state;
  return {
    numRows: farm.numRows,
    numCols: farm.numCols,
    squares: farm.squares,
    farmers: farm.farmers,
    upgrades: makeUpgrades(farm),
    oddTick: general.ticks % 2 === 0,
    isActive: farm.isActive,
  };
};

// no actions yet
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedFarm);
