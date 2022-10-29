/** React imports */
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

/** React Hooks */
import useSecurity from '../../../routes/middlewares/useSecurity';

/** React Component */
import Header from './elements/Header';

/** Styles */
import './AuthenticatedLayout.scss';

function AuthenticatedLayout() {
  useSecurity();

  return (
    <Suspense fallback="loading">
      <div className="authenticated-page">
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </Suspense>
  );
}

/** Exports */
export default AuthenticatedLayout;
