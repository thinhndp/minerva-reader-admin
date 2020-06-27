import React from 'react';

import PageDashboard from './layout/pages/PageDashboard/PageDashboard';
import PageLogin from './layout/pages/PageLogin/PageLogin';
import PageGenres from './layout/pages/PageGenres/PageGenres';
import PageUsers from './layout/pages/PageUsers/PageUsers';
import PageAuthors from './layout/pages/PageAuthors/PageAuthors';
import PageBooks from './layout/pages/PageBooks/PageBooks';
import PageReviews from './layout/pages/PageReviews/PageReviews';
import PageReports from './layout/pages/PageReports/PageReports';
// import a from './layout/pages/';

export const routes = [
  {
    path: '/',
    component: <PageDashboard />,
    requiredRoles: [],
  },
  {
    path: '/login',
    component: <PageLogin />,
    requiredRoles: [],
  },
  {
    path: '/books',
    component: <PageBooks />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/genres',
    component: <PageGenres />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/authors',
    component: <PageAuthors />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/reviews',
    component: <PageReviews />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/reviews/:reviewId/reports',
    component: <PageReports />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/users',
    component: <PageUsers />,
    requiredRoles: ['ADMIN'],
  }
];