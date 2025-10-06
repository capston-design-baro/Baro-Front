import LoginPage from '@/pages/LoginPage';
import MainPage from '@/pages/MainPage';
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

      {/* "/signup" 경로 → SignupPage (현재는 주석 처리됨) */}
      {/* <Route path="/signup" element={<SignupPage />} /> */}
    </Routes>
  );
};

export default Router;
