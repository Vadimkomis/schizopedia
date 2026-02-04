import { ResearchDashboard } from "@/components/research/ResearchDashboard";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { useResearchData } from "@/hooks/useResearchData";

function App() {
  const state = useResearchData();
  return (
    <ThemeProvider>
      <ResearchDashboard {...state} />
    </ThemeProvider>
  );
}

export default App;
