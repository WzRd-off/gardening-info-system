import React from 'react';
import { Icons } from '../order/Icons';

/**
 * Бічна панель фільтрів каталогу послуг.
 * Props:
 *   search, onSearchChange
 *   categories         — масив рядків категорій
 *   selectedCategory, onCategoryChange
 *   priceRange         — { min, max }
 *   onPriceChange      — (field, value) => void
 *   sortBy, onSortChange
 *   hasActiveFilters   — boolean
 *   onReset            — callback скидання фільтрів
 */
export default function FilterSidebar({
  search, onSearchChange,
  categories, selectedCategory, onCategoryChange,
  priceRange, onPriceChange,
  sortBy, onSortChange,
  hasActiveFilters, onReset,
}) {
  return (
    <aside className="fs-sidebar co-sidebar">

      {/* ── Пошук ── */}
      <div className="fs-block">
        <div className="fs-search-wrap">
          <span className="fs-search-icon">{Icons.search}</span>
          <input
            type="text"
            className="fs-search-input"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Пошук послуг..."
          />
          {search && (
            <button className="fs-search-clear" onClick={() => onSearchChange('')}>
              {Icons.close}
            </button>
          )}
        </div>
      </div>

      {/* ── Категорії ── */}
      <div className="fs-block">
        <p className="fs-block__title">
          {Icons.filter} Категорія
        </p>
        <div className="fs-category-list">
          <button
            className={`fs-category-btn${!selectedCategory ? ' fs-category-btn--active' : ''}`}
            onClick={() => onCategoryChange('')}
          >
            {!selectedCategory && Icons.check}
            Всі категорії
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`fs-category-btn${selectedCategory === cat ? ' fs-category-btn--active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {selectedCategory === cat && Icons.check}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Ціна ── */}
      <div className="fs-block">
        <p className="fs-block__title">Ціна (₴)</p>
        <div className="fs-price-row">
          <input
            type="number"
            className="fs-price-input"
            placeholder="Від"
            value={priceRange.min}
            onChange={e => onPriceChange('min', e.target.value)}
          />
          <span className="fs-price-dash">—</span>
          <input
            type="number"
            className="fs-price-input"
            placeholder="До"
            value={priceRange.max}
            onChange={e => onPriceChange('max', e.target.value)}
          />
        </div>
      </div>

      {/* ── Сортування ── */}
      <div className="fs-block">
        <p className="fs-block__title">Сортування</p>
        <select
          className="fs-select"
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
        >
          <option value="default">За замовчуванням</option>
          <option value="price_asc">Ціна: від низької</option>
          <option value="price_desc">Ціна: від високої</option>
        </select>
      </div>

      {/* ── Скинути ── */}
      {hasActiveFilters && (
        <button className="fs-reset-btn" onClick={onReset}>
          Скинути фільтри
        </button>
      )}
    </aside>
  );
}
