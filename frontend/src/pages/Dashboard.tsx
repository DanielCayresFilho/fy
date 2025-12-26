import BalanceCard from "@/components/dashboard/BalanceCard";
import CreditCardWidget from "@/components/dashboard/CreditCardWidget";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import PaymentStatusChart from "@/components/dashboard/PaymentStatusChart";
import AlertsWidget from "@/components/dashboard/AlertsWidget";

// Mock data
const creditCards = [
  {
    id: "1",
    name: "Nubank",
    lastDigits: "4521",
    limit: 8000,
    used: 3450.75,
    color: "purple",
    dueDate: 15,
  },
  {
    id: "2",
    name: "Inter",
    lastDigits: "8832",
    limit: 5000,
    used: 4200,
    color: "orange",
    dueDate: 10,
  },
];

const expenseCategories = [
  { name: "Moradia", value: 2500, color: "hsl(174, 72%, 56%)" },
  { name: "Alimentação", value: 1200, color: "hsl(142, 71%, 45%)" },
  { name: "Transporte", value: 800, color: "hsl(38, 92%, 50%)" },
  { name: "Lazer", value: 600, color: "hsl(280, 70%, 55%)" },
  { name: "Saúde", value: 450, color: "hsl(0, 72%, 51%)" },
  { name: "Outros", value: 350, color: "hsl(220, 20%, 45%)" },
];

const paymentStatusData = [
  { name: "Pago", value: 4500, status: "paid" as const },
  { name: "Pendente", value: 1800, status: "pending" as const },
  { name: "Atrasado", value: 600, status: "overdue" as const },
];

const alerts = [
  { id: "1", title: "Conta de Luz", dueDate: "2 dias", value: 180.50, status: "upcoming" as const },
  { id: "2", title: "Internet", dueDate: "3 dias", value: 129.90, status: "upcoming" as const },
  { id: "3", title: "Cartão Nubank", dueDate: "20/12", value: 3450.75, status: "overdue" as const },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BalanceCard
          title="Saldo Atual"
          value={12450.80}
          type="balance"
          delay={0}
        />
        <BalanceCard
          title="Entradas do Mês"
          value={8500}
          type="income"
          change={12}
          delay={100}
        />
        <BalanceCard
          title="Gastos do Mês"
          value={5900.20}
          type="expense"
          change={-8}
          delay={200}
        />
        <BalanceCard
          title="Saldo Projetado"
          value={2600.80}
          type="projected"
          delay={300}
        />
      </div>

      {/* Charts and Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CreditCardWidget cards={creditCards} delay={400} />
        <ExpenseChart data={expenseCategories} delay={500} />
        <PaymentStatusChart data={paymentStatusData} delay={600} />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsWidget alerts={alerts} delay={700} />
      </div>
    </div>
  );
};

export default Dashboard;
