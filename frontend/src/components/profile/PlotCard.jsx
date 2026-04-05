import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('jwt')}`,
});

export function PlotCard({ plot, onRefresh }) {
  const [plants, setPlants] = useState([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [newPlant, setNewPlant] = useState('');
  const [addingPlant, setAddingPlant] = useState(false);

  const fetchPlants = useCallback(async () => {
    setLoadingPlants(true);
    try {
      const r = await fetch(`/profile/my_plots/${plot.id}/plants`, { headers: authHeaders() });
      const d = await r.json();
      setPlants(Array.isArray(d) ? d : []);
    } catch { /* тихо */ }
    finally { setLoadingPlants(false); }
  }, [plot.id]);

  useEffect(() => { fetchPlants(); }, [fetchPlants]);

  const handleAddPlant = async () => {
    if (!newPlant.trim()) return;
    setAddingPlant(true);
    try {
      const r = await fetch(`/profile/my_plots/${plot.id}/plants`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name: newPlant.trim() }),
      });
      if (!r.ok) throw new Error();
      setNewPlant('');
      fetchPlants();
    } catch { /* тихо */ }
    finally { setAddingPlant(false); }
  };

  const handleDeletePlant = async (plantId) => {
    try {
      await fetch(`/profile/my_plots/${plot.id}/plants/${plantId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      fetchPlants();
    } catch { /* тихо */ }
  };

  return (
    <div className="card">
      <div className="plot-card-header">
        <div className="plot-info">
          <div className="plot-address">
            <span className="plot-address-icon">📍</span>
            <h3 className="plot-address-title">{plot.address}</h3>
          </div>
          <p className="plot-area">
            Площа: <span className="plot-area-value">{plot.area} соток</span>
          </p>
        </div>
        <Link
          to={`/order?plot_id=${plot.id}`}
          className="btn-sm"
          style={{ height: 38, padding: '0 16px', fontSize: 13, flexShrink: 0 }}
        >
          Замовити послугу
        </Link>
      </div>

      <div className="plants-section">
        <p className="plants-section-title">Рослини на ділянці</p>

        {loadingPlants ? (
          <p className="meta-span">Завантаження...</p>
        ) : (
          <div className="plants-list">
            {plants.length === 0 && (
              <span className="plants-empty">Рослин ще не додано</span>
            )}
            {plants.map(plant => (
              <span key={plant.id} className="plant-tag">
                🌱 {plant.name}
                <button
                  onClick={() => handleDeletePlant(plant.id)}
                  className="plant-tag__delete"
                  title="Видалити рослину"
                >×</button>
              </span>
            ))}

            <div className="plant-input">
              <input
                className="plant-input__field"
                placeholder="Додати рослину..."
                value={newPlant}
                onChange={e => setNewPlant(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddPlant()}
              />
              <button
                onClick={handleAddPlant}
                disabled={addingPlant || !newPlant.trim()}
                className="plant-input__btn"
              >+</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
