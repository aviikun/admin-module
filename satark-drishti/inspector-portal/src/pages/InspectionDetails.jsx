import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { fetchScheduleItem } from '../data/api';
import { inspector } from '../data/inspections';

function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

export default function InspectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchScheduleItem(id)
      .then((result) => {
        if (!result) throw new Error('Inspection not found.');
        setItem(result);
      })
      .catch((err) => setError(err.message || 'Could not load the inspection.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="list-empty">Loading inspection…</div>;
  if (error || !item) return <><Link to="/schedule" className="back-link">‹ Back to schedule</Link><div className="list-empty">{error || 'Inspection not found.'}</div></>;

  const canStart = item.status !== 'Completed';

  return (
    <>
      <Link to="/schedule" className="back-link">‹ Back to schedule</Link>
      <div className="page-header">
        <div className="page-eyebrow">Assigned Inspection</div>
        <h1 className="page-title">{item.organization}</h1>
        <p className="page-description">{item.location}</p>
      </div>
      <div className="detail-panel">
        <div className="detail-grid">
          <div><div className="detail-field-label">Scheduled date</div><div className="detail-field-value">{formatDate(item.date)}</div></div>
          <div><div className="detail-field-label">Scheduled time</div><div className="detail-field-value">{item.time}</div></div>
          <div><div className="detail-field-label">Status</div><div className="detail-field-value"><StatusBadge status={item.status} /></div></div>
          <div><div className="detail-field-label">Reference ID</div><div className="detail-field-value mono">{item.id}</div></div>
          <div><div className="detail-field-label">Inspector</div><div className="detail-field-value">{item.inspector || inspector.name}</div></div>
        </div>
        <div className="detail-divider" />
        <div className="detail-actions">
          <button type="button" className="btn btn-primary" disabled={!canStart} onClick={() => navigate(`/schedule/${item.id}/onsite`)}>Start Inspection</button>
          <Link to="/schedule" className="btn btn-secondary">Back to schedule</Link>
        </div>
      </div>
    </>
  );
}
