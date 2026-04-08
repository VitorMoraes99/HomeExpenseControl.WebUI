import { X, AlertCircle, Info } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { api } from "../../services/api";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionToEdit?: {
    id: number;
    description: string;
    amount: number;
    type: string;
    categoryId: number;
    personId: number;
  } | null;
}

interface Category {
  id: number;
  description: string;
  purpose: "Expense" | "Income" | "Both";
}

interface Person {
  id: number;
  name: string;
  age: number;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  transactionToEdit,
}: TransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState("Expense");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [personId, setPersonId] = useState<number | "">("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);

  const selectedPerson = people.find((p) => p.id === personId);
  const isMinor = selectedPerson ? selectedPerson.age < 18 : false;

  useEffect(() => {
    if (isMinor && type !== "Expense") {
      setType("Expense");
    }
  }, [isMinor, type]);

  const availableCategories = useMemo(() => {
    return categories.filter(
      (cat) => cat.purpose === "Both" || cat.purpose === type,
    );
  }, [categories, type]);

  useEffect(() => {
    if (categoryId !== "") {
      const isValid = availableCategories.some((c) => c.id === categoryId);
      if (!isValid) {
        setCategoryId("");
      }
    }
  }, [type, availableCategories, categoryId]);

  useEffect(() => {
    if (isOpen) {
      loadDependencies().then(() => {
        if (transactionToEdit) {
          setDescription(transactionToEdit.description);
          setAmount(transactionToEdit.amount);
          setType(transactionToEdit.type);
          setCategoryId(transactionToEdit.categoryId);
          setPersonId(transactionToEdit.personId);
        } else {
          resetForm();
        }
      });
    } else {
      resetForm();
    }
  }, [isOpen, transactionToEdit]);

  const loadDependencies = async () => {
    try {
      setIsLoadingDependencies(true);
      setErrorMessage("");
      const [categoriesResponse, peopleResponse] = await Promise.all([
        api.get("/categories"),
        api.get("/people"),
      ]);
      setCategories(categoriesResponse.data);
      setPeople(peopleResponse.data);
    } catch (error) {
      console.error("Erro ao carregar dependências:", error);
      setErrorMessage("Erro ao carregar listas. Tente abrir novamente.");
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

    if (!categoryId || !personId) {
      setErrorMessage("Por favor, selecione uma Categoria e uma Pessoa.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        description,
        amount: Number(amount),
        type,
        categoryId: Number(categoryId),
        personId: Number(personId),
      };

      if (transactionToEdit) {
        await api.put(`/transactions/${transactionToEdit.id}`, payload);
      } else {
        await api.post("/transactions", payload);
      }

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar:", error);
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
          <h3 className="text-lg font-bold text-gray-800">
            {transactionToEdit ? "Editar Transação" : "Nova Transação"}
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

          {!isLoadingDependencies &&
            (categories.length === 0 || people.length === 0) && (
              <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>Cadastre pelo menos 1 Categoria e 1 Pessoa antes.</span>
              </div>
            )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              disabled={isLoadingDependencies}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                required
                min={0.01}
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={isLoadingDependencies}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${isMinor ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                disabled={isLoadingDependencies || isMinor}
              >
                <option value="Expense">Despesa</option>
                <option value="Income">Receita</option>
              </select>
            </div>
          </div>

          {isMinor && (
            <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
              <Info size={14} />
              <span>Menores de idade só podem registrar despesas.</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pessoa
            </label>
            <select
              required
              value={personId}
              onChange={(e) =>
                setPersonId(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              disabled={isLoadingDependencies || people.length === 0}
            >
              <option value="" disabled>
                Selecione...
              </option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) =>
                setCategoryId(
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              disabled={
                isLoadingDependencies || availableCategories.length === 0
              }
            >
              <option value="" disabled>
                {availableCategories.length === 0
                  ? "Nenhuma válida"
                  : "Selecione..."}
              </option>
              {availableCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.description}
                </option>
              ))}
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
              disabled={
                isSubmitting ||
                availableCategories.length === 0 ||
                people.length === 0
              }
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
