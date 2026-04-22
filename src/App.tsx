import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LandingPage } from "@/pages/LandingPage";
import { CategoryPage } from "@/pages/CategoryPage";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
