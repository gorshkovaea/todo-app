import { 
  CATEGORIES_ACTIONS_TYPES,
  TODO_ACTIONS_TYPES 
} from '../constants/actions-types';


const initialState = {
  categories: [],
  currentCategory: {}
};

export default function categoriesState(state = initialState, action) {

  switch (action.type) {
    
    case CATEGORIES_ACTIONS_TYPES.addCategory: 
      return { ...state, categories: [...state.categories, action.category] }

    case CATEGORIES_ACTIONS_TYPES.addSubcategory: {
      let newState = {...state};
      newState.currentCategory.categories.push(action.subcategory);

      return {
        ...newState, categories: [...newState.categories]
      };
    }

    case CATEGORIES_ACTIONS_TYPES.deleteCategory: {
      let newState = {...state};
      if (newState.currentCategory === action.category) {
        newState.currentCategory = {};
      }
      let arr = [newState.categories];

      for (const item of arr) {
        item.forEach((category, index) => {
          
          if (category === action.category) {            
            item.splice(index, 1);       
            return;
          } 
          
          if (category.categories.length) {            
            arr.push(category.categories);
          }
        });
      }
      return { 
        ...newState,
        categories: [
          ...newState.categories
        ],
        currentCategory: newState.currentCategory
      };
    }

    case CATEGORIES_ACTIONS_TYPES.changeCategoryName: {
      let newState = {...state};
      newState.currentCategory.title = action.newValue;
      return { ...newState, categories: [...newState.categories] };
    }

    case CATEGORIES_ACTIONS_TYPES.changeCurrentCategory: {
      return { ...state, currentCategory: action.category };
    }

    // TODO LIST

    case TODO_ACTIONS_TYPES.addTodo: {
      let newState = {...state};
      newState.currentCategory.todos = [
        ...newState.currentCategory.todos, 
        action.todo
      ];
      return { ...newState, categories: [...newState.categories] };
    }

    case TODO_ACTIONS_TYPES.changeTodoName: {
      let newState = {...state};

      changeTodo(newState, action, (category, index) => {
        category.todos[index].title = action.newTitle;
      });
      
      return { ...newState, categories: [...newState.categories] };
    }

    case TODO_ACTIONS_TYPES.changeTodoDone: {
      let newState = {...state};

      changeTodo(newState, action, (category, index) => {
        category.todos[index].done = !category.todos[index].done;
      });
      
      return { ...newState, categories: [...newState.categories] };
    }

    case TODO_ACTIONS_TYPES.moveTodo: {
      let newState = {...state};

      changeTodo(newState, action, (category, index) => {
        category.todos.splice(index, 1);
      });
      let arr = [newState.categories];

      for (const item of arr) {
        item.forEach(category => {
          if (category === action.category) {    
            category.todos.push(action.todo);    
            return;      
          } 
          if (category.categories.length) {            
            arr.push(category.categories);
          }
        });
      }
      return { ...newState, categories: [...newState.categories] };
    }

    default:
      return state;
  }
}

function changeTodo(newState, action, callback) {
  const index = newState.currentCategory.todos.indexOf(action.todo);
  if (index != -1) {
    callback(newState.currentCategory, index);
  } else {
    let arr = [newState.currentCategory.categories];

    for (const item of arr) {
      item.forEach(category => {
      
        if (category.todos.includes(action.todo)) {       
          const index = category.todos.indexOf(action.todo);

          callback(category, index);      
        } 
          
        if (category.categories.length) {            
          arr.push(category.categories);
        }
      });
    }
  }
}
