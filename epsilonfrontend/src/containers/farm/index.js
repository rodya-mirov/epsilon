import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';
import classNames from 'classnames';
import {
  UNPLOWED,
  PLOWED,
  PLANTED,
  READY_FOR_HARVEST,
} from '../../modules/farm';

const squarePropType = PropTypes.shape({
  state: PropTypes.string,
});

const gridPropType = PropTypes.arrayOf(PropTypes.arrayOf(squarePropType));

const squareToAscii = state => {
  switch (state) {
  case UNPLOWED:
    return '~';
  case PLOWED:
    return '-';
  case PLANTED:
    return '.';
  case READY_FOR_HARVEST:
    return 't';
  default:
    return '?';
  }
};

const Square = ({ square, }) => (
  <td className={classNames('farmplot', 'farmplot-' + square.state)}>
    {squareToAscii(square.state)}
  </td>
);
Square.propTypes = {
  square: squarePropType,
};

const PlotGrid = ({ squares, }) => (
  <div className="farm">
    <table className="farm">
      <tbody>
        {squares.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((square, colIndex) => (
              <Square square={square} key={colIndex} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

PlotGrid.propTypes = {
  squares: gridPropType,
};

const Farm = props => {
  return (
    <div>
      <h1>Farming is Repetitive</h1>

      <p>
        Welcome to your lovely {props.numRows.toString()}x
        {props.numCols.toString()} farm.
      </p>

      <PlotGrid squares={props.squares} />
    </div>
  );
};

Farm.propTypes = {
  numRows: PropTypes.number,
  numCols: PropTypes.number,
  squares: gridPropType,
};

const mapStateToProps = ({ farm, }) => {
  return {
    numRows: farm.numRows,
    numCols: farm.numCols,
    squares: farm.squares,
  };
};

// currently no actions
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Farm);
