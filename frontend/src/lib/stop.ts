export function formatStopName(name: string): string {
  name = name.toLowerCase();

  for (let i = 0; i < name.length; i++) {
    if (i === 0 || name.charAt(i - 1) === " " || name.charAt(i - 1) === "-" || name.charAt(i - 1) === "/") {
      name = name.substring(0, i) + name.charAt(i).toUpperCase() + name.substring(i + 1);
    }
  }

  return name;
}
