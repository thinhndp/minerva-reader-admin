import React from 'react';

import PageDashboard from './layout/pages/PageDashboard/PageDashboard';
import PageLogin from './layout/pages/PageLogin/PageLogin';
import PageClusters from './layout/pages/PageClusters/PageClusters';
import PageGenres from './layout/pages/PageGenres/PageGenres';
import PageMovies from './layout/pages/PageMovies/PageMovies';
import PageRates from './layout/pages/PageRates/PageRates';
import PageRooms from './layout/pages/PageRoom/PageRoom';
import PageScreenTypes from './layout/pages/PageScreenTypes/PageScreenTypes';
import PageShowtimes from './layout/pages/PageShowtimes/PageShowtimes';
import PageDiscounts from './layout/pages/PageDiscounts/PageDiscounts';
import PageReport from './layout/pages/PageReport/PageReport';
import PageUsers from './layout/pages/PageUsers/PageUsers';
import PageAuthors from './layout/pages/PageAuthors/PageAuthors';

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
    path: '/clusters',
    component: <PageClusters />,
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
    path: '/movies',
    component: <PageMovies />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/rates',
    component: <PageRates />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/rooms',
    component: <PageRooms />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/screen-types',
    component: <PageScreenTypes />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/showtimes',
    component: <PageShowtimes />,
    requiredRoles: ['ADMIN', 'staff'],
  },
  {
    path: '/discounts',
    component: <PageDiscounts />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/report',
    component: <PageReport />,
    requiredRoles: ['ADMIN'],
  },
  {
    path: '/users',
    component: <PageUsers />,
    requiredRoles: ['ADMIN'],
  }
];