import { IActivity } from './app/models/activity';

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