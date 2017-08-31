import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import Todo from './Todo';
import ChangeTodoPopup from './ChangeTodoPopup';
import * as todoActions from '../../actions/TodoActions';


export class TasksList extends React.Component {
  constructor() {
    super();
    this.state = { 
      showDoneButton: false, 
      searchText: '',
      currentTodo: {},
      allCategories: [],
      isOpenModal: false,
      popoverFocus: false 
    };
    // Tasks List
    this.createAllCategoriesArray = this.createAllCategoriesArray.bind(this);
    this.filterShowTasksList = this.filterShowTasksList.bind(this);
    this.filterTodosDone = this.filterTodosDone.bind(this);
    this.filterTodosSearch = this.filterTodosSearch.bind(this); 
    this.filterTodos = this.filterTodos.bind(this);
    this.changeShowDone = this.changeShowDone.bind(this);
    this.changeSearchText = this.changeSearchText.bind(this);
    this.cleanSearchText = this.cleanSearchText.bind(this);
    this.addNewTodo = this.addNewTodo.bind(this);
    // Todo
    this.changeTodoDone = this.changeTodoDone.bind(this);
    this.changeCurrentTodo = this.changeCurrentTodo.bind(this);
    //Modal
    this.closeModal = this.closeModal.bind(this);
    this.changeTodoName = this.changeTodoName.bind(this);
    this.moveTodo = this.moveTodo.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const categoriesItems = nextProps.categories.concat();
    let allCategoriesItems = allCategoriesItems = this.createAllCategoriesArray(categoriesItems);
    
    this.setState({ allCategories: allCategoriesItems });
    if (nextProps.currentCategory.categories) {
      this.setState({ popoverFocus: true });
    } else {
      this.setState({ popoverFocus: false });
    }
  }

  // -------------------------------------------------------------------------
  // Private functions
  // -------------------------------------------------------------------------

  createAllCategoriesArray(categoriesItems) {
    let allCategoriesItems = [];

    if (categoriesItems) {
      categoriesItems.forEach(item => {
        allCategoriesItems.push(item);
        if (item.categories) {
          const array = this.createAllCategoriesArray(item.categories);
          for (const a of array) {
            allCategoriesItems.push(a);
          }
        }
      });
    }
    
    return allCategoriesItems;
  }

  filterShowTasksList() {
    let todoItems = [], filteredTodoItems = [];
    if (this.props.currentCategory.todos) {
      if (!this.state.showDoneButton && !this.state.searchText) {
        filteredTodoItems = this.filterTodos(todoItems, (todoItems, todo) => {
           todoItems.push(todo);
        });
      } else {

         if (this.state.showDoneButton) {
          filteredTodoItems = this.filterTodosDone(todoItems);
        } else {
          filteredTodoItems = this.filterTodos(todoItems, (todoItems, todo) => {
            todoItems.push(todo);
          });
        }

        if (this.state.searchText) {
          filteredTodoItems = this.filterTodosSearch(filteredTodoItems);
        }
      }
    }
    
    return filteredTodoItems;
  }

  filterTodosDone(todoItems) {
    todoItems = this.filterTodos(todoItems, (todoItems, todo) => {
      if (todo.done) {
        todoItems.push(todo);
      }
    });
    return todoItems;
  }

  filterTodosSearch(filteredTodoItems) {
    let searchText = this.state.searchText.concat(),
    newFilteredTodoItems = [],
    isFoundText;
    
    searchText = searchText.toLowerCase().split(' ');

    filteredTodoItems.forEach(todo => {
      isFoundText = true;
      searchText.forEach(text => {
        if (todo.title.toLowerCase().indexOf(text) === -1) {
          isFoundText = false;
        }
      });
      if (isFoundText) {
        newFilteredTodoItems.push(todo);  
      }
    });
    return newFilteredTodoItems;
  }

  filterTodos(todoItems, callback) {
    for (const todo of this.props.currentCategory.todos) {
      callback(todoItems, todo);
    }
    let arr = [];

    if (this.props.currentCategory.categories) {
      arr = [this.props.currentCategory.categories];
    } 

    for (const item of arr) {
      item.forEach(category => {
        if (category.todos.length) {
          category.todos.forEach(todo => {
            callback(todoItems, todo);
          });          
        }
        if (category.categories.length) {
          arr.push(category.categories);
        }
      });
    }
    return todoItems;
  }

  changeShowDone() {
    this.setState({ showDoneButton: !this.state.showDoneButton });
  }

  changeSearchText(e) {
    this.setState({ searchText: e.target.value });
  }

  cleanSearchText() {
    this.setState({ searchText: '' });
    this.refs.inputSearchText.value = '';
  }

