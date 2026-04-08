import {
  Plus,
  Pencil,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { TransactionModal } from "../components/transactions/TransactionModal";
import { api } from "../services/api";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "Income" | "Expense";
  categoryId: number;
  personId: number;
}

export function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [transactionToEdit, setTransactionToEdit] =
    useState<Transaction | null>(null);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, description: string) => {
    const confirmDelete = window.confirm(
      `Deseja realmente excluir a transação '${description}'?`,
    );
    if (confirmDelete) {
      try {
        await api.delete(`/transactions/${id}`);
        loadTransactions();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert(
          "Não foi possível excluir a transação. Verifique a conexão com o servidor.",
        );
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTransactionToEdit(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transações</h2>
          <p className="text-gray-500 mt-1">Controle de receitas e despesas.</p>
        </div>
        <button
          onClick={() => {
            setTransactionToEdit(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
        >
          <Plus size={20} />
          Nova Lançamento
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold w-24">Tipo</th>
                <th className="px-6 py-4 font-semibold">Descrição</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
                <th className="px-6 py-4 font-semibold w-32 text-center">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Carregando...
                  </td>
                </tr>
              )}
              {!isLoading && transactions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Nenhuma transação registrada.
                  </td>
                </tr>
              )}
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {transaction.type === "Income" ? (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit text-sm font-medium">
                        <ArrowUpCircle size={16} />
                        <span>Receita</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit text-sm font-medium">
                        <ArrowDownCircle size={16} />
                        <span>Despesa</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {transaction.description}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold ${transaction.type === "Income" ? "text-green-600" : "text-red-600"}`}
                  >
                    {transaction.type === "Expense" ? "- " : "+ "}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(transaction.id, transaction.description)
                        }
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

      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={loadTransactions}
        transactionToEdit={transactionToEdit} // Passando os dados para o Modal!
      />
    </div>
  );
}
