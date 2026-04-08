import { X, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../../services/api";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: {
    id: number;
    description: string;
    purpose: "Expense" | "Income" | "Both";
  } | null;
}

export function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categoryToEdit,
}: CategoryModalProps) {
  const [description, setDescription] = useState("");
  const [purpose, setPurpose] = useState("Expense");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Preenche os dados se for edição
  useEffect(() => {
    if (categoryToEdit) {
      setDescription(categoryToEdit.description);
      setPurpose(categoryToEdit.purpose);
    } else {
      setDescription("");
      setPurpose("Expense");
    }
    setErrorMessage("");
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setIsSubmitting(true);
      const payload = { description, purpose };

      if (categoryToEdit) {
        await api.put(`/categories/${categoryToEdit.id}`, payload);
      } else {
        await api.post("/categories", payload);
      }

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      let backendError = "Falha na conexão com o servidor.";
      if (axios.isAxiosError(error)) {
        backendError = error.response?.data?.message || backendError;
      }
      setErrorMessage(`Não foi possível salvar: ${backendError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">
            {categoryToEdit ? "Editar Categoria" : "Nova Categoria"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              required
              maxLength={400}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Finalidade
            </label>
            <select
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="Expense">Despesa</option>
              <option value="Income">Receita</option>
              <option value="Both">Ambas</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
