import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/cards.css';

const categoryIcon = {
  Vegetable: '🥦', Fruit: '🍓', Herb: '🌿',
  Flower: '🌸', Other: '🌱',
};

const PlantCard = ({ plant, onDelete }) => {
  const icon = categoryIcon[plant.category] || '🌱';

  return (
    <div className="plant-card">
      <div className="plant-card-header">
        <div className="plant-card-icon">{icon}</div>
        <span className={`badge badge-${plant.growthStatus?.toLowerCase()}`}>
          {plant.growthStatus}
        </span>
      </div>

      <div className="plant-card-body">
        <div className="plant-name">{plant.plantName}</div>
        <div className="plant-category">{plant.category}</div>

        <div className="plant-meta">
          <div className="plant-meta-row">
            <span className="plant-meta-key">Plot</span>
            <span className="plant-meta-val">{plant.plotNumber || `#${plant.plotId}`}</span>
          </div>
          <div className="plant-meta-row">
            <span className="plant-meta-key">Planted</span>
            <span className="plant-meta-val">{plant.plantingDate}</span>
          </div>
          {plant.harvestDate && (
            <div className="plant-meta-row">
              <span className="plant-meta-key">Harvest</span>
              <span className="plant-meta-val">{plant.harvestDate}</span>
            </div>
          )}
        </div>

        <div className="plant-card-actions">
          <Link to={`/plants/edit/${plant.id}`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(plant.id)}>🗑</button>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
