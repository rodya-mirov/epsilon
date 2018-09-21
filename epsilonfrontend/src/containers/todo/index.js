import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, } from 'redux';
import { connect, } from 'react-redux';

const itemType = {
  title: PropTypes.string,
  text: PropTypes.string,
};

const listType = {
  items: PropTypes.arrayOf(PropTypes.shape(itemType)),
};

const ListItem = ({ title, text, }) => (
  <p>
    <b>{title}: </b>
    {text}
  </p>
);

ListItem.propTypes = itemType;

const TodoList = ({ items, }) => {
  return (
    <div>
      {items.map((item, index) => (
        <ListItem key={index} {...item} />
      ))}
    </div>
  );
};

TodoList.propTypes = listType;

const mapStateToProps = ({ todo, }) => {
  return {
    items: todo.items,
  };
};

// currently no actions
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList);
