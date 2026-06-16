import type { RouteObject } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import CalibrationRoute from '../routes/CalibrationRoute';
import HomeRoute from '../routes/HomeRoute';
import RecalibrationRoute from '../routes/RecalibrationRoute';
import ResultRoute from '../routes/ResultRoute';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomeRoute />
      },
      {
        path: 'result',
        element: <ResultRoute />
      },
      {
        path: 'internal/calibration',
        element: <CalibrationRoute />
      },
      {
        path: 'internal/recalibration',
        element: <RecalibrationRoute />
      }
    ]
  }
];
