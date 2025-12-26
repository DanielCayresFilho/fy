import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, CreditCard, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartaoCredito {
  id: string;
  name: string;
  lastDigits: string;
  limit: number;
  used: number;
  available: number;
  dueDay: number;
  closingDay: number;
  color: string;
  brand: string;
}

const mockCartoes: CartaoCredito[] = [
  {
    id: "1",
    name: "Nubank",
    lastDigits: "4521",
    limit: 8000,
    used: 3450.75,
    available: 4549.25,
    dueDay: 15,
    closingDay: 8,
    color: "purple",
    brand: "Mastercard",
  },
  {
    id: "2",
    name: "Inter",
    lastDigits: "8832",
    limit: 5000,
    used: 4200,
    available: 800,
    dueDay: 10,
    closingDay: 3,
    color: "orange",
    brand: "Mastercard",
  },
  {
    id: "3",
    name: "C6 Bank",
    lastDigits: "2291",
    limit: 12000,
    used: 2800,
    available: 9200,
    dueDay: 20,
    closingDay: 13,
    color: "blue",
    brand: "Visa",
  },
];

const getGradientByColor = (color: string) => {
  const gradients: Record<string, string> = {
    purple: "from-purple-500 via-purple-600 to-purple-900",
    blue: "from-blue-500 via-blue-600 to-blue-900",
    green: "from-emerald-500 via-emerald-600 to-emerald-900",
    orange: "from-orange-500 via-orange-600 to-orange-900",
    pink: "from-pink-500 via-pink-600 to-pink-900",
  };
  return gradients[color] || gradients.purple;
};

const Cartoes = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totalLimit = mockCartoes.reduce((acc, c) => acc + c.limit, 0);
  const totalUsed = mockCartoes.reduce((acc, c) => acc + c.used, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cartões de Crédito</h1>
          <p className="text-muted-foreground">Gerencie seus cartões e limites</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Cartão
        </Button>
      </div>

      {/* Summary */}
      <Card variant="glow" className="animate-fade-in">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Limite Total</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalLimit)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Utilizado</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(totalUsed)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Disponível</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(totalLimit - totalUsed)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">% Utilizado</p>
              <p className="text-2xl font-bold text-primary">{((totalUsed / totalLimit) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockCartoes.map((cartao, index) => {
          const usagePercentage = (cartao.used / cartao.limit) * 100;
          
          return (
            <div
              key={cartao.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Visual */}
              <div
                className={cn(
                  "w-full aspect-[1.6/1] rounded-2xl bg-gradient-to-br p-6 flex flex-col justify-between relative overflow-hidden shadow-xl",
                  getGradientByColor(cartao.color)
                )}
              >
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-foreground/10" />
                <div className="absolute -right-4 top-16 w-20 h-20 rounded-full bg-foreground/5" />

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-foreground/70 text-sm font-medium">{cartao.name}</p>
                    <p className="text-foreground text-xs mt-1">{cartao.brand}</p>
                  </div>
                  <Wifi className="w-8 h-8 text-foreground/50 rotate-90" />
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md" />
                  </div>
                  
                  <div className="flex items-center gap-2 font-mono text-foreground tracking-widest">
                    <span className="text-foreground/50">••••</span>
                    <span className="text-foreground/50">••••</span>
                    <span className="text-foreground/50">••••</span>
                    <span>{cartao.lastDigits}</span>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <Card variant="glass" className="mt-4">
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Limite usado</span>
                      <span className="font-medium">{usagePercentage.toFixed(0)}%</span>
                    </div>
                    <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
                          usagePercentage >= 80 ? "bg-destructive" :
                          usagePercentage >= 50 ? "bg-warning" : "bg-success"
                        )}
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Utilizado</p>
                      <p className="font-semibold text-foreground">{formatCurrency(cartao.used)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Disponível</p>
                      <p className="font-semibold text-success">{formatCurrency(cartao.available)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vencimento</p>
                      <p className="font-semibold text-foreground">Dia {cartao.dueDay}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fechamento</p>
                      <p className="font-semibold text-foreground">Dia {cartao.closingDay}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cartoes;
