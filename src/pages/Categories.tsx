import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CategoryModal } from "../components/categories/CategoryModal";

// Mock de dados seguindo exatamente os campos exigidos no teste
const mockCategories = [
  { id: 1, description: "Alimentação", purpose: "despesa" },
  { id: 2, description: "Salário", purpose: "receita" },
  { id: 3, description: "Vendas Diversas", purpose: "ambas" },
];

/**
 * Módulo de Cadastro de Categorias.
 * * Requisitos atendidos nesta tela:
 * - Listagem de categorias cadastradas.
 * - Exibição dos campos obrigatórios: Identificador, Descrição e Finalidade.
 */
export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função auxiliar para renderizar uma badge bonitinha dependendo da finalidade
  const renderPurposeBadge = (purpose: string) => {
    switch (purpose) {
      case "despesa":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium uppercase">
            Despesa
          </span>
        );
      case "receita":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium uppercase">
            Receita
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium uppercase">
            Ambas
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Categorias</h2>
          <p className="text-gray-500 mt-1">
            Gerencie os tipos de despesas e receitas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nova Categoria
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold w-24">ID</th>
                <th className="px-6 py-4 font-semibold">Descrição</th>
                <th className="px-6 py-4 font-semibold w-40">Finalidade</th>
                <th className="px-6 py-4 font-semibold w-32 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockCategories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    #{category.id}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {category.description}
                  </td>
                  <td className="px-6 py-4">
                    {renderPurposeBadge(category.purpose)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
