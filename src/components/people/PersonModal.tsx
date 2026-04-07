import { X } from "lucide-react";
import { useState } from "react";

interface PersonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Isolei o formulário de criação/edição em um Modal para manter o usuário no contexto da listagem.
// O estado do formulário é gerenciado aqui dentro para não poluir a tela principal.
export function PersonModal({ isOpen, onClose }: PersonModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // Se o modal não estiver aberto, não renderiza nada no DOM (Performance)
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Aqui entrará a chamada do Axios para o C# (POST /api/pessoas)
    console.log("Salvando pessoa:", { name, age: Number(age) });

    // Limpa o form e fecha o modal
    setName("");
    setAge("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Cabeçalho do Modal */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Nova Pessoa</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário atendendo aos requisitos do teste (Nome max 200, Idade) */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              required
              maxLength={200} // Regra de negócio: Texto com tamanho máximo de 200
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ex: Vitor Moraes"
            />
          </div>

          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Idade
            </label>
            <input
              type="number"
              id="age"
              required
              min={0}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Ex: 26"
            />
          </div>

          {/* Botões de Ação */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
