import type { ElementType } from "react";

interface SummaryCardProps {
  title: string;
  amount: string;
  icon: ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

export function SummaryCard({
  title,
  amount,
  icon: Icon,
  iconColorClass,
  iconBgClass,
}: SummaryCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${iconBgClass}`}>
        <Icon className={`w-6 h-6 ${iconColorClass}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{amount}</h3>
      </div>
    </div>
  );
}
