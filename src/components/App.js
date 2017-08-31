import React from 'react';
import CategoriesTree from './categories-tree/CategoriesTree';
import TasksList from './tasks-list/TasksList';
import 'bootstrap/dist/css/bootstrap.css';


export default class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <div className='container'>
      <div className='row'>
        <CategoriesTree />
        <TasksList />
      </div>
    </div>
  }
}
