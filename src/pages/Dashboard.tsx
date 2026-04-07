import { Wallet, TrendingDown, Users } from "lucide-react";
import { SummaryCard } from "../components/dashboard/SummaryCard";

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Dashboard de Despesas
        </h2>
        <p className="text-gray-500 mt-1">
          Acompanhe os gastos da sua casa de forma simples.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total de Despesas"
          amount="R$ 3.450,00"
          icon={Wallet}
          iconColorClass="text-blue-600"
          iconBgClass="bg-blue-50"
        />
        <SummaryCard
          title="Sua Parte (Vitor)"
          amount="R$ 1.725,00"
          icon={Users}
          iconColorClass="text-purple-600"
          iconBgClass="bg-purple-50"
        />
        <SummaryCard
          title="Maior Categoria (Casa)"
          amount="R$ 1.200,00"
          icon={TrendingDown}
          iconColorClass="text-red-600"
          iconBgClass="bg-red-50"
        />
      </div>
    </div>
  );
}
