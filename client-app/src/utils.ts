import { IActivity } from './app/models/activity';
import { IUser } from './app/models/user';

export const dateAndTime = (activity: IActivity) => {
  const [date, time] = [activity.date.toISOString().split('T')[0], activity.date.toISOString().split('T')[1]]
  const timeSplited = time.split(':');
  const timeNoSecs = `${timeSplited[0]}:${timeSplited[1]}`;

  return [date, timeNoSecs];
}

export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = `${time.getHours()}:${time.getMinutes()}:00`;

  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();

  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  return new Date(dateString + ' ' + timeString);
}

export const setActivityProps = (act: IActivity, user: IUser) => {
  act.date = new Date(act.date);
  act.isGoing = act.attendees.some(a => a.username === user.username);
  act.isHost = act.attendees.some(a => a.username === user.username && a.isHost);
  return act;
}

export const createAttendee = (user: IUser) => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!
  }
}