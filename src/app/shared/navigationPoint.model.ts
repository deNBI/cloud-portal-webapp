/**
 * Model Class for navigationPoints
 */
export class NavigationPoint {
  name: string;
  href: string;
  subPoints: NavigationPoint[];

  constructor(name: string,
              href: string,
              subPoints: NavigationPoint[]) {
    this.name = name;
    this.href = href;
    this.subPoints = subPoints;
  }
}
