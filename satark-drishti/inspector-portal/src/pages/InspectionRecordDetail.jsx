import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { fetchInspection } from '../data/api';
import { inspector } from '../data/inspections';

function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
}

export default function InspectionRecordDetail() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInspection(id)
      .then(setRecord)
      .catch((err) => setError(err.message || 'Could not load the record.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="list-empty">Loading record…</div>;
  if (error || !record) return <><Link to="/records" className="back-link">‹ Back to records</Link><div className="list-empty">{error || 'Record not found.'}</div></>;

  return (
    <>
      <Link to="/records" className="back-link">‹ Back to records</Link>
      <div className="page-header">
        <div className="page-eyebrow">Inspection Record</div>
        <h1 className="page-title">{record.organization}</h1>
        <p className="page-description">{record.location}</p>
      </div>
      <div className="detail-panel">
        <div className="detail-grid">
          <div><div className="detail-field-label">Inspection date</div><div className="detail-field-value">{formatDate(record.date)}</div></div>
          <div><div className="detail-field-label">Inspection time</div><div className="detail-field-value">{record.time}</div></div>
          <div><div className="detail-field-label">Status</div><div className="detail-field-value"><StatusBadge status={record.status} /></div></div>
          <div><div className="detail-field-label">Record ID</div><div className="detail-field-value mono">{record.id}</div></div>
          <div><div className="detail-field-label">Inspector</div><div className="detail-field-value">{record.inspector || inspector.name}</div></div>
        </div>
        {record.notes && <><div className="detail-divider" /><div><div className="detail-field-label">Notes</div><p style={{ marginTop: 6, fontSize: 14 }}>{record.notes}</p></div></>}
      </div>
      <p className="scope-note">Photo, GPS and video evidence remain outside Member 2/3 scope for this phase.</p>
    </>
  );
}
