import React from 'react';

import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';
import classNames from 'classnames';

import {
  EMPTY_SQUARE,
  MERCHANT_SQUARE,
  VERTICAL_STAND,
  HORIZONTAL_STAND,
  CUSTOMER_PLACE,
  STAND_EMPTY_RESERVED,
} from '../../modules/market/squares';

import './market.css';

const makeSquareSymbol = ({ type, }) => {
  switch (type) {
  case EMPTY_SQUARE:
  case STAND_EMPTY_RESERVED:
  case CUSTOMER_PLACE:
    return '~';

  case VERTICAL_STAND:
    return '\u2016';

  case HORIZONTAL_STAND:
    return '═';

  case MERCHANT_SQUARE:
    return 'm';

  default:
    throw new Error(`Unrecognized market square type ${type}`);
  }
};

const makeSquareClass = ({ type, }) => {
  switch (type) {
  case EMPTY_SQUARE:
  case STAND_EMPTY_RESERVED:
  case CUSTOMER_PLACE:
    return 'marketplot-empty';

  case VERTICAL_STAND:
  case HORIZONTAL_STAND:
    return 'marketplot-stand';

  case MERCHANT_SQUARE:
    return 'marketplot-merchant';

  default:
    throw new Error(`Unrecognized market square type ${type}`);
  }
};

const makeDisplaySquare = stateSquare => ({
  symbol: makeSquareSymbol(stateSquare),
  squareClass: makeSquareClass(stateSquare),
});

const squarePropType = {
  symbol: PropTypes.string,
  squareClass: PropTypes.string,
};

const squaresPropType = ImmutablePropTypes.listOf(
  ImmutablePropTypes.listOf(PropTypes.shape(squarePropType))
);

const MarketGrid = ({ squares, }) => (
  <div className="market rounded border">
    <table className="farm rounded">
      <tbody>
        {squares.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((square, colIndex) => (
              <td
                key={colIndex}
                className={classNames(square.squareClass, 'marketplot')}
              >
                {square.symbol}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

MarketGrid.propTypes = {
  squares: squaresPropType,
};

const Market = ({ numRows, numCols, squares, }) => (
  <div className="container">
    <h1 className="mt-5">Buying and Selling</h1>

    <p>
      Taking your goods to the {numRows}x{numCols} market.
    </p>

    <MarketGrid squares={squares} />
  </div>
);

Market.propTypes = {
  numRows: PropTypes.number,
  numCols: PropTypes.number,
  squares: squaresPropType,
};

const makeSquares = ({ squares, }) =>
  squares.map(row => row.map(makeDisplaySquare));

const mapStateToProps = ({ market, }) => ({
  numRows: market.numRows,
  numCols: market.numCols,
  squares: makeSquares(market),
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Market);
