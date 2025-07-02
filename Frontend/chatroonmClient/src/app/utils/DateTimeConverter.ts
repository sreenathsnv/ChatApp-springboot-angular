export function convertToLocalTimeString(isoString:string) {
    const date = new Date(isoString);
    return date.toLocaleTimeString(); // defaults to user's locale
  }
  