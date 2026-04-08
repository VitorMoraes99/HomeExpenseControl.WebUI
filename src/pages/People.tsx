import { Plus, Pencil, Trash2, User } from "lucide-react";
import { useState, useEffect } from "react";
import { PersonModal } from "../components/people/PersonModal";
import { api } from "../services/api";

interface Person {
  id: number;
  name: string;
  age: number;
}

export function People() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);

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

  useEffect(() => {
    loadPeople();
  }, []);

  const handleEdit = (person: Person) => {
    setPersonToEdit(person);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    const confirmDelete = window.confirm(
      `ATENÇÃO: Tem certeza que deseja excluir '${name}'?\n\nIsso apagará TODAS as transações relacionadas a esta pessoa permanentemente.`,
    );

    if (confirmDelete) {
      try {
        await api.delete(`/people/${id}`);
        loadPeople();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert(
          "Não foi possível excluir a pessoa. Verifique a conexão com o servidor.",
        );
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPersonToEdit(null);
  };

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
          onClick={() => {
            setPersonToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
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
                      <button
                        onClick={() => handleEdit(person)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(person.id, person.name)}
                        className="text-red-600 hover:text-red-800 transition-colors"
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

      <PersonModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={loadPeople}
        personToEdit={personToEdit}
      />
    </div>
  );
}
