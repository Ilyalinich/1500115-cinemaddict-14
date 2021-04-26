import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const getDateYearValue = (date) => dayjs(date).year();
const formatDate = (date, formatTemplate) => dayjs(date).format(formatTemplate);
const getRelativeDate = (date) => dayjs(date).fromNow();
const compareDate = (dateA, dateB) => dayjs(dateA).diff(dayjs(dateB));


export {getDateYearValue, formatDate, getRelativeDate, compareDate};
