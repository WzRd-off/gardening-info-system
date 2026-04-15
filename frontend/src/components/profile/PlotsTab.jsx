import React, { useState, useCallback, useEffect } from 'react';
import { Spinner, EmptyState, Field } from './CommonComponents';
import { PlotCard } from './PlotCard';
import * as profileService from '../../services/profileService';

export function PlotsTab() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPlot, setShowAddPlot] = useState(false);
  const [newPlot, setNewPlot] = useState({ address: '', area: '', features: '' });
  const [addingPlot, setAddingPlot] = useState(false);

  const fetchPlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await profileService.getMyPlots();
      setPlots(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) { setError('Не вдалося завантажити ділянки'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPlots(); }, [fetchPlots]);

  const handleAddPlot = async () => {
    if (!newPlot.address.trim() || !newPlot.area) return;
    setAddingPlot(true);
    try {
      await profileService.addPlot(newPlot.address, parseFloat(newPlot.area), newPlot.features);
      setNewPlot({ address: '', area: '', features: '' });
      setShowAddPlot(false);
      await fetchPlots();
    } catch (err) { setError('Не вдалося додати ділянку'); }
    finally { setAddingPlot(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="plots-header">
        <h2 className="plots-title">Мої ділянки</h2>
        <button onClick={() => setShowAddPlot(v => !v)} className="btn-outline-sm">
          {showAddPlot ? '✕ Скасувати' : '+ Додати ділянку'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {showAddPlot && (
        <div className="card plot-form">
          <h3>Нова ділянка</h3>
          <div className="plot-form-grid">
            <Field label="Адреса ділянки">
              <input
                className="input"
                placeholder="вул. Садова, 12, с. Зелене"
                value={newPlot.address}
                onChange={e => setNewPlot(p => ({ ...p, address: e.target.value }))}
              />
            </Field>
            <Field label="Площа (соток)">
              <input
                className="input"
                placeholder="12"
                type="number"
                min="0"
                value={newPlot.area}
                onChange={e => setNewPlot(p => ({ ...p, area: e.target.value }))}
              />
            </Field>
          </div>
          <Field label="Примітка">
            <textarea
              className="input"
              placeholder="Додайте опис ділянки"
              value={newPlot.features}
              onChange={e => setNewPlot(p => ({ ...p, features: e.target.value }))}
              style={{ resize: 'vertical', minHeight: '100px', fontFamily: 'inherit', padding: '10px'}}
            />
          </Field>
          <button
            onClick={handleAddPlot}
            disabled={addingPlot || !newPlot.address.trim() || !newPlot.area}
            className="btn-sm"
            style={{ marginTop: 16 }}
          >
            {addingPlot ? 'Додавання...' : 'Зберегти ділянку'}
          </button>
        </div>
      )}

      {plots.length === 0 && !showAddPlot ? (
        <EmptyState
          icon="🌿"
          text="У вас ще немає доданих ділянок. Додайте свою першу ділянку, щоб замовляти послуги."
          action={
            <button onClick={() => setShowAddPlot(true)} className="btn-sm">
              + Додати ділянку
            </button>
          }
        />
      ) : (
        plots.map(plot => <PlotCard key={plot.id} plot={plot} onRefresh={fetchPlots} />)
      )}
    </div>
  );
}
