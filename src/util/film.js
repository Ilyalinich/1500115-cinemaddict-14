const getFilmDuration = (minutes) => {
  const hoursDuration = Math.floor(minutes / 60);
  const minutesDuration = Math.floor(minutes % 60);

  return hoursDuration > 0 ? `${hoursDuration}h ${minutesDuration}m` : `${minutesDuration}m`;
};


export {getFilmDuration};
