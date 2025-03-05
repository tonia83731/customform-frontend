import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import CustomFormPage from "./pages/CustomFormPage";
import ResponseFormPage from "./pages/ResponseFormPage";
import ResponseDataPage from "./pages/ResponseDataPage";
import SigninPage from "./pages/SignInPage";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/updated-form/:formId"
        element={<ProtectedRoute element={<CustomFormPage />} />}
      />
      <Route
        path="/preview/:formId"
        element={
          <ProtectedRoute element={<ResponseFormPage mode="preview" />} />
        }
      />
      <Route
        path="/response/:formId"
        element={<ResponseFormPage mode="response" />}
      />
      <Route
        path="/response/:formId/results"
        element={<ProtectedRoute element={<ResponseDataPage />} />}
      />
    </Routes>
  );
}

export default App;
