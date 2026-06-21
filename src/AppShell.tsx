import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SeoManager } from "@/components/seo/SeoManager";
import { LandingPage } from "@/pages/LandingPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { GuidePage } from "@/pages/GuidePage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { TermsPage } from "@/pages/TermsPage";

/** Router-agnostic application tree: providers + routes. The client wraps this
 *  in BrowserRouter, the prerenderer in StaticRouter. */
export function AppShell() {
  return (
    <ThemeProvider>
      <SeoManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/category/:id" element={<CategoryPage />} />
        <Route path="/guide/:id" element={<GuidePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
