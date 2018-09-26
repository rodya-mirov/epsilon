import { TOP, BOTTOM, LEFT, RIGHT, badDirectionError, } from './directions';

/* square types */
export const EMPTY_SQUARE = 'empty';
export const MERCHANT_SQUARE = 'merchantSquare';
export const VERTICAL_STAND = 'verticalStand';
export const HORIZONTAL_STAND = 'horizontalStand';
export const CUSTOMER_PLACE = 'customerPlace';
export const STAND_EMPTY_RESERVED = 'standEmptyReserved';

/* square makers */
const makeSquare = type => ({ type, });

export const makeEmptySquare = () => makeSquare(EMPTY_SQUARE);
export const makeEmptyReservedSquare = () => makeSquare(STAND_EMPTY_RESERVED);
export const makeMerchantSquare = () => makeSquare(MERCHANT_SQUARE);
export const makeHorizontalStandSquare = () => makeSquare(HORIZONTAL_STAND);
export const makeCustomerPlaceSquare = () => makeSquare(CUSTOMER_PLACE);

/* transformers */

// rotate a square type, within a stand, based on the associated merchant's direction
const makeTypeRotator = merchantDirection => {
  switch (merchantDirection) {
  case TOP:
  case BOTTOM:
    return type => type;

  case LEFT:
  case RIGHT:
    return type => {
      switch (type) {
      case HORIZONTAL_STAND:
        return VERTICAL_STAND;

      case VERTICAL_STAND:
        return HORIZONTAL_STAND;

      default:
        return type;
      }
    };

  default:
    throw badDirectionError(merchantDirection);
  }
};

// rotate a square associated to a stand, based on the associated merchant's direction
export const makeSquareRotator = merchantDirection => {
  const typeRotator = makeTypeRotator(merchantDirection);
  return square => ({
    ...square,
    type: typeRotator(square.type),
  });
};
