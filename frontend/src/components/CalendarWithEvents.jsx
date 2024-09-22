import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMedkit,
  faClock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";
import "moment/locale/it";

Modal.setAppElement("#root"); // Imposta l'elemento principale dell'app per accessibilità

export default function CalendarWithEvents({ allEvents }) {
  moment.locale("it");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [completedEvents, setCompletedEvents] = useState({});
  const [activeTimers, setActiveTimers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");

  const isEventOnDate = (date, event) => {
    const eventDate = moment(event.date).format("YYYY-MM-DD");
    const selectedFormattedDate = moment(date).format("YYYY-MM-DD");
    return eventDate === selectedFormattedDate;
  };

  const toggleCompleted = (eventId) => {
    setCompletedEvents((prevCompleted) => ({
      ...prevCompleted,
      [eventId]: !prevCompleted[eventId],
    }));
  };

  const setReminderTimer = (event) => {
    const eventTime = moment(event.time, "HH:mm");
    const now = moment();

    if (eventTime.isAfter(now)) {
      const timeUntilEvent = eventTime.diff(now);
      const timer = setTimeout(() => {
        setReminderMessage(`È l'ora di prendere ${event.medicine_name}`);
        setModalIsOpen(true); // Apri il modal
      }, timeUntilEvent);

      setActiveTimers((prevTimers) => [...prevTimers, timer]);
    }
  };

  const onDateClick = (date) => {
    setSelectedDate(date);
    const eventsOnThatDate = allEvents.filter((event) =>
      isEventOnDate(date, event)
    );
    setEventsForSelectedDate(eventsOnThatDate);
  };

  const getDaysWithEvents = () => {
    const daysWithEvents = new Set();
    allEvents.forEach((event) => {
      const eventDate = moment(event.date).format("YYYY-MM-DD");
      daysWithEvents.add(eventDate);
    });
    return daysWithEvents;
  };

  const daysWithEvents = getDaysWithEvents();

  const tileContent = ({ date }) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return daysWithEvents.has(formattedDate) ? (
      <div className="tile-content">
        <FontAwesomeIcon icon={faMedkit} className="event-icon" />
      </div>
    ) : (
      <div className="tile-content-no-event" style={{ color: "transparent" }}>
        o
      </div>
    );
  };

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    const eventsToday = allEvents.filter((event) =>
      isEventOnDate(today, event)
    );

    activeTimers.forEach((timer) => clearTimeout(timer));
    setActiveTimers([]);

    eventsToday.forEach((event) => setReminderTimer(event));
  }, [allEvents]);

  useEffect(() => {
    const eventsOnThatDate = allEvents.filter((event) =>
      isEventOnDate(selectedDate, event)
    );
    setEventsForSelectedDate(eventsOnThatDate);
  }, [allEvents, selectedDate]);

  return (
    <div className="calendar-list">
      <Calendar
        onClickDay={onDateClick}
        value={selectedDate}
        tileContent={tileContent}
      />
      <h1>
        {eventsForSelectedDate.length} eventi in data{" "}
        {moment(selectedDate).format("DD MMMM YYYY")}:
      </h1>
      <div className="shadow-top"></div>
      <div className="event-details">
        {selectedDate && (
          <div className="ev2">
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((event) => (
                  <div
                    className={`event-popup ${
                      completedEvents[event._id] ? "completed" : ""
                    }`}
                    key={event._id}
                    style={{
                      textDecoration: completedEvents[event._id]
                        ? "line-through"
                        : "none",
                      color: completedEvents[event._id] ? "gray" : "black",
                    }}
                  >
                    <strong>{event.medicine_name}</strong> -{" "}
                    <FontAwesomeIcon
                      icon={faClock}
                      style={{
                        color: "white",
                        backgroundColor: "black",
                        borderRadius: "50%",
                        padding: "0.1vh",
                      }}
                    />{" "}
                    {event.time}
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      onClick={() => toggleCompleted(event._id)}
                      style={{
                        cursor: "pointer",
                        color: completedEvents[event._id] ? "green" : "black",
                        marginLeft: "10px",
                      }}
                    />
                    <br />
                    {event.description}
                  </div>
                ))
            ) : (
              <p>Nessun evento per questa data.</p>
            )}
          </div>
        )}
      </div>
      <div className="shadow-bottom"></div>

      {/* Modal per i promemoria */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Promemoria"
      >
        <h2>Promemoria</h2>
        <p>{reminderMessage}</p>
        <button onClick={() => setModalIsOpen(false)} className="custom-button">CHIUDI</button>
      </Modal>
    </div>
  );
}
