import { X, AlertCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { api } from "../../services/api";

interface PersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Componente de Modal para cadastro de Pessoas.
 * Decisão de UI/UX: Utilizar um modal sobreposto à listagem evita recarregamentos
 * de página e perda de contexto, mantendo a fluidez da aplicação.
 */
export function PersonModal({ isOpen, onClose, onSuccess }: PersonModalProps) {
  const [name, setName] = useState("");

  // Utiliza union type (number | "") para evitar que o input inicie com "0",
  // permitindo que o placeholder seja exibido corretamente ao abrir o modal vazio.
  const [age, setAge] = useState<number | "">("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setIsSubmitting(true);

      // Integração POST com a API.
      // O Axios serializa automaticamente o payload para JSON.
      await api.post("/people", {
        name,
        age: Number(age), // Cast de segurança para garantir a tipagem esperada pelo C#
      });

      // Limpeza de estado para evitar dados fantasmas na próxima abertura
      setName("");
      setAge("");

      onClose();
      onSuccess(); // Dispara o gatilho para a tela pai (People) refazer o GET
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
      let backendError = "Falha na conexão com o servidor.";

      // Type Guard rigoroso do Axios: intercepta a resposta de erro (ex: 400 Bad Request)
      // e extrai a mensagem de validação amigável enviada pela WebAPI.
      if (axios.isAxiosError(error)) {
        backendError = error.response?.data?.message || backendError;
      }

      setErrorMessage(`Não foi possível salvar: ${backendError}`);
    } finally {
      // Garantia de liberação do UI Thread, independente do resultado (try ou catch)
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Nova Pessoa</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Alerta de feedback visual em caso de falha na validação do Back-end */}
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

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
              maxLength={200} // Reflete a restrição de tamanho do banco de dados (Entity Framework)
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              max={150} // Validação de sanidade simples no Front-end
              value={age}
              onChange={(e) =>
                setAge(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: 26"
            />
          </div>

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
