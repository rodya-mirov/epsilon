import { List, } from 'immutable';

const makeEmptyObject = () => Object();

/**
 *
 * @param {number} rows Number of rows in the grid
 * @param {number} cols Number of columns in the grid
 * @param {func(rowInd, colInd) -> thing} makeBlank Function which makes the elements of the grid
 * @returns An array of size rows, with elements array of size cols, with elements the output of makeElement
 */
export const makeArrayGrid = (rows, cols, makeElement = makeEmptyObject) =>
  Array(rows)
    .fill()
    .map((row, rowInd) =>
      Array(cols)
        .fill()
        .map((elt, colInd) => makeElement(rowInd, colInd))
    );

export const arrayGridToImmutable = arrayGrid =>
  List(arrayGrid).map(row => List(row));

// TODO unit tests
export const toEnglishList = (strings, emptyListDescription = '') => {
  const length = strings.length;

  if (length === 0) {
    return emptyListDescription;
  } else if (length === 1) {
    return strings[0];
  } else if (length === 2) {
    return `${strings[0]} and ${strings[1]}`;
  } else {
    return `${strings.slice(0, length - 1).join(', ')}, and ${
      strings[length - 1]
    }`;
  }
};
