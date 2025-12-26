import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wallet, TrendingUp, Calendar, Building2, Briefcase, Gift } from "lucide-react";

interface Entrada {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
  type: "salary" | "freelance" | "investment" | "bonus" | "other";
  recurring: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  salary: Building2,
  freelance: Briefcase,
  investment: TrendingUp,
  bonus: Gift,
  other: Wallet,
};

const mockEntradas: Entrada[] = [
  {
    id: "1",
    description: "Salário - Empresa XYZ",
    value: 6500,
    date: "05/12/2024",
    category: "Salário",
    type: "salary",
    recurring: true,
  },
  {
    id: "2",
    description: "Freelance - Website",
    value: 2500,
    date: "15/12/2024",
    category: "Freelance",
    type: "freelance",
    recurring: false,
  },
  {
    id: "3",
    description: "Dividendos - Ações",
    value: 450,
    date: "20/12/2024",
    category: "Investimentos",
    type: "investment",
    recurring: true,
  },
  {
    id: "4",
    description: "Bônus Anual",
    value: 3200,
    date: "20/12/2024",
    category: "Bônus",
    type: "bonus",
    recurring: false,
  },
];

const Entradas = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totalMensal = mockEntradas.reduce((acc, e) => acc + e.value, 0);
  const recorrentes = mockEntradas.filter((e) => e.recurring).reduce((acc, e) => acc + e.value, 0);
  const extras = mockEntradas.filter((e) => !e.recurring).reduce((acc, e) => acc + e.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Entradas</h1>
          <p className="text-muted-foreground">Gerencie suas fontes de renda</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Entrada
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="success" className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total do Mês</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(totalMensal)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recorrentes</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(recorrentes)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Extras</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(extras)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Gift className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {mockEntradas.map((entrada, index) => {
          const Icon = iconMap[entrada.type] || iconMap.other;
          
          return (
            <Card
              key={entrada.id}
              variant="glass"
              className="animate-slide-up hover:border-success/50 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-success" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{entrada.description}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {entrada.category}
                          </Badge>
                          {entrada.recurring && (
                            <Badge variant="outline" className="text-xs text-primary border-primary/30">
                              Recorrente
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-success">{formatCurrency(entrada.value)}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end mt-1">
                          <Calendar className="w-3 h-3" />
                          {entrada.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Entradas;
