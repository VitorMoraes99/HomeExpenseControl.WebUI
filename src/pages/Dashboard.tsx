import { Wallet, TrendingDown, TrendingUp } from "lucide-react";
import { SummaryCard } from "../components/dashboard/SummaryCard";

// Mocks que simulam o retorno do seu C# (já processado com os totais)
const personTotals = [
  { id: 1, name: "Vitor Moraes", income: 5000, expense: 1200, balance: 3800 },
  { id: 2, name: "João da Silva", income: 0, expense: 450.5, balance: -450.5 },
  { id: 3, name: "Maria Oliveira", income: 0, expense: 15.0, balance: -15.0 },
];

const categoryTotals = [
  { id: 1, description: "Salário", income: 5000, expense: 0, balance: 5000 },
  {
    id: 2,
    description: "Alimentação",
    income: 0,
    expense: 465.5,
    balance: -465.5,
  },
  { id: 3, description: "Moradia", income: 0, expense: 1200, balance: -1200 },
];

/**
 * Módulo de Dashboard (Totais)
 * Requisitos atendidos:
 * - Consulta de totais por pessoa (com total geral no rodapé)
 * - Consulta de totais por categoria (bônus opcional do teste, com total geral)
 */
export function Dashboard() {
  // Funções para calcular o "Total Geral" exigido no teste
  const grandTotalPerson = personTotals.reduce(
    (acc, curr) => ({
      income: acc.income + curr.income,
      expense: acc.expense + curr.expense,
      balance: acc.balance + curr.balance,
    }),
    { income: 0, expense: 0, balance: 0 },
  );

  const grandTotalCategory = categoryTotals.reduce(
    (acc, curr) => ({
      income: acc.income + curr.income,
      expense: acc.expense + curr.expense,
      balance: acc.balance + curr.balance,
    }),
    { income: 0, expense: 0, balance: 0 },
  );

  // Formatador de Moeda
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Totais Gerais</h2>
        <p className="text-gray-500 mt-1">
          Acompanhe os gastos da sua casa de forma simples.
        </p>
      </div>

      {/* Cards de Resumo no Topo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Saldo Líquido Geral"
          amount={formatMoney(grandTotalPerson.balance)}
          icon={Wallet}
          iconColorClass="text-blue-600"
          iconBgClass="bg-blue-50"
        />
        <SummaryCard
          title="Total de Receitas"
          amount={formatMoney(grandTotalPerson.income)}
          icon={TrendingUp}
          iconColorClass="text-green-600"
          iconBgClass="bg-green-50"
        />
        <SummaryCard
          title="Total de Despesas"
          amount={formatMoney(grandTotalPerson.expense)}
          icon={TrendingDown}
          iconColorClass="text-red-600"
          iconBgClass="bg-red-50"
        />
      </div>

      {/* Grid para colocar as duas tabelas lado a lado em telas grandes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tabela: Totais por Pessoa */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-800">
              Totais por Pessoa
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Pessoa</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Receitas
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Despesas
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {personTotals.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-green-600 text-right">
                      {formatMoney(p.income)}
                    </td>
                    <td className="px-6 py-4 text-red-600 text-right">
                      {formatMoney(p.expense)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${p.balance >= 0 ? "text-blue-600" : "text-red-600"}`}
                    >
                      {formatMoney(p.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Rodapé exigido pelo teste (Total Geral) */}
              <tfoot className="bg-gray-50 font-bold border-t-2 border-gray-100">
                <tr>
                  <td className="px-6 py-4 text-gray-800 uppercase text-xs tracking-wider">
                    Total Geral
                  </td>
                  <td className="px-6 py-4 text-green-600 text-right">
                    {formatMoney(grandTotalPerson.income)}
                  </td>
                  <td className="px-6 py-4 text-red-600 text-right">
                    {formatMoney(grandTotalPerson.expense)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right ${grandTotalPerson.balance >= 0 ? "text-blue-600" : "text-red-600"}`}
                  >
                    {formatMoney(grandTotalPerson.balance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Tabela: Totais por Categoria (Opcional do Teste) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-800">
              Totais por Categoria
            </h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Categoria</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Receitas
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Despesas
                  </th>
                  <th className="px-6 py-4 font-semibold text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categoryTotals.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {c.description}
                    </td>
                    <td className="px-6 py-4 text-green-600 text-right">
                      {formatMoney(c.income)}
                    </td>
                    <td className="px-6 py-4 text-red-600 text-right">
                      {formatMoney(c.expense)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${c.balance >= 0 ? "text-blue-600" : "text-red-600"}`}
                    >
                      {formatMoney(c.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Rodapé exigido pelo teste (Total Geral) */}
              <tfoot className="bg-gray-50 font-bold border-t-2 border-gray-100">
                <tr>
                  <td className="px-6 py-4 text-gray-800 uppercase text-xs tracking-wider">
                    Total Geral
                  </td>
                  <td className="px-6 py-4 text-green-600 text-right">
                    {formatMoney(grandTotalCategory.income)}
                  </td>
                  <td className="px-6 py-4 text-red-600 text-right">
                    {formatMoney(grandTotalCategory.expense)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right ${grandTotalCategory.balance >= 0 ? "text-blue-600" : "text-red-600"}`}
                  >
                    {formatMoney(grandTotalCategory.balance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
