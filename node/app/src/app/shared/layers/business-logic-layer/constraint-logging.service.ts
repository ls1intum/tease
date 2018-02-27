
export class ConstraintLoggingService {
  private static log: string[] = [];
  private static storeKey = 'ConstraintLoggingService-storage-key';

  public static pushMessage(message: string) {
    this.log.push(message);
    this.save();
  }

  public static getLog(): string {
    return this.log.join('\r\n\r\n');
  }

  public static reset() {
    this.log = [];
    this.save();
  }

  public static save() {
    localStorage.setItem(this.storeKey, JSON.stringify(this.log));
  }

  public static load() {
    const storedString = localStorage.getItem(this.storeKey);

    if (storedString == null)
      return;

    this.log = JSON.parse(storedString);
  }
}
