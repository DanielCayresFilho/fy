import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, XCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  title: string;
  dueDate: string;
  value: number;
  status: "upcoming" | "overdue";
}

interface AlertsWidgetProps {
  alerts: Alert[];
  delay?: number;
}

const AlertsWidget = ({ alerts, delay = 0 }: AlertsWidgetProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const upcomingAlerts = alerts.filter((a) => a.status === "upcoming");
  const overdueAlerts = alerts.filter((a) => a.status === "overdue");

  return (
    <Card 
      variant="glass" 
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Alertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upcoming bills */}
        {upcomingAlerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-warning flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Próximas do vencimento
            </p>
            {upcomingAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20 hover:bg-warning/15 transition-colors cursor-pointer group"
              >
                <div>
                  <p className="font-medium text-foreground">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">Vence em {alert.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-warning">{formatCurrency(alert.value)}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-warning transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overdue bills */}
        {overdueAlerts.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-destructive flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Atrasadas
            </p>
            {overdueAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20 hover:bg-destructive/15 transition-colors cursor-pointer group"
              >
                <div>
                  <p className="font-medium text-foreground">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">Venceu em {alert.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-destructive">{formatCurrency(alert.value)}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum alerta no momento</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsWidget;
