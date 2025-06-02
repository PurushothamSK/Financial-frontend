import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
// import { BookLoaderComponent } from '../components/Loader.jsx';
import Header from '../components/Header.jsx';
import FinancialLoader from '../components/Loader.jsx';
import DashboardLayout from '../pages/DashboardLayout.jsx';
import Income from '../components/Forms/Income.jsx';
import ExpenseForm from '../components/Forms/ExpenseForm.jsx';
import InvestmentForm from '../components/Forms/InvestmentForm.jsx';
import RetirementSimulatorForm from '../components/Forms/RetirementPlanForm.jsx';
import SimulationTable from '../pages/SimulationTable.jsx';
import Basicinfo from '../components/Forms/Basicinfo.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import AdminUsers from '../pages/AdminUsers.jsx';


export const LoginPage = lazy(() => import('../components/Login.jsx'));
export const RegisterPage = lazy(() => import('../components/Register.jsx'));



// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <Suspense fallback={<FinancialLoader />}>
          <Header />
        <LoginPage />
        </Suspense>

      ),
    },
    {
      path: '/register',
      element: (
        <Suspense fallback={<FinancialLoader />}>
          <Header />
        <RegisterPage />
        </Suspense>

      ),
    },
    {
      element: (
          <Suspense fallback={<FinancialLoader />}>
           <DashboardLayout>
            <Outlet />
           </DashboardLayout>
          </Suspense>
      ),
      children: [
        {path : 	'basicinfo', element: <Basicinfo /> },
        {path : 'incomeinfo', element: <Income /> },
        {path : 'expenseinfo', element: <ExpenseForm /> },
        {path : 'investment', element: <InvestmentForm /> },
        {path: 'retirement-savings', element: <RetirementSimulatorForm /> },
        {path: 'table', element:<SimulationTable /> },
        {path: 'admindashboard', element:<AdminDashboard /> },
        {path : 'admin-users', element: <AdminUsers /> },
      ],
    },
    // {
    //   path: '404',
    //   element: <Page404 />,
    // },
    // {
    //   path: '*',
    //   element: <Navigate to="/404" replace />,
    // },
  ]);

  return routes;
}
