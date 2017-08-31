import { CATEGORIES_ACTIONS_TYPES } from '../constants/actions-types';


export function addCategory(category) {
  return {
    type: CATEGORIES_ACTIONS_TYPES.addCategory,
    category
  }
}

export function addSubcategory(subcategory) {
  return {
    type: CATEGORIES_ACTIONS_TYPES.addSubcategory,
    subcategory
  }
}

export function deleteCategory(category) {
  return {
    type: CATEGORIES_ACTIONS_TYPES.deleteCategory,
    category
  }
}

export function changeCategoryName(newValue) {
  return {
    type: CATEGORIES_ACTIONS_TYPES.changeCategoryName,
    newValue
  }
}

export function changeCurrentCategory(category) {
  return {
    type: CATEGORIES_ACTIONS_TYPES.changeCurrentCategory,
    category
  }
}
