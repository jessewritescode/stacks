import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Pages
import { store } from './store';
import MediaStatus from '@components/media-status/media-status';

export const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MediaStatus />
      </BrowserRouter>
    </Provider>
  );
};
