import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { LeadershipTable } from "@/components/LeadershipTable";
import { MetricsChart } from "@/components/MetricsChart";
import { StatCard } from "@/components/StatCard"; // Update the import to use the new StatCard
import { calculateStats, getPercentageColor } from "@/utils/dashboardUtils";
import { Leader } from "@/types/database.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import * as XLSX from 'xlsx';
import { Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<Leader[]>([]);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [newCompleted, setNewCompleted] = useState(0);
  const [newMeta, setNewMeta] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const { data: leaders, error } = await supabase
        .from('leaders')
        .select('*')
        .order('leader_id', { ascending: true });

      if (error) throw error;
      setData(leaders || []);
    } catch (error) {
      console.error('Error fetching leaders:', error);
      toast.error('Error loading leaders data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const stats = calculateStats(filteredData);

  const handleAddCompleted = async () => {
    if (selectedLeader && newCompleted >= 0) {
      try {
        const updatedCompleted = isEditing ? newCompleted : selectedLeader.completed + newCompleted;
        const updatedMeta = isEditing ? newMeta : (newMeta > 0 ? newMeta : selectedLeader.meta);
        const updatedPercentage = Math.round((updatedCompleted / updatedMeta) * 100);

        const { error } = await supabase
          .from('leaders')
          .update({
            completed: updatedCompleted,
            meta: updatedMeta,
            percentage: updatedPercentage
          })
          .eq('id', selectedLeader.id);

        if (error) throw error;

        await fetchLeaders();
        toast.success('Leader data updated successfully');
      } catch (error) {
        console.error('Error updating leader:', error);
        toast.error('Error updating leader data');
      }

      setNewCompleted(0);
      setNewMeta(0);
      setSelectedLeader(null);
      setIsEditing(false);
    }
  };

  const exportToExcel = () => {
    const excelData = data.map((item) => ({
      'Seq': item.leader_id,
      'Líderes': item.name,
      'Meta': item.meta,
      'Inscrições': item.completed,
      'Percentual': `${item.percentage}%`
    }));

    const totalRow = {
      'Seq': 'TOTAL',
      'Líderes': '',
      'Meta': data.reduce((sum, item) => sum + item.meta, 0),
      'Inscrições': data.reduce((sum, item) => sum + item.completed, 0),
      'Percentual': `${Math.round((data.reduce((sum, item) => sum + item.completed, 0) / data.reduce((sum, item) => sum + item.meta, 0)) * 100)}%`
    };
    excelData.push(totalRow);

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Definir largura das colunas
    const colWidths = [
      { wch: 5 },  // Seq
      { wch: 30 }, // Líderes
      { wch: 8 },  // Meta
      { wch: 10 }, // Inscrições
      { wch: 10 }  // Percentual
    ];
    worksheet['!cols'] = colWidths;

    // Estilo do cabeçalho (fundo preto com texto verde)
    const headerStyle = {
      fill: { 
        patternType: "solid",
        fgColor: { rgb: "000000" } 
      },
      font: { 
        color: { rgb: "00FF00" },
        bold: true,
        name: "Arial",
        sz: 11
      },
      alignment: {
        horizontal: "center",
        vertical: "center"
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    // Estilo para linhas com 100% ou mais (fundo verde com texto preto)
    const successStyle = {
      fill: { 
        patternType: "solid",
        fgColor: { rgb: "00FF00" } 
      },
      font: { 
        color: { rgb: "000000" },
        bold: true,
        name: "Arial",
        sz: 11
      },
      alignment: {
        horizontal: "center",
        vertical: "center"
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    // Estilo padrão para outras linhas
    const defaultStyle = {
      font: { 
        name: "Arial",
        sz: 11
      },
      alignment: {
        horizontal: "center",
        vertical: "center"
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    // Aplicar estilos às células
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    
    // Aplicar estilo ao cabeçalho
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[address]) continue;
      worksheet[address].s = headerStyle;
    }

    // Aplicar estilos às linhas de dados
    excelData.forEach((row, idx) => {
      if (idx === 0) return; // Pular cabeçalho
      
      const percentage = parseInt(row.Percentual);
      const style = percentage >= 100 ? successStyle : defaultStyle;
      
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: idx, c: C });
        if (!worksheet[address]) continue;
        worksheet[address].s = style;
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Arena Xperience 2025");
    
    // Salvar o arquivo
    XLSX.writeFile(workbook, "Arena Xperience 2025.xlsx");
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-2 sm:p-4 space-y-4">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Arena Xperience Adrenalina 2025</h1>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full sm:w-auto">
                  Adicionar Inscrições
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Editar Inscrições" : "Adicionar Inscrições"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="leader">Selecione o Líder</Label>
                    <select
                      id="leader"
                      className="w-full p-2 border rounded-md"
                      value={selectedLeader?.id || ""}
                      onChange={(e) => {
                        const leader = data.find(l => l.id === e.target.value);
                        setSelectedLeader(leader || null);
                        if (leader && isEditing) {
                          setNewCompleted(leader.completed);
                          setNewMeta(leader.meta);
                        }
                      }}
                    >
                      <option value="">Selecione um líder</option>
                      {data.map((leader) => (
                        <option key={leader.id} value={leader.id}>
                          {leader.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedLeader && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="meta">Meta Total</Label>
                        <Input
                          id="meta"
                          type="number"
                          min={0}
                          value={isEditing ? newMeta : selectedLeader.meta}
                          onChange={(e) => setNewMeta(parseInt(e.target.value) || 0)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="completed">
                          {isEditing ? "Total de Inscrições" : "Novas Inscrições"}
                        </Label>
                        <Input
                          id="completed"
                          type="number"
                          min={0}
                          value={newCompleted}
                          onChange={(e) => setNewCompleted(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          {isEditing ? "Modo Adicionar" : "Modo Edição"}
                        </Button>
                        <Button onClick={handleAddCompleted}>
                          {isEditing ? "Salvar Alterações" : "Adicionar"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Excel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Exportar dados</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                  <Label>Confirmar exportação dos dados para Excel?</Label>
                  <Button onClick={exportToExcel}>Exportar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <StatCard stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="w-full overflow-x-auto rounded-lg border bg-white">
          <div className="min-w-full">
            <LeadershipTable
              data={filteredData}
              setSelectedLeader={setSelectedLeader}
              setIsEditing={setIsEditing}
            />
          </div>
        </div>
        <div className="w-full h-[400px] bg-white rounded-lg border p-4">
          <MetricsChart data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default Index;