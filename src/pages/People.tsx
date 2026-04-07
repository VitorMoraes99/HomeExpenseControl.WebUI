import { Plus, Pencil, Trash2, User } from "lucide-react";
import { useState, useEffect } from "react";
import { PersonModal } from "../components/people/PersonModal";
import { api } from "../services/api";

interface Person {
  id: number;
  name: string;
}

/**
 * Página principal de gestão de Pessoas.
 * Implementa a listagem (GET) e coordena a abertura do Modal de criação (POST).
 */
export function People() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);

  // Estado para gerenciar a UX de carregamento, evitando que a tela pisque
  // com "Nenhum dado" antes da API retornar a resposta.
  const [isLoading, setIsLoading] = useState(true);

  // Extraímos a chamada da API para uma função separada para permitir
  // reuso tanto no mount do componente quanto após o sucesso de um novo cadastro.
  const loadPeople = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/people");
      setPeople(response.data);
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ciclo de vida: Busca a lista de pessoas assim que a tela é montada
  useEffect(() => {
    loadPeople();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pessoas</h2>
          <p className="text-gray-500 mt-1">
            Gerencie os usuários e contatos do sistema.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nova Pessoa
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold w-24">ID</th>
                <th className="px-6 py-4 font-semibold">Nome</th>
                <th className="px-6 py-4 font-semibold w-32 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* Feedback de carregamento (Loading State) */}
              {isLoading && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Carregando...
                  </td>
                </tr>
              )}

              {/* Empty State: Mostrado apenas quando já carregou e a lista está vazia */}
              {!isLoading && people.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhuma pessoa cadastrada.
                  </td>
                </tr>
              )}

              {/* Renderização da lista hidratada pela API */}
              {people.map((person) => (
                <tr
                  key={person.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    #{person.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span className="text-gray-800 font-medium">
                        {person.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Pencil size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
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

      <PersonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadPeople}
      />
    </div>
  );
}
