import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { CategoryModal } from "../components/categories/CategoryModal";
import { api } from "../services/api";

interface Category {
  id: number;
  description: string;
  purpose: "Expense" | "Income" | "Both";
}

export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (category: Category) => {
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, description: string) => {
    const confirmDelete = window.confirm(
      `Deseja realmente excluir a categoria '${description}'?`,
    );
    if (confirmDelete) {
      try {
        await api.delete(`/categories/${id}`);
        loadCategories();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert(
          "Não foi possível excluir. Talvez existam transações usando esta categoria.",
        );
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryToEdit(null);
  };

  const translatePurpose = (purpose: string) => {
    switch (purpose) {
      case "Expense":
        return "DESPESA";
      case "Income":
        return "RECEITA";
      case "Both":
        return "AMBAS";
      default:
        return purpose;
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
          onClick={() => {
            setCategoryToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
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
                <th className="px-6 py-4 font-semibold">Finalidade</th>
                <th className="px-6 py-4 font-semibold w-32 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Carregando...
                  </td>
                </tr>
              )}
              {!isLoading && categories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhuma categoria registrada.
                  </td>
                </tr>
              )}
              {categories.map((category) => (
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
                    <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {translatePurpose(category.purpose)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(category.id, category.description)
                        }
                        className="text-red-600 hover:text-red-800"
                        title="Excluir"
                      >
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
        onClose={handleCloseModal}
        onSuccess={loadCategories}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
}
