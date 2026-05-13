import React, { useState } from 'react';
import { isAuthenticated } from './LoginPage';
import LoginPage from './LoginPage';

function AuthProtectedRoute({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated());

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />;
  }

  return children;
}

export default AuthProtectedRoute;
