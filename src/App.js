import './App.css';
import React, { useEffect, useState } from 'react';

const baseUrl = 'https://9rbjs-4000.csb.app';

export default function App() {
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch the guests from the API when the component loads
  useEffect(() => {
    const fetchGuests = async () => {
      setLoading(true); // Ensure loading message appears
      try {
        const response = await fetch(`${baseUrl}/guests`);
        const allGuests = await response.json();
        setGuests(allGuests);
      } catch (error) {
        console.error('Error fetching guests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests().catch((error) => {
      console.log(error);
    });
  }, []);

  // Handle creating a new guest
  const handleAddGuest = async () => {
    if (firstName && lastName) {
      try {
        const response = await fetch(`${baseUrl}/guests`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            attending: false,
          }),
        });
        const newGuest = await response.json();
        setGuests((prevGuests) => [...prevGuests, newGuest]);
        setFirstName('');
        setLastName('');
      } catch (error) {
        console.error('Error adding guest:', error);
      }
    }
  };

  // Handle deleting a guest
  const handleDeleteGuest = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
      setGuests((prevGuests) =>
        prevGuests.filter((guest) => guest.id !== deletedGuest.id),
      );
    } catch (error) {
      console.error('Error deleting guest:', error);
    }
  };

  // Handle updating attending status
  const handleAttendingStatusChange = async (id, attending) => {
    try {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attending }),
      });
      const updatedGuest = await response.json();
      setGuests((prevGuests) =>
        prevGuests.map((guest) =>
          guest.id === updatedGuest.id ? updatedGuest : guest,
        ),
      );
    } catch (error) {
      console.error('Error updating attending status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-container">
      <h1>Guest List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddGuest().catch((error) => {
            console.log(error);
          });
        }}
      >
        <div className="input-field-container">
          <label className="name-input-label" htmlFor="first-name-input">
            First Name
          </label>
          <input
            id="first-name-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label className="name-input-label" htmlFor="last-name-input">
            Last Name
          </label>
          <input
            id="last-name-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <button type>Add Guest</button>
        </div>
      </form>

      <div>
        {guests.map((guest) => (
          <div key={`user-${guest.id}`} data-test-id="guest">
            <p>
              {guest.firstName} {guest.lastName}
            </p>
            <p>
              Attending:
              <input
                type="checkbox"
                aria-label={`${guest.firstName} ${guest.lastName} attending status`}
                checked={guest.attending}
                onChange={(e) =>
                  handleAttendingStatusChange(guest.id, e.target.checked)
                }
              />
            </p>
            <button
              onClick={() => handleDeleteGuest(guest.id)}
              aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
