import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/cards.css';

const EventCard = ({ event, onDelete, isAdmin }) => {
  const date = new Date(event.eventDate);
  const day   = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const time  = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="event-card">
      <div className="event-card-date">
        <div className="event-date-block">
          <div className="event-date-day">{day}</div>
          <div className="event-date-month">{month}</div>
        </div>
        <div className="event-time">🕐 {time}</div>
      </div>

      <div className="event-name">{event.eventName}</div>

      {event.description && (
        <div className="event-description">{event.description}</div>
      )}

      <div className="event-location">📍 {event.location}</div>

      {isAdmin && (
        <div className="event-card-actions">
          <Link to={`/events/edit/${event.id}`} className="btn btn-secondary btn-sm">✏️ Edit</Link>
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(event.id)}>🗑 Delete</button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
