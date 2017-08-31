import React from 'react';
import { 
  Modal, 
  ButtonToolbar, 
  DropdownButton, 
  MenuItem 
} from 'react-bootstrap';


export default class categoriesPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checked: false, selectedCategory: {}, showModal: false };
    this.close = this.close.bind(this);
    this.saveEventKey = this.saveEventKey.bind(this);
    this.changeStateChecked = this.changeStateChecked.bind(this);
    this.changeSelectedCategory = this.changeSelectedCategory.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    
    this.indexOfSelectedCategory;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.todo.done !== undefined) {
      this.setState({checked: nextProps.todo.done});
    }
    if (nextProps.todo !== this.props.todo || nextProps.currentCategory !== this.props.currentCategory) {
      this.setState({selectedCategory: nextProps.currentCategory});
    }
    if (nextProps.isOpenModal) {
      this.setState({ showModal: true });
    } 
  }

  close() {
    this.setState({ showModal: false });
    this.props.closeModal();
  }

  saveEventKey(e) {
    this.indexOfSelectedCategory = e;
  }

  changeStateChecked() {
    this.setState({checked: !this.state.checked});
  }

  changeSelectedCategory(e) {
    this.props.allCategories.forEach(category => {
      if (category.title === e.target.textContent) {
        this.setState({ selectedCategory: category });
      }
    }); 
  }

  saveChanges(e) {
    e.preventDefault();
    if (this.refs.inputTodoTitle.value) {
      this.props.changeTodoName(this.props.todo, this.refs.inputTodoTitle.value);
    }
    this.refs.inputTodoTitle.value = '';
    
    if (this.state.checked !== this.props.todo.done) {
      this.props.changeTodoDone(this.props.todo);
    }

    const arrayOfFoundCategory = this.props.allCategories.filter((category, index) => {
      return index === this.indexOfSelectedCategory;
    }); 
     
    this.props.allCategories.forEach(category => {    
      if (category === arrayOfFoundCategory[0]) {
        this.props.moveTodo(this.props.todo, category);
      }
    });
    this.close();
  }

  render() {  
    let selectTitle = this.state.selectedCategory.title
      ? this.state.selectedCategory.title
      : this.props.currentCategory.title;
    if (!selectTitle) {
      selectTitle = '';
    }
    let categoryItem;

    if (this.props.allCategories.length !== 1) {
      categoryItem = this.props.allCategories.map((item, index) => {
        if (item !== this.state.selectedCategory) {
          return <MenuItem
            className='dropdown-item'
            eventKey={index}
            key={index}
            value={item.title}
            onClick={this.changeSelectedCategory}>
            {item.title}
          </MenuItem>
        }
      });
    } else {
      categoryItem = <MenuItem
        className='dropdown-item'
        eventKey={0}
        value={this.props.allCategories[0].title}
        onClick={this.changeSelectedCategory}>
        {this.props.allCategories[0].title}
      </MenuItem>
    }
    
    return <Modal className='todoModal' show={this.state.showModal} onHide={this.close}>
      <Modal.Header closeButton  onClick={this.close}>
        <Modal.Title>Change the todo-item</Modal.Title>
      </Modal.Header>

      <form onSubmit={this.saveChanges}>
        <Modal.Body>
          <input 
            type='text' 
            className='form-control todo-changes-input' 
            placeholder={this.props.todo.title}
            ref='inputTodoTitle' />

          <div className='form-check todo-changes-checkbox'>
            <label className='form-check-label'>
              <input 
                type='checkbox' 
                className='form-check-input'
                checked={this.state.checked}
                onChange={this.changeStateChecked} />
              <span> Is Done </span>
            </label>
          </div>

          <ButtonToolbar className='todo-changes-dropdown'>
            <DropdownButton 
              title={selectTitle} 
              className='select-todo-category' 
              id='dropdown-size-medium'
              onSelect={this.saveEventKey}>
              {categoryItem}
            </DropdownButton>
          </ButtonToolbar>


        </Modal.Body>

        <Modal.Footer>
          <button 
            type='submit' 
            className='btn btn-info' 
            data-dismiss='modal'>
            Save changes
          </button>
        </Modal.Footer>
      </form>

    </Modal>
  }
}
