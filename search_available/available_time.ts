export interface ClassMeeting {
  days: number[]; 
  start: string;  
  end: string;     
  firstDate?: string;
  lastDate?: string;
}

export interface Classroom {
  id: string;
  building: string;
  meetings: ClassMeeting[];
}

export interface AvailableTimeQuery {
  date: string;
  start: string;
  end: string;
  building?: string;
}

export function timeToMinutes(time: string): number {
  const match = /^(\d{2}):(\d{2})$/.exec(time);

  if (!match) {
    throw new Error("Invalid time");
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour > 23 || minute > 59) {
    throw new Error("Invalid time");
  }

  return hour * 60 + minute;
}

function getWeekday(date: string): number {
  const parsed = new Date(date + "T12:00:00Z");

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error("Invalid date");
  }

  return parsed.getUTCDay();
}

export function isRoomAvailable(
  meetings: ClassMeeting[],
  date: string,
  start: string,
  end: string
): boolean {
  const weekday = getWeekday(date);
  const searchStart = timeToMinutes(start);
  const searchEnd = timeToMinutes(end);

  if (searchEnd <= searchStart) {
    throw new Error("End time must be after start time");
  }

  return !meetings.some(meeting => {
    if (!meeting.days.includes(weekday)) return false;
    if (meeting.firstDate && date < meeting.firstDate) return false;
    if (meeting.lastDate && date > meeting.lastDate) return false;

    const classStart = timeToMinutes(meeting.start);
    const classEnd = timeToMinutes(meeting.end);

    return classStart < searchEnd && classEnd > searchStart;
  });
}

export function findAvailableRooms<T extends Classroom>(
  rooms: T[],
  query: AvailableTimeQuery
): T[] {
  return rooms.filter(room => {
    const matchesBuilding =
      !query.building ||
      room.building.toLowerCase().includes(query.building.toLowerCase());

    return matchesBuilding &&
      isRoomAvailable(
        room.meetings,
        query.date,
        query.start,
        query.end
      );
  });
}
