import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { PersonModal } from "../components/people/PersonModal";

const mockPeople = [
  { id: 1, name: "Vitor Moraes", age: 26 },
  { id: 2, name: "João da Silva", age: 45 },
  { id: 3, name: "Maria Oliveira", age: 17 },
];

/**
 * Módulo de Cadastro de Pessoas.
 * * Requisitos atendidos nesta tela:
 * - Listagem de pessoas cadastradas.
 * - Exibição dos campos obrigatórios: Identificador, Nome (max 200) e Idade.
 * - Acesso às ações de Criação, Edição e Deleção.
 */
export function People() {
  // Estado para controlar a visibilidade do formulário de criação
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pessoas</h2>
          <p className="text-gray-500 mt-1">
            Gerencie os moradores e membros da casa.
          </p>
        </div>

        {/* Ao clicar, alteramos o estado para abrir o modal */}
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
            {/* ... (O cabeçalho e o tbody continuam exatamente iguais ao que você já tinha) ... */}
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold w-24">ID</th>
                <th className="px-6 py-4 font-semibold">Nome</th>
                <th className="px-6 py-4 font-semibold w-32">Idade</th>
                <th className="px-6 py-4 font-semibold w-32 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockPeople.map((person) => (
                <tr
                  key={person.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    #{person.id}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {person.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{person.age} anos</td>
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

      {/* Injeção do Modal na página. Passamos o estado e a função para fechar */}
      <PersonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
