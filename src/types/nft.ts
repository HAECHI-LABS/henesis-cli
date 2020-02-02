export class NFTDailyStat {
  public date: string;
  public count: number;

  public constructor(date: string, count: number) {
    this.date = date;
    this.count = count;
  }
}

export class NFTUsage {
  public date: string;
  public usage: string;

  public constructor(date: string, usage: string) {
    this.date = date;
    this.usage = usage;
  }
}
