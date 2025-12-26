import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BalanceCardProps {
  title: string;
  value: number;
  type: "balance" | "income" | "expense" | "projected";
  change?: number;
  delay?: number;
}

const BalanceCard = ({ title, value, type, change, delay = 0 }: BalanceCardProps) => {
  const isPositive = value >= 0;
  const isChangePositive = change !== undefined && change >= 0;

  const getVariant = () => {
    if (type === "income") return "success";
    if (type === "expense") return "destructive";
    if (type === "projected") return isPositive ? "success" : "destructive";
    return "glow";
  };

  const getIcon = () => {
    if (type === "income") return <ArrowUpRight className="w-5 h-5" />;
    if (type === "expense") return <ArrowDownRight className="w-5 h-5" />;
    if (type === "projected") return isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />;
    return null;
  };

  const getIconBgClass = () => {
    if (type === "income") return "bg-success/20 text-success";
    if (type === "expense") return "bg-destructive/20 text-destructive";
    if (type === "projected") return isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive";
    return "bg-primary/20 text-primary";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card 
      variant={getVariant()} 
      className="animate-slide-up hover:scale-[1.02] transition-transform duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {getIcon() && (
            <div className={cn("p-2 rounded-lg", getIconBgClass())}>
              {getIcon()}
            </div>
          )}
        </div>
        
        <div className={cn(
          "text-3xl font-bold tracking-tight",
          type === "projected" && (isPositive ? "text-success" : "text-destructive"),
          type === "income" && "text-success",
          type === "expense" && "text-destructive"
        )}>
          {formatCurrency(Math.abs(value))}
          {type === "expense" && <span className="text-muted-foreground text-lg ml-1">-</span>}
        </div>

        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-sm font-medium",
            isChangePositive ? "text-success" : "text-destructive"
          )}>
            {isChangePositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(change)}% vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
