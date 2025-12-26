import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContaParcelada {
  id: string;
  name: string;
  totalValue: number;
  installmentValue: number;
  paidInstallments: number;
  totalInstallments: number;
  nextDueDate: string;
}

const mockParceladas: ContaParcelada[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    totalValue: 6499,
    installmentValue: 541.58,
    paidInstallments: 4,
    totalInstallments: 12,
    nextDueDate: "15/01/2025",
  },
  {
    id: "2",
    name: "Sofá Retrátil",
    totalValue: 3200,
    installmentValue: 320,
    paidInstallments: 7,
    totalInstallments: 10,
    nextDueDate: "20/01/2025",
  },
  {
    id: "3",
    name: "Notebook Dell",
    totalValue: 4500,
    installmentValue: 750,
    paidInstallments: 2,
    totalInstallments: 6,
    nextDueDate: "10/01/2025",
  },
  {
    id: "4",
    name: "Curso de Inglês",
    totalValue: 2400,
    installmentValue: 200,
    paidInstallments: 10,
    totalInstallments: 12,
    nextDueDate: "05/01/2025",
  },
];

const Parceladas = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const totalMensal = mockParceladas.reduce((acc, p) => acc + p.installmentValue, 0);
  const totalRestante = mockParceladas.reduce(
    (acc, p) => acc + p.installmentValue * (p.totalInstallments - p.paidInstallments),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contas Parceladas</h1>
          <p className="text-muted-foreground">Acompanhe suas compras parceladas</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Parcela
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card variant="glow" className="animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Parcelas do Mês</p>
                <p className="text-3xl font-bold text-foreground">{formatCurrency(totalMensal)}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass" className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Restante</p>
                <p className="text-3xl font-bold text-warning">{formatCurrency(totalRestante)}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-warning/20 flex items-center justify-center">
                <FileText className="w-7 h-7 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parceladas List */}
      <div className="space-y-4">
        {mockParceladas.map((parcela, index) => {
          const progressPercentage = (parcela.paidInstallments / parcela.totalInstallments) * 100;
          const remainingInstallments = parcela.totalInstallments - parcela.paidInstallments;
          
          return (
            <Card
              key={parcela.id}
              variant="glass"
              className="animate-slide-up hover:border-primary/50 transition-colors cursor-pointer group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{parcela.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {parcela.paidInstallments}/{parcela.totalInstallments} parcelas pagas
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors lg:hidden" />
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
                            progressPercentage >= 80 ? "bg-success" : "bg-primary"
                          )}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progressPercentage.toFixed(0)}% concluído</span>
                        <span>{remainingInstallments} restantes</span>
                      </div>
                    </div>
                  </div>

                  {/* Values */}
                  <div className="flex items-center gap-6 lg:gap-8">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Parcela</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(parcela.installmentValue)}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold text-foreground">{formatCurrency(parcela.totalValue)}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-sm text-muted-foreground">Próximo venc.</p>
                      <p className="text-sm font-medium text-foreground">{parcela.nextDueDate}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors hidden lg:block" />
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

export default Parceladas;
