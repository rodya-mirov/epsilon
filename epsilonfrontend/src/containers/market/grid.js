import React from 'react';
import { connect, } from 'react-redux';
import { bindActionCreators, } from 'redux';

import { List, } from 'immutable';
import classNames from 'classnames';

import {
  EMPTY_SQUARE,
  MERCHANT_SQUARE,
  VERTICAL_STAND,
  HORIZONTAL_STAND,
  CUSTOMER_PLACE,
  STAND_EMPTY_RESERVED,
} from '../../modules/market/squares';

import {
  BARTERING,
  ACCOUNTING,
  WAITING_FOR_CUSTOMER,
  getCustomerPlace,
  getAccountingObjectPlace,
} from '../../modules/market/merchantState';

import { squaresPropType, } from './propTypes';

const PEDESTRIAN = 'PEDESTRIAN';
const CUSTOMER_BARTERING = 'CUSTOMER_BARTERING';
const ACCOUNTING_OBJECT = 'ACCOUNTING_OBJECT'; // visual noise for accounting

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

  case CUSTOMER_BARTERING:
  case PEDESTRIAN:
    return 'c';

  case ACCOUNTING_OBJECT:
    return '&';

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

  case CUSTOMER_BARTERING:
    return 'marketplot-customer-bartering';

  case PEDESTRIAN:
    return 'marketplot-pedestrian';

  case ACCOUNTING_OBJECT:
    return 'marketplot-accounting-object';

  default:
    throw new Error(`Unrecognized market square type ${type}`);
  }
};

const makeDisplaySquare = stateSquare => ({
  symbol: makeSquareSymbol(stateSquare),
  squareClass: makeSquareClass(stateSquare),
});

const barteringSquareOverrides = ({ merchantStand, }) => {
  const { row, col, } = getCustomerPlace({ merchantStand, });

  return List.of({
    square: {
      type: CUSTOMER_BARTERING,
    },
    row,
    col,
  });
};

const accountingSquareOverrides = ({ merchantStand, }) => {
  const { row, col, } = getAccountingObjectPlace({ merchantStand, });
  return List.of({
    square: {
      type: ACCOUNTING_OBJECT,
    },
    row,
    col,
  });
};

const makeSquareOverrides = ({ merchantStand, }) => {
  switch (merchantStand.state) {
  case BARTERING:
    return barteringSquareOverrides({ merchantStand, });

  case ACCOUNTING:
    return accountingSquareOverrides({ merchantStand, });

  case WAITING_FOR_CUSTOMER:
    return List();

  default:
    throw new Error(`Unrecognized merchant state ${merchantStand.state}`);
  }
};

const makeSquares = ({ squares, merchantStands, pedestrians, }) => {
  let simpleSquares = squares;

  for (const merchantStand of merchantStands) {
    for (const override of makeSquareOverrides({ merchantStand, })) {
      const { row: rowInd, col: colInd, square, } = override;
      simpleSquares = simpleSquares.update(rowInd, row =>
        row.update(colInd, () => square)
      );
    }
  }

  for (const { row: rowInd, col: colInd, } of pedestrians) {
    simpleSquares = simpleSquares.update(rowInd, row =>
      row.update(colInd, () => ({ type: PEDESTRIAN, }))
    );
  }

  return simpleSquares.map(row => row.map(makeDisplaySquare));
};

const MarketGrid = ({ squares, merchantStands, pedestrians, }) => {
  const processedSquares = makeSquares({
    squares,
    merchantStands,
    pedestrians,
  });

  return (
    <div className="market rounded border-success">
      <table className="market rounded">
        <tbody>
          {processedSquares.map((row, rowIndex) => (
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
};

MarketGrid.propTypes = {
  squares: squaresPropType,
};

const mapStateToProps = ({ market, }) => ({
  squares: market.squares,
  merchantStands: market.merchantStands,
  pedestrians: market.pedestrians,
});

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketGrid);
