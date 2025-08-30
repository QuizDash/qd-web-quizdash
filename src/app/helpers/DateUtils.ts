export class DateUtils {
  static getLocalDateFromIso(s: any): string {
    function pad(n: any) {
      return n < 10 ? '0' + n : n;
    }
    const d = new Date(s);
    let result = '';
    if (d != null) {
      result = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    }
    return result;
  }
}
