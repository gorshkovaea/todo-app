import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Category from './Category';
import CategoriesPopup from './CategoriesPopup';
import * as categoriesActions from '../../actions/CategoriesActions';


export class CategoriesTree extends React.Component {
  constructor() {
    super();
    this.state = { 
      currentCategoriesForShowInside: [], 
      isPopupForChanges: undefined,
      isOpenModal: false
    };
    // Categories Tree
    this.filterShowCategoriesTree = this.filterShowCategoriesTree.bind(this);
    this.createAllCategoriesItemsArray = this.createAllCategoriesItemsArray.bind(this);
    this.addCategory = this.addCategory.bind(this);
    // Category
    this.changeCurrentCategory = this.changeCurrentCategory.bind(this);
    this.toggleShowSubcategories = this.toggleShowSubcategories.bind(this);
    this.neededForChangeCategoryName = this.neededForChangeCategoryName.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.neededForAddSubcategory = this.neededForAddSubcategory.bind(this);
    // Modal
    this.addSubcategory = this.addSubcategory.bind(this);
    this.changeCategoryName = this.changeCategoryName.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  // -------------------------------------------------------------------------
  // Private functions
  // -------------------------------------------------------------------------

  filterShowCategoriesTree() {
    let categoriesItems = this.props.categories.concat(),
    count = 0,
    allCategoriesItems = this.createAllCategoriesItemsArray(categoriesItems, count);

    return allCategoriesItems;
  }

  createAllCategoriesItemsArray(categoriesItems, count) {
    let allCategoriesItems = [];

    if (categoriesItems) {
      categoriesItems.forEach(item => {
        if (item.className === 'item') {
          count = 0;        
        } else {
          if (count === 5) {
            count = 4;
          }
          item.className = `item${count}`; 
        }
        allCategoriesItems.push(item);

        this.state.currentCategoriesForShowInside.forEach(currentCategory => {
          if (item === currentCategory) {
             const array = this.createAllCategoriesItemsArray(item.categories, count+1);
             for (const category of array) {
               allCategoriesItems.push(category);
             }
          }
        });   
      });
    }
    
    return allCategoriesItems;
  }
    
  addCategory(e) {
    e.preventDefault();
    if (this.refs.inputCategoryTitle.value) {
      const category = { 
      categories: [],
      className: 'item',
      title: this.refs.inputCategoryTitle.value,
      todos: [],
    };
    const { addCategory } = this.props.categoriesActions;
            
    addCategory(category);
    this.refs.inputCategoryTitle.value = '';
    }
  }

  // -------------------------------------------------------------------------
  // Public functions (Category component)
  // -------------------------------------------------------------------------

  changeCurrentCategory(category) {
    const { changeCurrentCategory } = this.props.categoriesActions;
    
    changeCurrentCategory(category);
  }

  toggleShowSubcategories(clickedCategory) {
    let index = this.state.currentCategoriesForShowInside.findIndex(category => {
      return category === clickedCategory;
    });

    if (index !== -1) {
      this.state.currentCategoriesForShowInside.splice(index, 1);
      let arr = [clickedCategory.categories];

      for (const item of arr) {
        item.forEach(category => {
          index = this.state.currentCategoriesForShowInside.findIndex(openCategory => {
            return openCategory === category;
          });
          if (index !== -1) {
            this.state.currentCategoriesForShowInside.splice(index, 1);
          }

          if (category.categories.length) {
            arr.push(category.categories);
          }
        });
      }
    } else {
      this.state.currentCategoriesForShowInside.push(clickedCategory);
    }
    this.setState({ 
      currentCategoriesForShowInside: this.state.currentCategoriesForShowInside
    });
  }

  neededForChangeCategoryName() {
    this.setState({ isPopupForChanges: true, isOpenModal: true });
  }

  deleteCategory(category) {
    let newState = { ...this.state },
    index = this.state.currentCategoriesForShowInside.findIndex(cat => {
      return cat === category;
    });

    if (index !== -1) {
      newState.currentCategoriesForShowInside.splice(index, 1);
      let arr = [category.categories];

      for (const item of arr) {
        item.forEach(category => {
          index = newState.currentCategoriesForShowInside.findIndex(openCategory => {
            return openCategory === category;
          });
          if (index !== -1) {
            newState.currentCategoriesForShowInside.splice(index, 1);
          }
        });
      }
    }
    this.setState({ 
      currentCategoriesForShowInside: newState.currentCategoriesForShowInside
    });
    const { deleteCategory }  = this.props.categoriesActions;

    deleteCategory(category);
  }

  neededForAddSubcategory() {
    this.setState({ isPopupForChanges: false, isOpenModal: true });
  }

  // -------------------------------------------------------------------------
  // Public functions (Categories Popup component)
  // -------------------------------------------------------------------------

  addSubcategory(subcategory) {
    if (subcategory.title) {
      const addSubcategory  = this.props.categoriesActions.addSubcategory;

      addSubcategory({ 
        categories: [],
        title: subcategory.title,
        todos: [],
        className: ''
      });
    
      let index = this.state.currentCategoriesForShowInside.findIndex(category => {
        return category === this.props.currentCategory;
      });
      if (index === -1) {
        this.setState({ 
          currentCategoriesForShowInside: [ 
            ...this.state.currentCategoriesForShowInside,
            this.props.currentCategory 
          ]
        });
      }
    }
  }

  changeCategoryName(newValue) {
    const { changeCategoryName } = this.props.categoriesActions;

    changeCategoryName(newValue);
  }

  closeModal() {
    this.setState({ isOpenModal: false });
  }

  render() {
    const categoriesItems = this.filterShowCategoriesTree();
    let categoryItem, categoryCaption;

    if (categoriesItems.length) {
      categoryItem = categoriesItems.map((item, index) => {
        const categoryClassName = (item === this.props.currentCategory)
          ? `${item.className} selected-category`
          : `${item.className}`;
        return <Category 
            key={index}
            className={categoryClassName}
            category={item}
            currentCategoriesForShowInside={this.state.currentCategoriesForShowInside}
            toggleShowSubcategories={this.toggleShowSubcategories}
            changeCurrentCategoryForAddSubcategory={this.neededForAddSubcategory}
            deleteCategory={this.deleteCategory}
            changeCategoryName={this.neededForChangeCategoryName} 
            changeCurrentCategory={this.changeCurrentCategory}/>
      });
    } else {
      categoryCaption = (
        <div className='list-group-item list-empty-categories'>
          <span className='caption-empty-categories'>
            Empty Categories Tree
          </span>       
        </div>
      );
    }
    
    return <div className='col-xs-12 col-sm-4'>
      <div className='row'>
        <div className='col-xs-12'>
          <form onSubmit={this.addCategory}>
            <div className='input-group'>
              <input 
                type='text' 
                className='form-control' 
                placeholder='Enter category title' 
                ref='inputCategoryTitle' />
              <span 
                className='input-group-btn'>
                <button className='btn btn-secondary' type='submit'>Add</button>
              </span>
            </div>
          </form>
        </div>

        <div className='clearfix'></div>

        <div className='col-xs-12'>
          <div className='categories-tree list'>
            {categoryCaption}
              <div className='list-group'>
                {categoryItem}                
              </div> 
            </div>
          </div>
        </div>

        <CategoriesPopup 
          currentCategory={this.props.currentCategory}
          isPopupForChanges={this.state.isPopupForChanges}
          isOpenModal={this.state.isOpenModal}
          changeCategoryName={this.changeCategoryName}
          addSubcategory={this.addSubcategory}
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
    categoriesActions: bindActionCreators(categoriesActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesTree)
