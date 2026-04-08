import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Users,
  Tags,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../services/api";

interface Transaction {
  id: number;
  amount: number;
  type: "Income" | "Expense";
  personId: number;
  categoryId: number;
}

interface Person {
  id: number;
  name: string;
}

interface Category {
  id: number;
  description: string;
}

interface Summary {
  income: number;
  expense: number;
  total: number;
}

interface EntitySummary extends Summary {
  id: number;
  name: string;
}

export function Dashboard() {
  const [summary, setSummary] = useState<Summary>({
    income: 0,
    expense: 0,
    total: 0,
  });
  const [peopleSummary, setPeopleSummary] = useState<EntitySummary[]>([]);
  const [categoriesSummary, setCategoriesSummary] = useState<EntitySummary[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      const [txRes, peopleRes, catRes] = await Promise.all([
        api.get<Transaction[]>("/transactions"),
        api.get<Person[]>("/people"),
        api.get<Category[]>("/categories"),
      ]);

      const transactions = txRes.data;
      const people = peopleRes.data;
      const categories = catRes.data;

      const calculatedSummary = transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "Income") {
            acc.income += transaction.amount;
            acc.total += transaction.amount;
          } else {
            acc.expense += transaction.amount;
            acc.total -= transaction.amount;
          }
          return acc;
        },
        { income: 0, expense: 0, total: 0 },
      );
      setSummary(calculatedSummary);

      const pSummary = people.map((person) => {
        const personTransactions = transactions.filter(
          (t) => t.personId === person.id,
        );

        const income = personTransactions
          .filter((t) => t.type === "Income")
          .reduce((sum, t) => sum + t.amount, 0);

        const expense = personTransactions
          .filter((t) => t.type === "Expense")
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          id: person.id,
          name: person.name,
          income,
          expense,
          total: income - expense,
        };
      });
      setPeopleSummary(pSummary);

      const cSummary = categories.map((category) => {
        const categoryTransactions = transactions.filter(
          (t) => t.categoryId === category.id,
        );

        const income = categoryTransactions
          .filter((t) => t.type === "Income")
          .reduce((sum, t) => sum + t.amount, 0);

        const expense = categoryTransactions
          .filter((t) => t.type === "Expense")
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          id: category.id,
          name: category.description,
          income,
          expense,
          total: income - expense,
        };
      });
      setCategoriesSummary(
        cSummary.filter((c) => c.income > 0 || c.expense > 0),
      );
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
      setErrorMessage(
        "Não foi possível carregar o resumo financeiro no momento.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 mt-1">
          Acompanhe o resumo das suas finanças.
        </p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <div
          className={`p-6 rounded-2xl shadow-sm flex flex-col justify-between transition-colors ${summary.total >= 0 ? "bg-blue-600 text-white border-transparent" : "bg-red-600 text-white border-transparent"}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Users size={18} className="text-gray-500" />
            <h3 className="font-bold text-gray-800">Totais por Pessoa</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Pessoa</th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Receitas
                  </th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Despesas
                  </th>
                  <th className="px-6 py-3 font-semibold text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Carregando...
                    </td>
                  </tr>
                ) : peopleSummary.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhum dado encontrado.
                    </td>
                  </tr>
                ) : (
                  <>
                    {peopleSummary.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-3 font-medium text-gray-800">
                          {p.name}
                        </td>
                        <td className="px-6 py-3 text-right text-green-600">
                          {formatCurrency(p.income)}
                        </td>
                        <td className="px-6 py-3 text-right text-red-600">
                          {formatCurrency(p.expense)}
                        </td>
                        <td
                          className={`px-6 py-3 text-right font-bold ${p.total >= 0 ? "text-blue-600" : "text-red-600"}`}
                        >
                          {formatCurrency(p.total)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-6 py-4 text-gray-800">TOTAL GERAL</td>
                      <td className="px-6 py-4 text-right text-green-600">
                        {formatCurrency(summary.income)}
                      </td>
                      <td className="px-6 py-4 text-right text-red-600">
                        {formatCurrency(summary.expense)}
                      </td>
                      <td
                        className={`px-6 py-4 text-right ${summary.total >= 0 ? "text-blue-600" : "text-red-600"}`}
                      >
                        {formatCurrency(summary.total)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
            <Tags size={18} className="text-gray-500" />
            <h3 className="font-bold text-gray-800">Totais por Categoria</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Categoria</th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Receitas
                  </th>
                  <th className="px-6 py-3 font-semibold text-right">
                    Despesas
                  </th>
                  <th className="px-6 py-3 font-semibold text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Carregando...
                    </td>
                  </tr>
                ) : categoriesSummary.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Nenhuma movimentação.
                    </td>
                  </tr>
                ) : (
                  <>
                    {categoriesSummary.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-3 font-medium text-gray-800">
                          {c.name}
                        </td>
                        <td className="px-6 py-3 text-right text-green-600">
                          {formatCurrency(c.income)}
                        </td>
                        <td className="px-6 py-3 text-right text-red-600">
                          {formatCurrency(c.expense)}
                        </td>
                        <td
                          className={`px-6 py-3 text-right font-bold ${c.total >= 0 ? "text-blue-600" : "text-red-600"}`}
                        >
                          {formatCurrency(c.total)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="px-6 py-4 text-gray-800">TOTAL GERAL</td>
                      <td className="px-6 py-4 text-right text-green-600">
                        {formatCurrency(summary.income)}
                      </td>
                      <td className="px-6 py-4 text-right text-red-600">
                        {formatCurrency(summary.expense)}
                      </td>
                      <td
                        className={`px-6 py-4 text-right ${summary.total >= 0 ? "text-blue-600" : "text-red-600"}`}
                      >
                        {formatCurrency(summary.total)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
