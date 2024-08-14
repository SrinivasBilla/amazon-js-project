function isWeekend(date) {
  const day = date.format('dddd');
  const days = '';
  if(day === 'Saturday' || day === 'Sunday') {
    return day;
  }
}
export default isWeekend;