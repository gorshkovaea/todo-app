import React from 'react';
import { Modal } from 'react-bootstrap';


export default class categoriesPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
    this.close = this.close.bind(this);
    this.createSubcategory = this.createSubcategory.bind(this);
    this.changeCategoryName = this.changeCategoryName.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpenModal) {
      this.setState({ showModal: true });
    } 
  }

  close() {
    this.setState({ showModal: false });
    this.props.closeModal();
  }

  createSubcategory(e) {
    e.preventDefault();
    this.props.addSubcategory(
    {
      title: this.refs.inputSubcategoryTitle.value,
      categories: [],
      todos: []
    });
    this.refs.inputSubcategoryTitle.value = '';
    this.close();
  }

  changeCategoryName(e) {
    e.preventDefault();
    this.props.changeCategoryName(this.refs.inputSubcategoryTitle.value);
    
    this.refs.inputSubcategoryTitle.value = '';
    this.close();
  }

  render() {
    let header, placeholder, func;
    if (this.props.isPopupForChanges === true) {
      header = 'Change subcategory name';
      placeholder = this.props.currentCategory.title;
      func = this.changeCategoryName;
    } else {
      header = 'Add subcategory';
      placeholder = 'Enter subcategory title';
      func = this.createSubcategory;
    }

    return <Modal
      className='categoryModal' 
      show={this.state.showModal} 
      onHide={this.close} >

      <Modal.Header closeButton onClick={this.close}>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>

      <form onSubmit={func}>
        <Modal.Body>
          <input 
            autoFocus
            type='text' 
            className='form-control category-changes-input' 
            placeholder={placeholder}
            ref='inputSubcategoryTitle'/>
        </Modal.Body>
         
        <Modal.Footer>
          <button 
            type='submit' 
            className='btn btn-info'>
            Save changes
          </button>
        </Modal.Footer>
      </form>

    </Modal>
  }
}
