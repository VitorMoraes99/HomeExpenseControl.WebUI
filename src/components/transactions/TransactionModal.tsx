import { X } from "lucide-react";
import { useState } from "react"; // <-- Repare que tiramos o useEffect daqui!

// Mocks temporários
const mockPeople = [
  { id: 1, name: "Vitor Moraes", age: 26 },
  { id: 2, name: "João da Silva", age: 45 },
  { id: 3, name: "Maria Oliveira", age: 17 },
];

const mockCategories = [
  { id: 1, description: "Alimentação", purpose: "despesa" },
  { id: 2, description: "Salário", purpose: "receita" },
  { id: 3, description: "Vendas Diversas", purpose: "ambas" },
];

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionModal({ isOpen, onClose }: TransactionModalProps) {
  const [personId, setPersonId] = useState("");
  const [type, setType] = useState("despesa");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // 1. Regra do Menor de Idade executada no momento da escolha
  const handlePersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setPersonId(selectedId);

    const selectedPerson = mockPeople.find((p) => p.id === Number(selectedId));
    if (selectedPerson && selectedPerson.age < 18) {
      setType("despesa"); // Força despesa
      setCategoryId(""); // Zera a categoria por precaução
    }
  };

  // 2. Regra de Categoria executada no momento em que o tipo muda
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value);
    setCategoryId(""); // Sempre que trocar o tipo, zera a categoria escolhida para não dar erro
  };

  // Filtra as categorias disponíveis com base no Tipo da transação
  const filteredCategories = mockCategories.filter(
    (cat) => cat.purpose === type || cat.purpose === "ambas",
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando transação:", {
      personId,
      type,
      categoryId,
      description,
      amount,
    });

    // Reset e Fechar
    setPersonId("");
    setType("despesa");
    setCategoryId("");
    setDescription("");
    setAmount("");
    onClose();
  };

  const selectedPerson = mockPeople.find((p) => p.id === Number(personId));
  const isMinor = selectedPerson ? selectedPerson.age < 18 : false;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Nova Transação</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pessoa
            </label>
            <select
              required
              value={personId}
              onChange={handlePersonChange} // <-- Usando a nova função aqui
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Selecione uma pessoa...</option>
              {mockPeople.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.age} anos)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={handleTypeChange} // <-- Usando a nova função aqui
                disabled={isMinor}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="despesa">Despesa</option>
                <option value="receita" disabled={isMinor}>
                  Receita {isMinor && "(Bloqueado: < 18)"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                required
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={!type}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100"
            >
              <option value="">Selecione...</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.description}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Mostrando categorias permitidas para {type}.
            </p>
          </div>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Compra do mês no mercado"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
