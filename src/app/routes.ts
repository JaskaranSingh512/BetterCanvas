import { createBrowserRouter, redirect } from 'react-router';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CalendarPage } from './pages/CalendarPage';
import { GroupsPage } from './pages/GroupsPage';
import { AccountPage } from './pages/AccountPage';
import { HelpPage } from './pages/HelpPage';
import { LoginPage } from './pages/LoginPage';
import { isAuthenticated } from '../lib/api';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    loader: () => {
      if (!isAuthenticated()) {
        throw redirect('/login');
      }
      return null;
    },
    children: [
      { index: true, Component: DashboardPage },
      { path: 'courses', Component: CoursesPage },
      { path: 'calendar', Component: CalendarPage },
      { path: 'groups', Component: GroupsPage },
      { path: 'account', Component: AccountPage },
      { path: 'help', Component: HelpPage },
      { path: '*', Component: DashboardPage },
    ],
  },
  {
    path: '/login',
    Component: LoginPage,
    loader: () => {
      if (isAuthenticated()) {
        throw redirect('/');
      }
      return null;
    },
  },
]);
