import { X } from "lucide-react";
import { useState } from "react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Modal isolado para criação/edição de Categorias.
// Mantém a padronização de UX definida na tela de Pessoas.
export function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("ambas");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integração futura com o endpoint de Categorias no C#
    console.log("Salvando categoria:", { description, purpose });

    setDescription("");
    setPurpose("ambas");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Nova Categoria</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição
            </label>
            <input
              type="text"
              id="description"
              required
              maxLength={400} // Regra de negócio: Texto com tamanho máximo de 400
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Alimentação, Salário, Lazer..."
            />
          </div>

          <div>
            <label
              htmlFor="purpose"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Finalidade
            </label>
            {/* Regra de negócio: Finalidade deve ser despesa, receita ou ambas */}
            <select
              id="purpose"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="ambas">Ambas (Receita e Despesa)</option>
              <option value="despesa">Apenas Despesa</option>
              <option value="receita">Apenas Receita</option>
            </select>
          </div>

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
