const makeTodoItem = (title, text) => ({
  title,
  text,
});

const initialState = {
  items: [
    makeTodoItem('Update loop', 'some things need to change periodically'),
    makeTodoItem('Farmers', 'little farmers should run around the field'),
    makeTodoItem('Modals', 'little popups would be nice'),
    makeTodoItem(
      'Main div',
      'We need a main div with some master styling so this looks like an app'
    ),
  ],
};

export default (state = initialState, action) => {
  switch (action.type) {
  default:
    return state;
  }
};
