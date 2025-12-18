import { useState } from "react";
import PropertySearch from "./PropertySearch";
import PropertyDetail from "./PropertyDetail";
import "./InvestorDashboard.css";

function InvestorDashboard({ userName }) {
  const [tabs, setTabs] = useState([{ id: 'search', name: 'Search', type: 'search' }]);
  const [activeTab, setActiveTab] = useState('search');

  const initials =
    userName
      .split(" ")
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?";

  const handleOpenPropertyDetail = (property) => {
    const existingTab = tabs.find(tab => tab.type === 'property' && tab.propertyId === property.id);
    
    if (existingTab) {
      // Tab already exists, just switch to it
      setActiveTab(existingTab.id);
    } else {
      // Check if we've reached max tabs (1 search + 5 properties = 6 total)
      const propertyTabs = tabs.filter(tab => tab.type === 'property');
      
      if (propertyTabs.length >= 5) {
        // Reuse the first property tab
        const firstPropertyTab = propertyTabs[0];
        const updatedTabs = tabs.map(tab => 
          tab.id === firstPropertyTab.id 
            ? { id: firstPropertyTab.id, name: property.name, type: 'property', propertyId: property.id, property }
            : tab
        );
        setTabs(updatedTabs);
        setActiveTab(firstPropertyTab.id);
      } else {
        // Create new tab
        const newTab = {
          id: `property-${property.id}`,
          name: property.name,
          type: 'property',
          propertyId: property.id,
          property
        };
        setTabs([...tabs, newTab]);
        setActiveTab(newTab.id);
      }
    }
  };

  const handleCloseTab = (tabId) => {
    if (tabId === 'search') return; // Can't close search tab
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    setTabs(newTabs);
    
    // If closing active tab, switch to search
    if (activeTab === tabId) {
      setActiveTab('search');
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <div>
          <h2>Co-own Investor</h2>
          <p className="header-subtitle">
            Search for properties across multiple cities
          </p>
        </div>
        <div className="profile-chip">
          <div className="profile-avatar">{initials}</div>
          <span className="profile-name">{userName}</span>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-name">{tab.name}</span>
            {tab.type === 'property' && (
              <button
                className="tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
                aria-label={`Close ${tab.name}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <main className="dashboard-main">
        <div className={`tab-content ${activeTab === 'search' ? 'active' : ''}`}>
          <PropertySearch onOpenProperty={handleOpenPropertyDetail} />
        </div>
        {tabs.filter(tab => tab.type === 'property').map(tab => (
          <div key={tab.id} className={`tab-content ${activeTab === tab.id ? 'active' : ''}`}>
            <PropertyDetail 
              property={tab.property} 
              onClose={() => handleCloseTab(tab.id)} 
            />
          </div>
        ))}
      </main>
    </div>
  );
}

export default InvestorDashboard;
