import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SeoManager } from "@/components/seo/SeoManager";

// Route components are code-split so each page ships only the JS it needs.
// React 18 keeps the prerendered HTML during hydration, so there's no flash.
const LandingPage = lazy(() =>
  import("@/pages/LandingPage").then((m) => ({ default: m.LandingPage })),
);
const CategoryPage = lazy(() =>
  import("@/pages/CategoryPage").then((m) => ({ default: m.CategoryPage })),
);
const GuidePage = lazy(() =>
  import("@/pages/GuidePage").then((m) => ({ default: m.GuidePage })),
);
const PrivacyPage = lazy(() =>
  import("@/pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })),
);
const TermsPage = lazy(() =>
  import("@/pages/TermsPage").then((m) => ({ default: m.TermsPage })),
);

/** Router-agnostic application tree: providers + routes. The client wraps this
 *  in BrowserRouter, the prerenderer in StaticRouter. */
export function AppShell() {
  return (
    <ThemeProvider>
      <SeoManager />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/guide/:id" element={<GuidePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
