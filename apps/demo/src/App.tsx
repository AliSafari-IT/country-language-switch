import { Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LocaleLayout from "./components/LocaleLayout";
import DemoPage from "./pages/DemoPage";
import GetStartedPage from "./pages/GetStartedPage";
import { DEFAULT_LOCALE, toLocaleSlug } from "./i18n";

export default function App() {
  const defaultSlug = toLocaleSlug(DEFAULT_LOCALE);

  return (
    <Routes>
      {/* Root / bare paths redirect to the default locale. */}
      <Route path="/" element={<Navigate to={`/${defaultSlug}`} replace />} />
      <Route
        path="/get-started"
        element={<Navigate to={`/${defaultSlug}/get-started`} replace />}
      />

      {/* Locale-aware routes: /:localeSlug/... */}
      <Route path="/:localeSlug" element={<LocaleLayout />}>
        <Route element={<Layout />}>
          <Route index element={<DemoPage />} />
          <Route path="get-started" element={<GetStartedPage />} />
        </Route>
      </Route>

      {/* Any other unmatched path falls back to the default locale. */}
      <Route path="*" element={<Navigate to={`/${defaultSlug}`} replace />} />
    </Routes>
  );
}
