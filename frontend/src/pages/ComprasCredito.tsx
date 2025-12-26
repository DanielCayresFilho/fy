import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart, CreditCard, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompraCredito {
  id: string;
  description: string;
  value: number;
  installments: number;
  currentInstallment: number;
  installmentValue: number;
  cardName: string;
  purchaseDate: string;
  category: string;
}

const mockCompras: CompraCredito[] = [
  {
    id: "1",
    description: "iPhone 15 Pro Max",
    value: 9499,
    installments: 12,
    currentInstallment: 4,
    installmentValue: 791.58,
    cardName: "Nubank",
    purchaseDate: "15/09/2024",
    category: "Eletrônicos",
  },
  {
    id: "2",
    description: "Smart TV Samsung 65\"",
    value: 3499,
    installments: 10,
    currentInstallment: 2,
    installmentValue: 349.90,
    cardName: "Inter",
    purchaseDate: "20/11/2024",
    category: "Eletrônicos",
  },
  {
    id: "3",
    description: "Passagem aérea - Cancun",
    value: 4800,
    installments: 6,
    currentInstallment: 1,
    installmentValue: 800,
    cardName: "C6 Bank",
    purchaseDate: "01/12/2024",
    category: "Viagem",
  },
  {
    id: "4",
    description: "Curso Full Stack",
    value: 1997,
    installments: 12,
    currentInstallment: 8,
    installmentValue: 166.42,
    cardName: "Nubank",
    purchaseDate: "10/05/2024",
    category: "Educação",
  },
];

const ComprasCredito = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totalMensal = mockCompras.reduce((acc, c) => acc + c.installmentValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compras no Crédito</h1>
          <p className="text-muted-foreground">Todas as suas compras parceladas no cartão</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Compra
        </Button>
      </div>

      {/* Summary */}
      <Card variant="glow" className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Parcelas do Mês</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(totalMensal)}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchases List */}
      <div className="space-y-4">
        {mockCompras.map((compra, index) => {
          const progressPercentage = (compra.currentInstallment / compra.installments) * 100;
          
          return (
            <Card
              key={compra.id}
              variant="glass"
              className="animate-slide-up hover:border-primary/50 transition-colors"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{compra.description}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {compra.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-3">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        {compra.cardName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {compra.purchaseDate}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Parcela {compra.currentInstallment} de {compra.installments}
                        </span>
                        <span className="font-medium text-primary">{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
                            progressPercentage >= 80 ? "bg-success" : "bg-primary"
                          )}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Values */}
                  <div className="flex items-center gap-6 lg:border-l lg:border-border lg:pl-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Parcela</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(compra.installmentValue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold text-foreground">{formatCurrency(compra.value)}</p>
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

export default ComprasCredito;
