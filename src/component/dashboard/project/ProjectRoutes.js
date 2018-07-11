import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
/*
import {asyncComponent} from 'react-async-component';
*/

import {ROUTER as routes} from '@const/';

/*
const ProjectHome = asyncComponent({
  resolve: () => import('./home/ProjectHome')
});

const Budgets = asyncComponent({
  resolve: () => import('./budgets/Budgets')
});

const ProjectCalendar = asyncComponent({
  resolve: () => import('./calendar/ProjectCalendar')
});

const Categories = asyncComponent({
  resolve: () => import('./categories/Categories')
});

const Customers = asyncComponent({
  resolve: () => import('./customers/Customers')
});

const Todos = asyncComponent({
  resolve: () => import('./todo/Todos')
});

const Transactions = asyncComponent({
  resolve: () => import('./transactions/Transactions')
});
*/

import ProjectHome from './home/ProjectHome';
import Budgets from './budgets/Budgets';
import ProjectCalendar from './calendar/ProjectCalendar';
import Categories from './categories/Categories';
import Customers from './customers/Customers';
import Todos from './todo/Todos';
import Transactions from './transactions/Transactions';

export function getProjectRoutes(location) {

  return (
    <Switch location={location}>

      <Route exact path={routes.PROJECT}
             component={ProjectHome}/>

      <Route exact path={routes.BUDGETS}
             component={Budgets}/>

      <Route exact path={routes.TRANSACTIONS}
             component={Transactions}/>

      <Route exact path={routes.CATEGORIES}
             component={Categories}/>

      <Route exact path={routes.CUSTOMERS}
             component={Customers}/>

      <Route exact path={routes.PROJECT_CALENDAR}
             component={ProjectCalendar}/>

      <Route exact path={routes.TODOS}
             component={Todos}/>

    </Switch>

  );
}