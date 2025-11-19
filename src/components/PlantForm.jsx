import { useState } from 'react'

export default function PlantForm({ onCreated }) {
  const [name, setName] = useState('')
  const [variety, setVariety] = useState('Arabica')
  const [sowDate, setSowDate] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/plants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, variety, sow_date: sowDate, location, notes })
      })
      if (!res.ok) throw new Error('Erreur lors de la création')
      const data = await res.json()
      onCreated && onCreated(data.id)
      setName('')
      setVariety('Arabica')
      setSowDate('')
      setLocation('')
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
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nom de la plante" className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700" required />
        <input value={variety} onChange={(e)=>setVariety(e.target.value)} placeholder="Variété" className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700" />
        <input type="date" value={sowDate} onChange={(e)=>setSowDate(e.target.value)} className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700" required />
        <input value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Localisation" className="px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700" />
      </div>
      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes" className="w-full px-3 py-2 rounded bg-slate-800/60 text-white border border-slate-700" />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold py-2 rounded">
        {loading ? 'En cours...' : 'Créer la plante'}
      </button>
    </form>
  )
}