  addNewTodo(e) {
    e.preventDefault();
    if (this.refs.inputTodoTitle.value) {
      if (this.props.currentCategory.todos) {
      const { addTodo } = this.props.todoActions;

      addTodo({
        title: this.refs.inputTodoTitle.value,
        done: false
      }); 
    }
    
    this.refs.inputTodoTitle.value = '';
    }
  }

  // -------------------------------------------------------------------------
  // Public functions (Todo component)
  // -------------------------------------------------------------------------

  changeTodoDone(todo) {
    const { changeTodoDone } = this.props.todoActions;

    changeTodoDone(todo);
  }

  changeCurrentTodo(todo) {
    this.setState({ currentTodo: todo, isOpenModal: true });
  }

  // -------------------------------------------------------------------------
  // Public functions (Change Todo Popup component)
  // -------------------------------------------------------------------------

  closeModal() {
    this.setState({ isOpenModal: false });
  }

  changeTodoName(todo, title) {
    const { changeTodoName } = this.props.todoActions;

    changeTodoName(todo, title);
  }

  moveTodo(todo, category) {
    const { moveTodo } = this.props.todoActions;

    moveTodo(todo, category);
  }


  render() {
    let filteredTodoItems = this.filterShowTasksList();
    let todoItem, todosCaption;
    const popoverFocus = (
      <Popover id='popover-trigger-focus' title=''>
        Choose the category.
      </Popover>
    );
    let inputAddTodoWithOverlay;
    const inputAddTodo = (
      <div className='input-group'>
        <input 
          type='text' 
          className='form-control' 
          placeholder='Enter todo title'
          ref='inputTodoTitle' />
        <span className='input-group-btn'>
          <button 
            className='btn btn-secondary' 
            type='submit'>
            Add
          </button>
        </span>
      </div>
    );

    if (!this.state.popoverFocus) {
      inputAddTodoWithOverlay = (
        <OverlayTrigger trigger='focus' placement='bottom' overlay={popoverFocus}>
          {inputAddTodo}
        </OverlayTrigger>
      );
    } else {
      inputAddTodoWithOverlay = inputAddTodo;
    }

    if (filteredTodoItems.length) {
      todoItem = filteredTodoItems.map((item, index) => {
      let todoClassName = item.done ? 'todo-done' : '';
      return <Todo 
          key={index}
          className={todoClassName}
          todo={item}
          changeTodoDone={this.changeTodoDone}
          changeCurrentTodo={this.changeCurrentTodo} />
      });
    } else {
      todosCaption = (
        <div className='list-group-item list-empty-todos'>
          <span className='caption-empty-todos'>
            Empty Tasks List
          </span>       
        </div>
      );
    }
    
    return <div className='col-xs-12 col-sm-8'>
      <div className='row'>

        <div className='col-xs-12 col-sm-3 show-done'>    
          <div className='form-check'>
            <label className='form-check-label' onChange={this.changeShowDone}>
              <input type='checkbox' className='form-check-input' />
              <span> Show done </span>
            </label>
          </div>
        </div>

        <div className='col-xs-12 col-sm-4'>
          <div className='input-group'>
            <input 
              type='text' 
              className='form-control' 
              placeholder='Search'
              onChange={this.changeSearchText} 
              ref='inputSearchText' />
            <span className='input-group-btn'>
              <button 
                className='btn btn-secondary' 
                type='button'
                onClick={this.cleanSearchText}>
                <span>&times;</span>
              </button>
            </span>
          </div>
        </div>

        <div className='col-xs-12 col-sm-5'>
          <form onSubmit={this.addNewTodo}>
            {inputAddTodoWithOverlay}
          </form>
        </div>

        <div className='clearfix'></div>
              
        <div className='col-xs-12'>
          <div className='tasks-list list'>
            {todosCaption}
            <div className='list-group'>
              {todoItem}
            </div>
          </div>
        </div>
      </div>

       <ChangeTodoPopup 
         todo={this.state.currentTodo}
         currentCategory={this.props.currentCategory}
         allCategories={this.state.allCategories}
         changeTodoName={this.changeTodoName}
         changeTodoDone={this.changeTodoDone}
         moveTodo={this.moveTodo}
         isOpenModal={this.state.isOpenModal}
         closeModal={this.closeModal} /> 

    </div>
  }
}

// -------------------------------------------------------------------------
// Redux methods
// -------------------------------------------------------------------------

function mapStateToProps (state) {
  return {
      categories: state.categories,
      currentCategory: state.currentCategory
  }
}

function mapDispatchToProps(dispatch) {
  return {
    todoActions: bindActionCreators(todoActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TasksList)
