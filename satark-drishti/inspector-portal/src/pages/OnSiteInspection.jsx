import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createInspection, fetchScheduleItem } from '../data/api';
import { inspector } from '../data/inspections';

export default function OnSiteInspection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  async function handleComplete() {
    if (!item) return;
    setSubmitting(true);
    setError('');
    try {
      const record = await createInspection({
        organization: item.organization,
        location: item.location,
        date: item.date,
        time: item.time,
        inspector: item.inspector || inspector.name,
        status: 'Submitted',
        notes: notes.trim() || null,
      });
      navigate(`/records/${record.id}`);
    } catch (err) {
      setError(err.message || 'Could not submit the inspection.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="list-empty">Loading inspection…</div>;
  if (error && !item) return <><Link to="/schedule" className="back-link">‹ Back to schedule</Link><div className="list-empty">{error}</div></>;

  return (
    <>
      <Link to={`/schedule/${item.id}`} className="back-link">‹ Back to inspection details</Link>
      <div className="page-header">
        <div className="page-eyebrow">On-Site Inspection · {item.id}</div>
        <h1 className="page-title">{item.organization}</h1>
        <p className="page-description">{item.location}</p>
      </div>
      <div className="workflow-panel">
        <div className="workflow-section">
          <div className="workflow-section-title">Location <span className="workflow-tag">Later phase</span></div>
          <p className="workflow-section-note">Location capture will be connected in the photo/location module.</p>
        </div>
        <div className="workflow-section">
          <div className="workflow-section-title">Photo Evidence <span className="workflow-tag">Later phase</span></div>
          <p className="workflow-section-note">Live photo capture will be connected in the photo/location module.</p>
        </div>
        <div className="workflow-section">
          <div className="workflow-section-title">Video Evidence <span className="workflow-tag">Later phase</span></div>
          <p className="workflow-section-note">Video capture will be connected in the later media module.</p>
        </div>
        <div className="workflow-section">
          <div className="workflow-section-title">Inspection Notes</div>
          <p className="workflow-section-note">Record observations from the site visit.</p>
          <textarea className="workflow-textarea" placeholder="Enter observations from the site visit..." value={notes} onChange={(event) => setNotes(event.target.value)} disabled={submitting} />
        </div>
        {error && <div className="workflow-banner">{error}</div>}
        <div className="detail-actions">
          <button type="button" className="btn btn-primary" disabled={submitting} onClick={handleComplete}>{submitting ? 'Submitting…' : 'Complete Inspection'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/records')}>View Inspection Records</button>
        </div>
      </div>
    </>
  );
}
