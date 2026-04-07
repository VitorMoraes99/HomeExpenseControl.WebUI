import { X, AlertCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { api } from "../../services/api";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Componente de Modal para criação de Categorias.
 * Lógica: Optamos por utilizar um modal em vez de uma nova página para manter
 * o usuário no contexto da listagem (Dashboard/Tabela), melhorando a UX.
 */
export function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: CategoryModalProps) {
  // Gerenciamento de estado do formulário
  const [description, setDescription] = useState("");
  // Estado inicial ajustado para bater com o Enum do C# (Both)
  const [purpose, setPurpose] = useState("Both");

  // Controle de interface (Feedback visual e prevenção de duplo clique)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setIsSubmitting(true);

      // Integração com a API (C#). O Axios já converte automaticamente para JSON.
      await api.post("/categories", {
        description,
        purpose,
      });

      // Reseta os estados após o sucesso para a próxima vez que o modal abrir
      setDescription("");
      setPurpose("Both"); // Ajustado aqui também

      onClose();
      onSuccess(); // Dispara a atualização da listagem na tela pai
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);

      let backendError = "Falha na conexão com o servidor.";

      // Type Guard do Axios: Extrai a mensagem de erro amigável retornada pela WebAPI,
      // garantindo a tipagem estrita do TypeScript (evitando o uso de 'any').
      if (axios.isAxiosError(error)) {
        backendError = error.response?.data?.message || backendError;
      } else if (error instanceof Error) {
        backendError = error.message;
      }

      setErrorMessage(`Não foi possível salvar: ${backendError}`);
    } finally {
      // O bloco finally garante que o botão seja liberado independentemente de sucesso ou falha
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header do Modal */}
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
          {/* Tratamento e exibição de erros da API de forma amigável ao usuário */}
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

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
              maxLength={400} // Regra de negócio exigida: Texto com tamanho máximo de 400
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
            {/* Regra de negócio exigida: Restringir a finalidade a valores específicos */}
            <select
              id="purpose"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {/* O usuário lê em português, mas o C# recebe os Enums corretos em inglês */}
              <option value="Both">Ambas (Receita e Despesa)</option>
              <option value="Expense">Apenas Despesa</option>
              <option value="Income">Apenas Receita</option>
            </select>
          </div>

          {/* Ações do formulário */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
