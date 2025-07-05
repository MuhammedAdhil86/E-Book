import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/home';
import ParentVerseIntro from '../pages/parentverseIntro';
import Signup from '../pages/signup';
import Login from '../pages/login';
import Library from '../pages/library';
import BooksContent from '../pages/Bookscontent';
import Subscription from '../pages/subscription';
import Subscribe from '../pages/subscribe';
import Renew from '../pages/renew';
import Invoice from '../pages/invoice';

// Route guard
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/verse" element={<ParentVerseIntro />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/subscribe" element={<Subscribe />} />
      <Route path="/invoice" element={<Invoice />} />

      {/* Protected Routes */}
      <Route
        path="/library"
        element={
          <ProtectedRoute redirectIfNotAuth>
            <Library />
          </ProtectedRoute>
        }
      />

      <Route
        path="/read/:id"
        element={
          <ProtectedRoute>
            <BooksContent />
          </ProtectedRoute>
        }
      />

      {/* Allow login-only users (no active sub) */}
      <Route
        path="/subscription"
        element={
          <ProtectedRoute
            redirectToIfUnauthenticated="/verse"
            requireSubscription={false}
          >
            <Subscription />
          </ProtectedRoute>
        }
      />

      {/* Subscribed-only page (paid users) */}
      <Route
        path="/subscribed"
        element={
          <ProtectedRoute>
            <Subscribe />
          </ProtectedRoute>
        }
      />

      {/* Renewal page for expired users */}
      <Route
        path="/renew"
        element={
          <ProtectedRoute>
            <Renew />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
