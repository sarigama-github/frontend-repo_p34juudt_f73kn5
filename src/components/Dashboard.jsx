import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [plants, setPlants] = useState([])
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [latest, setLatest] = useState([])

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadPlants = async () => {
    const res = await fetch(`${baseUrl}/plants`)
    const data = await res.json()
    setPlants(data)
    if (!selected && data.length > 0) setSelected(data[0].id)
  }

  const loadStats = async (plantId) => {
    const s = await fetch(`${baseUrl}/stats/plant?plant_id=${plantId}`).then(r=>r.json())
    const lg = await fetch(`${baseUrl}/growth-logs?plant_id=${plantId}`).then(r=>r.json())
    const lt = await fetch(`${baseUrl}/sensor-readings/latest?plant_id=${plantId}&limit=10`).then(r=>r.json())
    setStats(s); setLogs(lg); setLatest(lt)
  }

  useEffect(()=>{ loadPlants() }, [])
  useEffect(()=>{ if (selected) loadStats(selected) }, [selected])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <select value={selected || ''} onChange={(e)=>setSelected(e.target.value)} className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700">
          {plants.map(p=> <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button onClick={()=>selected && loadStats(selected)} className="px-3 py-2 bg-slate-700 text-white rounded">Rafraîchir</button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Hauteur max" value={stats.max_height_cm ? `${stats.max_height_cm} cm` : '—'} />
          <StatCard label="Hauteur moy" value={stats.avg_height_cm ? `${stats.avg_height_cm.toFixed(1)} cm` : '—'} />
          <StatCard label="Temp. moy" value={stats.avg_temperature_c ? `${stats.avg_temperature_c.toFixed(1)} °C` : '—'} />
          <StatCard label="Humidité sol" value={stats.avg_soil_moisture_pct ? `${stats.avg_soil_moisture_pct.toFixed(0)} %` : '—'} />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Journal de croissance</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {logs.map(l => (
              <div key={l.id} className="text-sm text-blue-100/80 flex justify-between border-b border-slate-700/60 py-2">
                <span>{l.observed_at}</span>
                <span>{l.height_cm ? `${l.height_cm} cm` : ''} {l.stage && `• ${l.stage}`}</span>
              </div>
            ))}
            {logs.length===0 && <p className="text-blue-200/60">Aucun relevé.</p>}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Lectures récentes (capteurs)</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {latest.map(r => (
              <div key={r.id} className="text-sm text-blue-100/80 flex justify-between border-b border-slate-700/60 py-2">
                <span>{new Date(r.recorded_at).toLocaleString()}</span>
                <span>{r.temperature_c!=null && `${r.temperature_c}°C`} {r.soil_moisture_pct!=null && `• ${r.soil_moisture_pct}%`}</span>
              </div>
            ))}
            {latest.length===0 && <p className="text-blue-200/60">Aucune donnée capteur.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }){
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
      <p className="text-blue-300/70 text-sm">{label}</p>
      <p className="text-white text-2xl font-semibold">{value}</p>
    </div>
  )
}
