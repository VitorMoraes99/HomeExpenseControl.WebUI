import { X, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "../../services/api";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  id: number;
  description: string;
}

interface Person {
  id: number;
  name: string;
}

/**
 * Componente de Modal para registro de Transações Financeiras.
 * Lógica: Como a transação depende de Entidades Externas (Categoria e Pessoa),
 * precisamos carregar essas listas no momento da montagem (useEffect) para popular os 'Selects'.
 */
export function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
}: TransactionModalProps) {
  // --- Estados do Formulário ---
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  // O tipo começa como Expense (Despesa), refletindo o Enum do C#
  const [type, setType] = useState("Expense");

  // Estados para armazenar as chaves estrangeiras selecionadas
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [personId, setPersonId] = useState<number | "">("");

  // --- Estados de Controle e Validação ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- Estados de Dados Auxiliares (Para os Selects) ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);

  // Carrega as Categorias e Pessoas apenas quando o Modal for aberto
  useEffect(() => {
    if (isOpen) {
      loadDependencies();
    } else {
      // Limpa os dados se fechar o modal
      resetForm();
    }
  }, [isOpen]);

  const loadDependencies = async () => {
    try {
      setIsLoadingDependencies(true);
      setErrorMessage("");

      // Dispara as duas requisições ao mesmo tempo usando Promise.all para maior performance
      const [categoriesResponse, peopleResponse] = await Promise.all([
        api.get("/categories"),
        api.get("/people"),
      ]);

      setCategories(categoriesResponse.data);
      setPeople(peopleResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dependências:", error);
      setErrorMessage(
        "Erro ao carregar listas. Tente abrir o formulário novamente.",
      );
    } finally {
      setIsLoadingDependencies(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("Expense");
    setCategoryId("");
    setPersonId("");
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validação extra no front-end para garantir que as dependências foram escolhidas
    if (!categoryId || !personId) {
      setErrorMessage("Por favor, selecione uma Categoria e uma Pessoa.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Enviando os dados exatamente como o CreateTransactionDto do C# espera
      await api.post("/transactions", {
        description,
        amount: Number(amount),
        type,
        categoryId: Number(categoryId),
        personId: Number(personId),
      });

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      let backendError = "Falha na conexão com o servidor.";

      if (axios.isAxiosError(error)) {
        backendError = error.response?.data?.message || backendError;
      }

      setErrorMessage(`Não foi possível salvar: ${backendError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Nova Transação</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
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

          {/* Bloqueio Visual se faltarem cadastros base */}
          {!isLoadingDependencies &&
            (categories.length === 0 || people.length === 0) && (
              <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg flex items-start gap-2 text-sm border border-yellow-100 mb-4">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>
                  Cadastre pelo menos 1 Categoria e 1 Pessoa antes de lançar
                  despesas.
                </span>
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
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Compra no Mercado"
              disabled={isLoadingDependencies}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Valor (R$)
              </label>
              <input
                type="number"
                id="amount"
                required
                min={0.01}
                step="0.01" // Permite valores quebrados (Decimais)
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00"
                disabled={isLoadingDependencies}
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo
              </label>
              <select
                id="type"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                disabled={isLoadingDependencies}
              >
                {/* Reflete o Enum TransactionType do C# */}
                <option value="Expense">Despesa</option>
                <option value="Income">Receita</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoria
            </label>
            <select
              id="categoryId"
              required
              value={categoryId}
              onChange={(e) =>
                setCategoryId(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              disabled={isLoadingDependencies || categories.length === 0}
            >
              <option value="" disabled>
                Selecione uma Categoria...
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="personId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Pessoa
            </label>
            <select
              id="personId"
              required
              value={personId}
              onChange={(e) =>
                setPersonId(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              disabled={isLoadingDependencies || people.length === 0}
            >
              <option value="" disabled>
                Selecione uma Pessoa...
              </option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
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
              disabled={
                isSubmitting || categories.length === 0 || people.length === 0
              }
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
