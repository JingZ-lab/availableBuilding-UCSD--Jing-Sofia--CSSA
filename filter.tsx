import { useState } from "react";
import {
  findAvailableRooms,
  type Classroom
} from "./availableTime";

type Props<T extends Classroom> = {
  rooms: T[];
  onResults: (results: T[]) => void;
};

export function AvailableTimeFilter<T extends Classroom>({
  rooms,
  onResults
}: Props<T>) {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("14:00");
  const [end, setEnd] = useState("16:00");
  const [error, setError] = useState("");

  function handleSearch() {
    try {
      const results = findAvailableRooms(rooms, {
        date,
        start,
        end
      });

      setError("");
      onResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid time");
    }
  }

  return (
    <div>
      <h3>Available Time</h3>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </label>

      <label>
        Start:
        <input
          type="time"
          value={start}
          onChange={e => setStart(e.target.value)}
        />
      </label>

      <label>
        End:
        <input
          type="time"
          value={end}
          onChange={e => setEnd(e.target.value)}
        />
      </label>

      <button onClick={handleSearch}>
        Search Available Rooms
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
