import AgreementsPage from '@/pages/AgreementPage';
import ComplaintWizardPage from '@/pages/ComplaintWizardPage';
import LoginPage from '@/pages/LoginPage';
import MainPage from '@/pages/MainPage';
import SignupPage from '@/pages/SignupPage';
import { Route, Routes } from 'react-router-dom';

// import SignupPage from '@/pages/SignupPage';

const Router = () => {
  return (
    <Routes>
      {/* 루트("/") 경로 → MainPage 컴포넌트 렌더링 */}
      <Route
        path="/"
        element={<MainPage />}
      />

      {/* "/login" 경로 → LoginPage 컴포넌트 렌더링 */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/terms"
        element={<AgreementsPage />}
      />

      {/* "/signup" 경로 */}
      {
        <Route
          path="/signup"
          element={<SignupPage />}
        />
      }

      {/* "/complaint" 경로 */}
      {
        <Route
          path="/complaint"
          element={<ComplaintWizardPage />}
        />
      }
    </Routes>
  );
};

export default Router;
