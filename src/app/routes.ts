import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CalendarPage } from './pages/CalendarPage';
import { GroupsPage } from './pages/GroupsPage';
import { AccountPage } from './pages/AccountPage';
import { HelpPage } from './pages/HelpPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
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
]);
