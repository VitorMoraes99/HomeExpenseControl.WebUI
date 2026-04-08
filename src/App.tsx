import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { People } from "./pages/People";
import { Categories } from "./pages/Categories";
import { Transactions } from "./pages/Transactions";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pessoas" element={<People />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/transacoes" element={<Transactions />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
