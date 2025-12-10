export function EventTime({time}: { time: number }) {
  function convertTime(time: number) {
    const abs = Math.abs(time);
    if (abs < 1000 * 60) {
      return Math.round(time / 1000) + "s";
    }
    if (abs < 1000 * 60 * 60) {
      return Math.round(time / (1000 * 60)) + "m";
    }
    if (abs < 1000 * 60 * 60 * 24) {
      return Math.round(time / (1000 * 60 * 60)) + "h";
    }
    return Math.round(time / (1000 * 60 * 60 * 24)) + "d";
  }
  return (
    <span>{convertTime(time)}</span>
  );
}