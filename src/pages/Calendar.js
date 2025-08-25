import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment);

function Calendar({ appointments, onAddAppointment }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });

    const handleSelectSlot = ({ start, end }) => {
        setNewEvent({ title: '', start, end });
        setModalOpen(true);
    };

    const handleSaveEvent = () => {
        if (newEvent.title && newEvent.start && newEvent.end) {
            onAddAppointment(newEvent);
            setModalOpen(false);
        }
    };

    const events = appointments.map(app => ({
        ...app,
        start: new Date(app.start),
        end: new Date(app.end),
    }));

    return (
        <div className="calendar-container">
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '80vh' }}
                selectable
                onSelectSlot={handleSelectSlot}
                messages={{
                    next: "İleri",
                    previous: "Geri",
                    today: "Bugün",
                    month: "Ay",
                    week: "Hafta",
                    day: "Gün",
                    agenda: "Ajanda",
                    date: "Tarih",
                    time: "Saat",
                    event: "Randevu",
                }}
            />
            {modalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h2>Yeni Randevu Ekle</h2>
                        <input
                            type="text"
                            placeholder="Randevu Başlığı (Örn: Ahmet Yılmaz - Sunum)"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                        <div className="modal-actions">
                            <button onClick={() => setModalOpen(false)} className="btn-secondary">İptal</button>
                            <button onClick={handleSaveEvent} className="btn-primary">Kaydet</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Calendar;