import React from 'react';


export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this.changeCurrentCategory = this.changeCurrentCategory.bind(this);
    this.setCurrentCategoryForShowSubcategories = this.setCurrentCategoryForShowSubcategories.bind(this);
    this.setCurrentCategoryForUpdate = this.setCurrentCategoryForUpdate.bind(this);
    this.changeCategoryName = this.changeCategoryName.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
  }

  changeCurrentCategory() {
    this.props.changeCurrentCategory(this.props.category);
  }

  setCurrentCategoryForShowSubcategories() {
    this.props.toggleShowSubcategories(this.props.category);
  }

  changeCategoryName() {
    this.props.changeCategoryName(this.props.category);
  }

  setCurrentCategoryForUpdate() {
    this.props.changeCurrentCategoryForAddSubcategory();
  }

  deleteCategory(e) {
    e.stopPropagation();
    this.props.deleteCategory(this.props.category);
  }

  render() {
    let upDownIconClass = false, 
    categoryClassName = this.props.className + ' list-group-item category-list-group-item';

    this.props.currentCategoriesForShowInside.forEach(category => {
      if (this.props.category === category) {
        upDownIconClass = true;
      }
    });
    upDownIconClass
      ? upDownIconClass = 'glyphicon glyphicon-chevron-up'
      : upDownIconClass = 'glyphicon glyphicon-chevron-down';
    
    return <div 
      className={categoryClassName} 
      onClick={this.changeCurrentCategory} >
      <div className='category-arrow-icon'>
        <span 
          className={upDownIconClass} 
          onClick={this.setCurrentCategoryForShowSubcategories}>
        </span>
      </div>

      <div className='category-title-with-icon'>
        <span className='category-title'>{this.props.category.title}</span>
        <span 
          className='glyphicon glyphicon-edit' 
          onClick={this.changeCategoryName}>
        </span>
      </div>

      <div className='category-trash-plus-icons'>
        <span 
          className='glyphicon glyphicon-trash trash' 
          onClick={this.deleteCategory}>
        </span>
        <span 
          className='glyphicon glyphicon-plus' 
          onClick={this.setCurrentCategoryForUpdate}>
        </span>
      </div>
    </div>
  }
}
