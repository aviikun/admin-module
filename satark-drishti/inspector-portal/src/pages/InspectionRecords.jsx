import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { fetchInspections } from '../data/api';

function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function InspectionRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInspections()
      .then(setRecords)
      .catch((err) => setError(err.message || 'Could not load inspection records.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">Inspector Portal</div>
        <h1 className="page-title">Inspection Records</h1>
        <p className="page-description">Inspection records returned by the backend.</p>
      </div>
      <div className="list-panel">
        {loading && <div className="list-empty">Loading records…</div>}
        {!loading && error && <div className="list-empty">{error}</div>}
        {!loading && !error && records.length === 0 && <div className="list-empty">No inspection records yet.</div>}
        {!loading && !error && records.map((item) => (
          <Link key={item.id} to={`/records/${item.id}`} className="list-row">
            <div>
              <div className="list-row-org">{item.organization}</div>
              <div className="list-row-sector">{item.location}</div>
            </div>
            <div className="list-row-date">{formatDate(item.date)}</div>
            <div className="list-row-time">{item.time}</div>
            <StatusBadge status={item.status} />
          </Link>
        ))}
      </div>
    </>
  );
}
