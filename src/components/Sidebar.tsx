import { LayoutDashboard, ArrowRightLeft, Tags, Settings } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col h-screen">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-white font-bold text-lg tracking-wider">
          EXPENSE<span className="text-blue-500">CTRL</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 bg-gray-800 text-white rounded-lg transition-colors"
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <ArrowRightLeft size={20} />
          <span className="font-medium">Transações</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <Tags size={20} />
          <span className="font-medium">Categorias</span>
        </a>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <Settings size={20} />
          <span className="font-medium">Configurações</span>
        </a>
      </div>
    </aside>
  );
}
