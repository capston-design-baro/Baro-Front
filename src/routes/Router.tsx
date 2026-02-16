import AgreementsPage from '@/features/auth/pages/AgreementPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';
import ComplaintWizardPage from '@/pages/ComplaintWizardPage';
import FaqPage from '@/pages/FaqPage';
import MainPage from '@/pages/MainPage';
import MyComplaintsPage from '@/pages/MyComplaintsPage';
import CrimeTypePage from '@/pages/PrecedentPage';
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

      {/* "/faq" 경로 */}
      {
        <Route
          path="/faq"
          element={<FaqPage />}
        />
      }

      {/* "/precedent" 경로 */}
      <Route
        path="/precedent"
        element={<CrimeTypePage />}
      />

      <Route
        path="/complaints"
        element={<MyComplaintsPage />}
      />
    </Routes>
  );
};

export default Router;
