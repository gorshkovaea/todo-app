import { TODO_ACTIONS_TYPES } from '../constants/actions-types';


export function addTodo(todo) {
  return {
    type: TODO_ACTIONS_TYPES.addTodo,
    todo
  }
}

export function changeTodoName(todo, newTitle) {
  return {
    type: TODO_ACTIONS_TYPES.changeTodoName,
    todo,
    newTitle
  }
}

export function changeTodoDone(todo) {
  return {
    type: TODO_ACTIONS_TYPES.changeTodoDone,
    todo
  }
}

export function moveTodo(todo, category) {
  return {
    type: TODO_ACTIONS_TYPES.moveTodo,
    todo: todo,
    category: category
  }
}
