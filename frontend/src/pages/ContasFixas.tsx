import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Receipt, Pencil, Trash2, Zap, Wifi, Home, Droplets, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContaFixa {
  id: string;
  name: string;
  value: number;
  dueDay: number;
  category: string;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  electricity: Zap,
  internet: Wifi,
  rent: Home,
  water: Droplets,
  phone: Phone,
  default: Receipt,
};

const mockContas: ContaFixa[] = [
  { id: "1", name: "Energia Elétrica", value: 180.50, dueDay: 10, category: "Moradia", icon: "electricity" },
  { id: "2", name: "Internet", value: 129.90, dueDay: 15, category: "Moradia", icon: "internet" },
  { id: "3", name: "Aluguel", value: 1500, dueDay: 5, category: "Moradia", icon: "rent" },
  { id: "4", name: "Água", value: 85.40, dueDay: 20, category: "Moradia", icon: "water" },
  { id: "5", name: "Telefone", value: 59.90, dueDay: 12, category: "Comunicação", icon: "phone" },
];

const ContasFixas = () => {
  const [contas, setContas] = useState<ContaFixa[]>(mockContas);
  const [showForm, setShowForm] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const total = contas.reduce((acc, conta) => acc + conta.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contas Fixas</h1>
          <p className="text-muted-foreground">Gerencie suas despesas recorrentes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Conta
        </Button>
      </div>

      {/* Summary Card */}
      <Card variant="glow" className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Mensal</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(total)}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <Receipt className="w-7 h-7 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      {showForm && (
        <Card variant="glass" className="animate-scale-in">
          <CardHeader>
            <CardTitle>Adicionar Conta Fixa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input placeholder="Nome da conta" />
              <Input type="number" placeholder="Valor (R$)" />
              <Input type="number" placeholder="Dia do vencimento" min={1} max={31} />
              <Button className="w-full">Salvar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contas.map((conta, index) => {
          const Icon = iconMap[conta.icon] || iconMap.default;
          
          return (
            <Card
              key={conta.id}
              variant="glass"
              className="animate-slide-up hover:border-primary/50 transition-colors group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-foreground mb-1">{conta.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{conta.category}</p>
                
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-primary">{formatCurrency(conta.value)}</span>
                  <span className="text-sm text-muted-foreground">Dia {conta.dueDay}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContasFixas;
