import React from 'react';


export default class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.changeTodoDone = this.changeTodoDone.bind(this);
    this.changeCurrentTodo = this.changeCurrentTodo.bind(this);
  }

  changeTodoDone() {
    this.props.changeTodoDone(this.props.todo);
  }

  changeCurrentTodo(e) {
    e.stopPropagation();
    this.props.changeCurrentTodo(this.props.todo);
  }

  render() {
    let todoClassName = this.props.className + ' list-group-item todo-list-group-item';
    let checked = this.props.todo.done ? true : false;
      return <div className={todoClassName}>
      <div className='content-of-todo-item'>
        <div className='form-check'>
          <input 
            type='checkbox' 
            className='form-check-input'
            checked={checked}
            onChange={this.changeTodoDone} />
        </div>
      </div>
      <div className='form-check-label'>
        <span className='todo-title' onClick={this.changeTodoDone}> 
          {this.props.todo.title} 
        </span>
      </div>
      <div>
        <div 
          className='glyphicon glyphicon-edit'
          onClick={this.changeCurrentTodo}>
        </div>
      </div>
    </div>
  }
}
