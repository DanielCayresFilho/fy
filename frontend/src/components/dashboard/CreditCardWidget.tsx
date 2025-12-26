import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditCardData {
  id: string;
  name: string;
  lastDigits: string;
  limit: number;
  used: number;
  color: string;
  dueDate: number;
}

interface CreditCardWidgetProps {
  cards: CreditCardData[];
  delay?: number;
}

const CreditCardWidget = ({ cards, delay = 0 }: CreditCardWidgetProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return "bg-destructive";
    if (percentage >= 50) return "bg-warning";
    return "bg-success";
  };

  const getGradientByColor = (color: string) => {
    const gradients: Record<string, string> = {
      purple: "from-purple-600 to-purple-900",
      blue: "from-blue-600 to-blue-900",
      green: "from-emerald-600 to-emerald-900",
      orange: "from-orange-600 to-orange-900",
      pink: "from-pink-600 to-pink-900",
    };
    return gradients[color] || gradients.purple;
  };

  return (
    <Card 
      variant="glass" 
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="w-5 h-5 text-primary" />
          Cartões de Crédito
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cards.map((card) => {
          const usagePercentage = (card.used / card.limit) * 100;
          
          return (
            <div
              key={card.id}
              className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              {/* Card visual */}
              <div className={cn(
                "w-full h-20 rounded-lg bg-gradient-to-br p-4 flex flex-col justify-between mb-4",
                getGradientByColor(card.color)
              )}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground/70 font-medium">{card.name}</span>
                  <div className="w-8 h-5 bg-foreground/20 rounded-sm" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground/50">••••</span>
                  <span className="text-foreground/50">••••</span>
                  <span className="text-foreground/50">••••</span>
                  <span className="text-sm font-mono text-foreground">{card.lastDigits}</span>
                </div>
              </div>

              {/* Usage info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Limite usado</span>
                  <span className="font-semibold">
                    {formatCurrency(card.used)} / {formatCurrency(card.limit)}
                  </span>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={usagePercentage} 
                    className="h-2 bg-secondary"
                  />
                  <div 
                    className={cn(
                      "absolute top-0 left-0 h-2 rounded-full transition-all duration-500",
                      getUsageColor(usagePercentage)
                    )}
                    style={{ width: `${usagePercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className={cn(
                    "font-medium",
                    usagePercentage >= 80 ? "text-destructive" : 
                    usagePercentage >= 50 ? "text-warning" : "text-success"
                  )}>
                    {usagePercentage.toFixed(0)}% utilizado
                  </span>
                  <span className="text-muted-foreground">
                    Vence dia {card.dueDate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default CreditCardWidget;
