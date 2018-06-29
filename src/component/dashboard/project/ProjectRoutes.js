import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import {asyncComponent} from 'react-async-component';

import {ROUTER as routes} from '@const/';

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

export function getProjectRoutes(location) {

  return (
    <Switch location={location}>

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