import { createContext, useState, useEffect } from 'react'
import { journalService } from '../services/journalService'

export const JournalContext = createContext()

export const JournalProvider = ({ children }) => {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    setLoading(true)
    try {
      const data = await journalService.getEntries()
      setEntries(data.entries)
    } catch (error) {
      console.error('Error loading journal entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEntry = async (entry) => {
    try {
      const newEntry = await journalService.addEntry(entry)
      setEntries([newEntry, ...entries])
      return newEntry
    } catch (error) {
      console.error('Error adding journal entry:', error)
      return null
    }
  }

  const deleteEntry = async (entryId) => {
    try {
      await journalService.deleteEntry(entryId)
      setEntries(entries.filter(e => e.id !== entryId))
      return true
    } catch (error) {
      console.error('Error deleting journal entry:', error)
      return false
    }
  }

  return (
    <JournalContext.Provider value={{ entries, loading, addEntry, deleteEntry, loadEntries }}>
      {children}
    </JournalContext.Provider>
  )
}
