
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';
import AreaEvolution from '@/components/area/AreaEvolution';
import AreaDiagnostic from '@/components/area/AreaDiagnostic';
import { getAreaInfo, getAreaEvolutionData } from '@/utils/areaData';

const Area = () => {
  const { id } = useParams();
  const [showChart, setShowChart] = useState(true);
  const [activeTab, setActiveTab] = useState('areas');

  const areaInfo = getAreaInfo(id);
  const evolutionData = getAreaEvolutionData(id);

  return (
    <div className="min-h-screen">
      <SidePanel onTabChange={setActiveTab} />
      <div className="pl-64">
        <div className="p-8">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {areaInfo.icon}
              <h1 className="text-3xl font-medium">{areaInfo.name}</h1>
            </div>
            <p className="text-dashboard-muted">{areaInfo.description}</p>
          </header>

          <div className="space-y-6">
            <AreaEvolution
              areaName={areaInfo.name}
              evolutionData={evolutionData}
              showChart={showChart}
              onToggleChart={() => setShowChart(!showChart)}
            />

            <AreaDiagnostic questions={areaInfo.questions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Area;
