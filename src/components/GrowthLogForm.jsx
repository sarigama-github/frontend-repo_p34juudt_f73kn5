import { useState } from 'react'

export default function GrowthLogForm({ plantId, onCreated }) {
  const [observedAt, setObservedAt] = useState('')
  const [height, setHeight] = useState('')
  const [leaves, setLeaves] = useState('')
  const [stage, setStage] = useState('seedling')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/growth-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plant_id: plantId,
          observed_at: observedAt,
          height_cm: height ? parseFloat(height) : null,
          leaves_count: leaves ? parseInt(leaves) : null,
          stage,
          notes
        })
      })
      if (!res.ok) throw new Error("Erreur lors de l'enregistrement")
      const data = await res.json()
      onCreated && onCreated(data.id)
      setObservedAt('')
      setHeight('')
      setLeaves('')
      setStage('seedling')
      setNotes('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input type="date" value={observedAt} onChange={(e)=>setObservedAt(e.target.value)} className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700" required />
        <input type="number" step="0.1" value={height} onChange={(e)=>setHeight(e.target.value)} placeholder="Hauteur (cm)" className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700" />
        <input type="number" value={leaves} onChange={(e)=>setLeaves(e.target.value)} placeholder="Nombre de feuilles" className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700" />
        <select value={stage} onChange={(e)=>setStage(e.target.value)} className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700">
          <option value="seed">Graine</option>
          <option value="germination">Germination</option>
          <option value="seedling">Jeune pousse</option>
          <option value="vegetative">Végétative</option>
          <option value="flowering">Floraison</option>
          <option value="cherry">Cerises</option>
          <option value="harvest">Récolte</option>
        </select>
      </div>
      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes" className="w-full px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700" />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-2 rounded">
        {loading ? 'En cours...' : 'Ajouter un relevé'}
      </button>
    </form>
  )
}
