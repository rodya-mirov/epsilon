export const WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER';
export const BARTERING = 'BARTERING';
export const ACCOUNTING = 'ACCOUNTING';

const timeLeftMap = {
  WAITING_FOR_CUSTOMER: 30,
  BARTERING: 10,
  ACCOUNTING: 20,
};

const descriptionMap = {
  WAITING_FOR_CUSTOMER: 'waiting for a customer to arrive',
  BARTERING: 'bartering with a customer',
  ACCOUNTING: 'tallying up',
};

const nextStateMap = {
  WAITING_FOR_CUSTOMER: BARTERING,
  BARTERING: ACCOUNTING,
  ACCOUNTING: WAITING_FOR_CUSTOMER,
};

const mapToFunc = (obj, methodDescription) => state => {
  const out = obj[state];
  if (out) {
    return out;
  }

  throw new Error(
    `Unrecognized merchant state '${state}' when processing '${methodDescription}`
  );
};

export const getStateLength = mapToFunc(timeLeftMap, 'length of state');
export const getMerchantDescription = mapToFunc(
  descriptionMap,
  'description of merchant state'
);

export const getNextState = mapToFunc(nextStateMap, 'next state');
