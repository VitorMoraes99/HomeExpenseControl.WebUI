import { AppLayout } from "./components/layout/AppLayout";

export default function App() {
  return (
    <AppLayout>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Visão Geral</h2>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">
            Seu dashboard e gráficos vão entrar aqui em breve...
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
