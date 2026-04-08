import { LayoutDashboard, Users, Tags, ArrowRightLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white"
    }`;
  };

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 flex flex-col h-screen">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <h1 className="text-white font-bold text-lg tracking-wider">
          EXPENSE<span className="text-blue-500">CTRL</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link to="/" className={getLinkClass("/")}>
          <LayoutDashboard size={20} />
          <span className="font-medium">Totais (Dashboard)</span>
        </Link>
        <Link to="/pessoas" className={getLinkClass("/pessoas")}>
          <Users size={20} />
          <span className="font-medium">Pessoas</span>
        </Link>
        <Link to="/categorias" className={getLinkClass("/categorias")}>
          <Tags size={20} />
          <span className="font-medium">Categorias</span>
        </Link>
        <Link to="/transacoes" className={getLinkClass("/transacoes")}>
          <ArrowRightLeft size={20} />
          <span className="font-medium">Transações</span>
        </Link>
      </nav>
    </aside>
  );
}
