import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../services/api";

// Reutilizamos a tipagem da transação para manter a consistência
interface Transaction {
  id: number;
  amount: number;
  type: "Income" | "Expense";
}

// Tipagem para o nosso objeto de resumo matemático
interface Summary {
  income: number;
  expense: number;
  total: number;
}

/**
 * Página de Dashboard Principal.
 * Decisão de Arquitetura: Optamos por buscar todas as transações e calcular
 * o resumo no Front-end (usando array.reduce). Em uma aplicação de altíssima escala,
 * esse cálculo seria movido para o Back-end (ex: um endpoint /api/transactions/summary)
 * para poupar processamento e tráfego de rede do cliente.
 */
export function Dashboard() {
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expense: 0,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setIsLoading(true);

      // Busca todas as transações para extrair os valores
      const response = await api.get<Transaction[]>("/transactions");
      const transactions = response.data;

      // Lógica de Negócio (Front-end): Calculando os totais usando o poderoso método reduce
      const calculatedSummary = transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "Income") {
            acc.income += transaction.amount;
            acc.total += transaction.amount;
          } else {
            acc.expense += transaction.amount;
            acc.total -= transaction.amount; // Despesas subtraem do total
          }
          return acc;
        },
        { income: 0, expense: 0, total: 0 }, // Valor inicial do acumulador (acc)
      );

      setSummary(calculatedSummary);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      setErrorMessage(
        "Não foi possível carregar o resumo financeiro no momento.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Função utilitária para formatar valores monetários no padrão brasileiro
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">
          Acompanhe o resumo das suas finanças.
        </p>
      </div>

      {/* Tratamento de Erro Amigável */}
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Grid de Cards (Design Responsivo: 1 coluna no celular, 3 no PC) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card: Receitas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Entradas</h3>
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <span className="text-3xl font-bold text-gray-800">
                {formatCurrency(summary.income)}
              </span>
            )}
          </div>
        </div>

        {/* Card: Despesas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Saídas</h3>
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
              <TrendingDown size={20} />
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <span className="text-3xl font-bold text-gray-800">
                {formatCurrency(summary.expense)}
              </span>
            )}
          </div>
        </div>

        {/* Card: Saldo Total (A cor muda dinamicamente se o saldo for negativo) */}
        <div
          className={`p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-colors ${
            summary.total >= 0
              ? "bg-blue-600 text-white border-transparent"
              : "bg-red-600 text-white border-transparent"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium opacity-90">Saldo Atual</h3>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
              <DollarSign size={20} />
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="h-8 w-32 bg-white/30 animate-pulse rounded"></div>
            ) : (
              <span className="text-3xl font-bold">
                {formatCurrency(summary.total)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
