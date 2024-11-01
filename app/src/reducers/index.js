import { combineReducers } from 'redux';
import posts from './posts';
import categories from './categories';
import users from './users';

export default combineReducers({
  posts,
  categories,
  users
});
