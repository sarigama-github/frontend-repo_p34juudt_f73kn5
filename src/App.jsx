import { useState } from 'react'
import PlantForm from './components/PlantForm'
import GrowthLogForm from './components/GrowthLogForm'
import Dashboard from './components/Dashboard'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [lastCreatedPlant, setLastCreatedPlant] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_45%)]"></div>

      <header className="relative z-10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="Logo" className="w-8 h-8" />
          <h1 className="text-white font-semibold text-lg">Suivi Caféier</h1>
        </div>
        <nav className="flex gap-2">
          <Tab label="Dashboard" active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} />
          <Tab label="Nouvelle plante" active={activeTab==='plant'} onClick={()=>setActiveTab('plant')} />
          <Tab label="Journal" active={activeTab==='log'} onClick={()=>setActiveTab('log')} />
        </nav>
      </header>

      <main className="relative z-10 p-6 max-w-5xl mx-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-semibold">Vue d'ensemble</h2>
            <Dashboard />
          </div>
        )}

        {activeTab === 'plant' && (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-semibold">Créer une plante</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6">
              <PlantForm onCreated={(id)=>{ setLastCreatedPlant(id); setActiveTab('log') }} />
            </div>
          </div>
        )}

        {activeTab === 'log' && (
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-semibold">Ajouter un relevé</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
              <GrowthLogForm plantId={lastCreatedPlant || ''} onCreated={()=>setActiveTab('dashboard')} />
              {!lastCreatedPlant && <p className="text-blue-200/70 mt-2 text-sm">Astuce: créez d'abord une plante pour la sélectionner automatiquement ici.</p>}
            </div>
          </div>
        )}
      </main>

      <footer className="relative z-10 px-6 py-8 text-center text-blue-300/60">
        Suivi de l'évolution du caféier — stats, journal et capteurs en direct
      </footer>
    </div>
  )
}

function Tab({ label, active, onClick }){
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/10 text-white' : 'text-blue-200/80 hover:bg-white/5'}`}>
      {label}
    </button>
  )
}

export default App
