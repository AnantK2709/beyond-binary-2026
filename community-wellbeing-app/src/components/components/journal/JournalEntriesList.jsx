import { useEffect, useState } from "react";
import JournalEntryCard from "./JournalEntryCard";
import { journalService } from "../../../services/journalService.js"; 

const MOCK_ENTRIES = [
  {
    id: 1,
    date: "Monday, 12 Feb 2026",
    time: "9:34 PM",
    text: "Today was mentally exhausting, but the evening run helped a lot."
  },
  {
    id: 2,
    date: "Friday, 9 Feb 2026",
    time: "7:12 AM",
    text: "Woke up feeling calmer after journaling last night."
  }
];

function JournalEntriesList({ userId }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!userId) return;

    journalService.getEntries(userId).then(res => {
      setEntries(res.entries);
    });
  }, [userId]);

  return (
    <div>
      {entries.map(entry => (
        <JournalEntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

export default JournalEntriesList;