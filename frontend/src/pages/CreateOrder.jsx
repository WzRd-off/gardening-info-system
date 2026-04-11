import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Icons } from '../components/order/Icons';
import FilterSidebar from '../components/order/FilterSidebar';
import ServiceCard from '../components/order/ServiceCard';
import OrderModal from '../components/order/OrderModal';
import SuccessScreen from '../components/order/SuccessScreen';
import { authHeaders } from '../components/order/api';
import { API_BASE_URL } from '../services/config';

// Автоматично визначає категорію за назвою послуги
function inferCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes('газон')  || lower.includes('стрижк'))                      return 'Газон';
  if (lower.includes('полив')  || lower.includes('краплин'))                     return 'Полив';
  if (lower.includes('дизайн') || lower.includes('проект') || lower.includes('ланд')) return 'Дизайн';
  if (lower.includes('обрізк') || lower.includes('дерев')  || lower.includes('кущ'))  return 'Дерева та кущі';
  if (lower.includes('посадк') || lower.includes('рослин'))                      return 'Посадка';
  return 'Інше';
}

export default function CreateOrderPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');

  const [orderService, setOrderService] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [searchParams] = useSearchParams();

  // Завантаження каталогу
  useEffect(() => {
    fetch(`${API_BASE_URL}/manager/services`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => setServices(Array.isArray(d) ? d : []))
      .catch(() => setError('Не вдалося завантажити каталог послуг'))
      .finally(() => setLoading(false));
  }, []);

  // Передвибір послуги через URL ?service_id=
  useEffect(() => {
    const sid = searchParams.get('service_id');
    if (sid && services.length) {
      const found = services.find(s => String(s.id) === sid);
      if (found) setOrderService(found);
    }
  }, [searchParams, services]);

  // Категорії з поточного списку послуг
  const categories = useMemo(() => {
    const set = new Set(services.map(s => inferCategory(s.name)));
    return Array.from(set).sort();
  }, [services]);

  // Фільтрація та сортування
  const filtered = useMemo(() => {
    let result = [...services];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter(s => inferCategory(s.name) === selectedCategory);
    }
    if (priceRange.min !== '') result = result.filter(s => Number(s.price) >= Number(priceRange.min));
    if (priceRange.max !== '') result = result.filter(s => Number(s.price) <= Number(priceRange.max));
    if (sortBy === 'price_asc')  result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [services, search, selectedCategory, priceRange, sortBy]);

  const hasActiveFilters = !!(search || selectedCategory || priceRange.min || priceRange.max || sortBy !== 'default');

  const resetFilters = () => {
    setSearch(''); setSelectedCategory(''); setPriceRange({ min: '', max: '' }); setSortBy('default');
  };

  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <div className="co-hero">
        <div className="co-hero__inner">
          <div className="co-hero__eyebrow">
            <span className="co-hero__eyebrow-icon">{Icons.leaf}</span>
            <span className="co-hero__eyebrow-text">Каталог послуг</span>
          </div>
          <h1 className="co-hero__title">Оберіть послугу для вашого саду</h1>
          <p className="co-hero__sub">
            Знайдіть потрібну послугу, ознайомтесь з описом та оформіть замовлення в кілька кліків.
          </p>
        </div>
      </div>

      {/* ── Основний контент ── */}
      <div className="co-page">
        <div className="co-layout co-container">

          {/* Бічна панель фільтрів */}
          <FilterSidebar
            search={search}
            onSearchChange={setSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={(field, val) => setPriceRange(p => ({ ...p, [field]: val }))}
            sortBy={sortBy}
            onSortChange={setSortBy}
            hasActiveFilters={hasActiveFilters}
            onReset={resetFilters}
          />

          {/* Сітка послуг */}
          <div className="co-content">

            {/* Рядок результатів */}
            <div className="co-results-bar">
              <p className="co-results-bar__count">
                {loading ? 'Завантаження...' : `Знайдено послуг: ${filtered.length}`}
              </p>
              {hasActiveFilters && (
                <div className="co-filters-badge">Фільтри активні</div>
              )}
            </div>

            {error && <div className="co-error">{error}</div>}

            {loading ? (
              <div className="co-spinner-wrap"><div className="co-spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="co-empty">
                {Icons.imagePlaceholder}
                <p className="co-empty__text">Послуг не знайдено</p>
                <button className="co-empty__reset" onClick={resetFilters}>
                  Скинути фільтри
                </button>
              </div>
            ) : (
              <div className="co-grid">
                {filtered.map(s => (
                  <ServiceCard
                    key={s.id}
                    service={s}
                    onOrder={svc => { setOrderService(svc); setOrderSuccess(false); }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модал замовлення */}
      {orderService && !orderSuccess && (
        <OrderModal
          service={orderService}
          onClose={() => setOrderService(null)}
          onSuccess={() => setOrderSuccess(true)}
        />
      )}

      {/* Екран успіху */}
      {orderSuccess && (
        <SuccessScreen onReset={() => { setOrderService(null); setOrderSuccess(false); }} />
      )}

      <Footer />
    </>
  );
}