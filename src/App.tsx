import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { People } from "./pages/People";
import { Categories } from "./pages/Categories";
import { Transactions } from "./pages/Transactions";

// Ponto de entrada das rotas. O BrowserRouter engloba tudo.
// O AppLayout fica por fora das Routes para que a Sidebar não recarregue nunca,
// apenas o conteúdo do "meio" muda conforme a rota.
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
