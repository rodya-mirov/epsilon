import { actions as toastrActions, } from 'react-redux-toastr';

export const warn = ({ title = 'Warning', text = 'Something went wrong', }) => {
  return toastrActions.add({
    type: 'warning',
    title,
    attention: true, // This will add a shadow like the confirm method.
    message: text,
  });
};
