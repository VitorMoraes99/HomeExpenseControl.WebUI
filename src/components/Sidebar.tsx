import { LayoutDashboard, Users, Tags, ArrowRightLeft } from "lucide-react";

// Menu de navegação lateral.
// Já deixei os links estruturados exatamente na ordem das funcionalidades pedidas nos requisitos do teste:
// 1. Visão de Totais (Dashboard)
// 2. Cadastro de Pessoas
// 3. Cadastro de Categorias
// 4. Lançamento de Transações
export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col h-screen">
      {/* Título/Logo do sistema */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-white font-bold text-lg tracking-wider">
          EXPENSE<span className="text-blue-500">CTRL</span>
        </h1>
      </div>

      {/* Áreas do sistema */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 bg-gray-800 text-white rounded-lg transition-colors"
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Totais (Dashboard)</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <Users size={20} />
          <span className="font-medium">Pessoas</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <Tags size={20} />
          <span className="font-medium">Categorias</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <ArrowRightLeft size={20} />
          <span className="font-medium">Transações</span>
        </a>
      </nav>
    </aside>
  );
}
