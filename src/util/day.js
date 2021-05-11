import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
dayjs.extend(relativeTime);
dayjs.extend(duration);


const formatDate = (date, formatTemplate) => dayjs(date).format(formatTemplate);
const getRelativeDate = (date) => dayjs(date).fromNow();
const compareDate = (dateA, dateB) => dayjs(dateA).diff(dayjs(dateB));
const getDuration = (value) => dayjs.duration(value, 'minutes');


export {formatDate, getRelativeDate, compareDate, getDuration};
