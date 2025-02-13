
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';

const Department = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleMenuToggle = (isOpen: boolean) => {
    setIsMenuExpanded(isOpen);
  };

  return (
    <div className="min-h-screen">
      <SidePanel 
        onTabChange={handleTabChange} 
        onMenuToggle={handleMenuToggle}
      />
      <div 
        className={`transition-all duration-300 ${
          isMenuExpanded ? 'pl-64' : 'pl-16'
        }`}
      >
        <div className="p-8">
          <h1>Department {id}</h1>
        </div>
      </div>
    </div>
  );
};

export default Department;
