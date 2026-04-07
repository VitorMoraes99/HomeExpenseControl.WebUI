import { Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useState } from "react";
import { TransactionModal } from "../components/transactions/TransactionModal";

const mockTransactions = [
  {
    id: 1,
    description: "Compra no Carrefour",
    amount: 450.5,
    type: "despesa",
    category: "Alimentação",
    person: "Vitor Moraes",
  },
  {
    id: 2,
    description: "Salário DMsoft",
    amount: 5000,
    type: "receita",
    category: "Salário",
    person: "Vitor Moraes",
  },
  {
    id: 3,
    description: "Lanche na Escola",
    amount: 15.0,
    type: "despesa",
    category: "Alimentação",
    person: "Maria Oliveira",
  },
];

export function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transações</h2>
          <p className="text-gray-500 mt-1">
            Lançamento de receitas e despesas da residência.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Descrição</th>
                <th className="px-6 py-4 font-semibold">Pessoa</th>
                <th className="px-6 py-4 font-semibold">Categoria</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {t.description}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{t.person}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                      {t.category}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 font-semibold ${t.type === "receita" ? "text-green-600" : "text-red-600"}`}
                  >
                    <div className="flex items-center gap-2">
                      {t.type === "receita" ? (
                        <ArrowUpCircle size={16} />
                      ) : (
                        <ArrowDownCircle size={16} />
                      )}
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(t.amount)}
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
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
