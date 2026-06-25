import { useState, useEffect } from "react";
import { Trash2, Calendar, Tag, DollarSign } from "lucide-react";

export default function History() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    const stored = localStorage.getItem("expenses");
    if (stored) {
      const parsed = JSON.parse(stored);
      const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(sorted);
    }
  };

  const deleteExpense = (id) => {
    const updated = expenses.filter(exp => exp.id !== id);
    setExpenses(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: "bg-green-500/20 text-green-400 border-green-500/30",
      transport: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      entertainment: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      utilities: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      health: "bg-red-500/20 text-red-400 border-red-500/30",
      shopping: "bg-pink-500/20 text-pink-400 border-pink-500/30",
      other: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    };
    return colors[category?.toLowerCase()] || colors.other;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0ea5e9] mb-2">Expense History</h1>
          <p className="text-gray-400">View and manage all your recorded expenses</p>
        </div>

        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mb-6">
              <DollarSign className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">No expenses yet</h2>
            <p className="text-gray-500 text-center max-w-md">
              Start tracking your expenses to see them appear here. All data is stored locally in your browser.
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Category
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center justify-end gap-2">
                        <DollarSign className="w-4 h-4" />
                        Amount
                      </div>
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {expenses.map((expense) => (
                    <tr 
                      key={expense.id} 
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 px-6 text-gray-300">
                        {formatDate(expense.date)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(expense.category)}`}>
                          {expense.category || "Other"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {expense.description || "—"}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-[#0ea5e9]">
                        {formatAmount(expense.amount)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Total expenses: <span className="font-semibold text-gray-300">{expenses.length}</span>
                </span>
                <span className="text-gray-400">
                  Total amount: <span className="font-semibold text-[#0ea5e9]">
                    {formatAmount(expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0))}
                  </span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}