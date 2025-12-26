import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Check, Clock, AlertTriangle, ChevronLeft, ChevronRight, Loader2, Filter, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { movimentationService, dashboardService, MonthMovimentation, Balance } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const Movimentacao = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'late'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'fix' | 'variable' | 'credit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Buscar movimentações
  const { data: movimentacoes = [], isLoading: loadingMovimentacoes } = useQuery({
    queryKey: ['movimentacoes', currentMonth, currentYear],
    queryFn: () => movimentationService.list(currentMonth, currentYear),
  });

  // Buscar resumo
  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ['movimentacoes-summary', currentMonth, currentYear],
    queryFn: () => movimentationService.summary(currentMonth, currentYear),
  });

  // Buscar saldo
  const { data: balance, isLoading: loadingBalance } = useQuery({
    queryKey: ['balance', currentMonth, currentYear],
    queryFn: () => dashboardService.getBalance(currentMonth, currentYear),
  });

  // Atualizar contas atrasadas ao carregar
  useEffect(() => {
    movimentationService.updateLate(currentMonth, currentYear).catch(console.error);
  }, [currentMonth, currentYear]);

  // Mutation para marcar como pago
  const markAsPaidMutation = useMutation({
    mutationFn: (id: number) => movimentationService.markAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimentacoes'] });
      queryClient.invalidateQueries({ queryKey: ['movimentacoes-summary'] });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast({
        title: "Sucesso",
        description: "Conta marcada como paga",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao marcar conta como paga",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numValue || 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return { 
          icon: Check, 
          label: "Pago", 
          bgClass: "bg-success/10 border-success/30", 
          textClass: "text-success",
          badgeVariant: "default" as const
        };
      case "pending":
        return { 
          icon: Clock, 
          label: "Pendente", 
          bgClass: "bg-warning/10 border-warning/30", 
          textClass: "text-warning",
          badgeVariant: "secondary" as const
        };
      case "late":
        return { 
          icon: AlertTriangle, 
          label: "Atrasado", 
          bgClass: "bg-destructive/10 border-destructive/30", 
          textClass: "text-destructive",
          badgeVariant: "destructive" as const
        };
      default:
        return { 
          icon: Clock, 
          label: "Pendente", 
          bgClass: "bg-secondary", 
          textClass: "text-muted-foreground",
          badgeVariant: "secondary" as const
        };
    }
  };

  const toggleStatus = (mov: MonthMovimentation) => {
    if (mov.status !== "paid") {
      markAsPaidMutation.mutate(mov.id);
    } else {
      toast({
        title: "Aviso",
        description: "Esta conta já está paga",
      });
    }
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const isLoading = loadingMovimentacoes || loadingSummary || loadingBalance;

  // Calcular totais
  const totalExpenses = summary?.summary?.total_amount || 0;
  const paidExpenses = summary?.summary?.paid_amount || 0;
  const pendingExpenses = summary?.summary?.pending_amount || 0;
  const lateExpenses = summary?.summary?.late_amount || 0;
  
  const totalIncome = balance ? parseFloat(balance.total_income.toString()) : 0;
  const currentBalance = balance ? parseFloat(balance.current_balance?.toString() || '0') : 0;
  const projectedBalance = balance ? parseFloat(balance.projected_balance?.toString() || '0') : 0;

  // Filtrar movimentações
  const filteredMovimentacoes = movimentacoes.filter((mov) => {
    // Filtro por status
    if (statusFilter !== 'all' && mov.status !== statusFilter) {
      return false;
    }
    
    // Filtro por tipo
    if (typeFilter !== 'all' && mov.account_type !== typeFilter) {
      return false;
    }
    
    // Filtro por busca (nome)
    if (searchQuery && !mov.account_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || searchQuery !== '';

  const clearFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Movimentação Mensal</h1>
          <p className="text-muted-foreground">Controle suas contas do mês</p>
        </div>
        
        {/* Month Selector */}
        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => changeMonth('prev')}
            disabled={isLoading}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-medium text-foreground px-3">
            {monthNames[currentMonth - 1]} {currentYear}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => changeMonth('next')}
            disabled={isLoading}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card variant="glass" className="animate-fade-in bg-black/20 border-red-500/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Saldo Atual</p>
            <p className={cn(
              "text-xl font-bold",
              currentBalance >= 0 ? "text-red-500" : "text-red-700"
            )}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : formatCurrency(currentBalance)}
            </p>
          </CardContent>
        </Card>
        
        <Card variant="destructive" className="animate-fade-in" style={{ animationDelay: "50ms" }}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Saídas</p>
            <p className="text-xl font-bold text-destructive">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : formatCurrency(totalExpenses)}
            </p>
          </CardContent>
        </Card>
        
        <Card variant="glass" className="animate-fade-in bg-black/20 border-green-500/30" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Check className="w-3 h-3 text-green-500" /> Pago
            </p>
            <p className="text-xl font-bold text-green-500">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : formatCurrency(paidExpenses)}
            </p>
          </CardContent>
        </Card>
        
        <Card variant="glass" className="animate-fade-in bg-black/20 border-yellow-500/30" style={{ animationDelay: "150ms" }}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-yellow-500" /> Pendente
            </p>
            <p className="text-xl font-bold text-yellow-500">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : formatCurrency(pendingExpenses)}
            </p>
          </CardContent>
        </Card>
        
        <Card variant="glass" className="animate-fade-in bg-black/20 border-red-500/50" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-500" /> Atrasado
            </p>
            <p className="text-xl font-bold text-red-500">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : formatCurrency(lateExpenses)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Card */}
      {balance && (
        <Card variant="glass" className="bg-gradient-to-r from-black/40 to-red-950/40 border-red-500/30">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Entradas do Mês</p>
                <p className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
                <p className={cn(
                  "text-2xl font-bold",
                  currentBalance >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {formatCurrency(currentBalance)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saldo Projetado</p>
                <p className={cn(
                  "text-2xl font-bold",
                  projectedBalance >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {formatCurrency(projectedBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Movements List */}
      <Card variant="glass" className="animate-slide-up bg-black/20 border-red-500/20" style={{ animationDelay: "250ms" }}>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-red-500" />
              Contas do Mês
            </CardTitle>
            
            {/* Filtros */}
            <div className="flex flex-col gap-3">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-black/30 border-red-500/30"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtros de Status e Tipo */}
              <div className="flex flex-wrap gap-2">
                {/* Filtro de Status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Filter className="w-4 h-4" />
                    Status:
                  </span>
                  {(['all', 'paid', 'pending', 'late'] as const).map((status) => {
                    const labels = {
                      all: 'Todos',
                      paid: 'Pago',
                      pending: 'Pendente',
                      late: 'Atrasado'
                    };
                    
                    const isActive = statusFilter === status;
                    
                    return (
                      <Button
                        key={status}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                          "h-8 text-xs",
                          isActive 
                            ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
                            : "bg-black/30 border-red-500/30 hover:bg-black/50"
                        )}
                      >
                        {labels[status]}
                      </Button>
                    );
                  })}
                </div>

                {/* Filtro de Tipo */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  {(['all', 'fix', 'variable', 'credit'] as const).map((type) => {
                    const labels = {
                      all: 'Todos',
                      fix: 'Fixa',
                      variable: 'Variável',
                      credit: 'Crédito'
                    };
                    
                    const isActive = typeFilter === type;
                    
                    return (
                      <Button
                        key={type}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTypeFilter(type)}
                        className={cn(
                          "h-8 text-xs",
                          isActive 
                            ? "bg-red-500 hover:bg-red-600 text-white border-red-500" 
                            : "bg-black/30 border-red-500/30 hover:bg-black/50"
                        )}
                      >
                        {labels[type]}
                      </Button>
                    );
                  })}
                </div>

                {/* Botão Limpar Filtros */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 ml-auto"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>

              {/* Contador de resultados */}
              {hasActiveFilters && (
                <div className="text-sm text-muted-foreground">
                  Mostrando {filteredMovimentacoes.length} de {movimentacoes.length} movimentações
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
          ) : movimentacoes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhuma movimentação encontrada para este mês</p>
              <p className="text-sm mt-2">Gere as movimentações do mês para começar</p>
            </div>
          ) : filteredMovimentacoes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhuma movimentação encontrada com os filtros aplicados</p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-4 border-red-500/30 hover:bg-red-500/10"
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMovimentacoes.map((mov) => {
                const statusConfig = getStatusConfig(mov.status);
                const StatusIcon = statusConfig.icon;
                const isChecked = mov.status === "paid";
                
                return (
                  <div
                    key={mov.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 hover:bg-black/30",
                      statusConfig.bgClass
                    )}
                  >
                    {/* Checkbox */}
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleStatus(mov)}
                      disabled={markAsPaidMutation.isPending}
                      className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={cn(
                          "font-medium truncate",
                          isChecked && "line-through text-muted-foreground"
                        )}>
                          {mov.account_name}
                        </h4>
                        <Badge variant="secondary" className="text-xs hidden sm:inline-flex bg-black/50">
                          {mov.account_type === 'fix' ? 'Fixa' : mov.account_type === 'variable' ? 'Variável' : 'Crédito'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Vence: {formatDate(mov.due_date)}</p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <div className={cn("flex items-center gap-1 text-sm", statusConfig.textClass)}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">{statusConfig.label}</span>
                      </div>
                    </div>

                    {/* Value */}
                    <div className={cn(
                      "text-right font-bold",
                      statusConfig.textClass
                    )}>
                      - {formatCurrency(mov.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Movimentacao;
