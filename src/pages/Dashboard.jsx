import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budgetLimit] = useState(2000);
  const [categoryData, setCategoryData] = useState([]);

  const CATEGORIES = ["Food", "Transport", "Entertainment", "Other"];
  const COLORS = {
    Food: "#ef4444",
    Transport: "#f59e0b",
    Entertainment: "#8b5cf6",
    Other: "#6b7280"
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    try {
      const stored = localStorage.getItem("expenses");
      const allExpenses = stored ? JSON.parse(stored) : [];
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const monthExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
      });
      
      setExpenses(monthExpenses);
      
      const total = monthExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
      setTotalSpent(total);
      
      const categoryTotals = CATEGORIES.map(category => {
        const categoryTotal = monthExpenses
          .filter(expense => expense.category === category)
          .reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
        
        return {
          name: category,
          value: categoryTotal,
          color: COLORS[category]
        };
      }).filter(cat => cat.value > 0);
      
      setCategoryData(categoryTotals);
    } catch (error) {
      console.error("Error loading expenses:", error);
      setExpenses([]);
      setTotalSpent(0);
      setCategoryData([]);
    }
  };

  const remaining = budgetLimit - totalSpent;
  const percentageUsed = (totalSpent / budgetLimit) * 100;
  const isOverBudget = totalSpent > budgetLimit;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Budget Dashboard</h1>
          <p className="text-gray-400">Track your monthly spending and budget</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm font-medium">Total Spent</p>
              <TrendingUp className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              ${totalSpent.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{expenses.length} transactions</p>
          </div>

          <div className={cn(
            "bg-gray-900 border rounded-lg p-6",
            isOverBudget ? "border-red-500" : "border-gray-800"
          )}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm font-medium">Remaining</p>
              {isOverBudget ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <Wallet className="w-5 h-5 text-green-500" />
              )}
            </div>
            <p className={cn(
              "text-3xl font-bold mb-1",
              isOverBudget ? "text-red-500" : "text-green-500"
            )}>
              ${Math.abs(remaining).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {isOverBudget ? "Over budget" : "Under budget"}
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm font-medium">Budget Limit</p>
              <DollarSign className="w-5 h-5 text-[#0ea5e9]" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              ${budgetLimit.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">{percentageUsed.toFixed(1)}% used</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">Budget Progress</h2>
            <p className="text-sm text-gray-400">Monthly spending overview</p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isOverBudget ? "bg-red-500" : "bg-[#0ea5e9]"
              )}
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>$0</span>
            <span>${budgetLimit}</span>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Spending by Category</h2>
            <p className="text-sm text-gray-400">Breakdown of your expenses</p>
          </div>
          
          {categoryData.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1f2937", 
                      border: "1px solid #374151",
                      borderRadius: "8px"
                    }}
                    formatter={(value) => `$${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{category.name}</p>
                      <p className="text-xs text-gray-400">${category.value.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No expenses yet</p>
              <p className="text-gray-500 text-sm">Add some expenses to see your spending breakdown</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}