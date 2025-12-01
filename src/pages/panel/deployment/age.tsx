export function DeploymentAge({age}: { age: number }) {
  function convertTime(age: number) {
    const abs = Math.abs(age);
    if (abs < 1000 * 60) {
      return Math.round(age / 1000) + "s";
    }
    if (abs < 1000 * 60 * 60) {
      return Math.round(age / (1000 * 60)) + "m";
    }
    if (abs < 1000 * 60 * 60 * 24) {
      return Math.round(age / (1000 * 60 * 60)) + "h";
    }
    return Math.round(age / (1000 * 60 * 60 * 24)) + "d";
  }
  return (
    <span>{convertTime(age)}</span>
  );
}