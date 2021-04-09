/**
 * Class for generation of random names.
 */
export class RandomNameGenerator {
	ADJECTIVES: string[] = ['quick', 'powerful', 'ambitious', 'accurate', 'clever', 'timeless', 'fast', 'rapid', 'agile',
		'precise', 'capable', 'dynamic', 'moving'];
	SCIENTISTS: string[] = ['Einstein', 'Hertz', 'Newton', 'Hawking', 'Galilei', 'Kepler', 'Gauss', 'Darwin',
		'Schroedinger', 'Wilkins', 'Turing', 'Knuth', 'Zuse', 'Backus', 'Euler', 'Hopper', 'Curie', 'Rutherford', 'Faraday'];

	randomAdj(): string {
		const index: number = Math.floor(Math.random() * this.ADJECTIVES.length);

		return this.ADJECTIVES[index];
	}

	randomSct(): string {
		const index: number = Math.floor(Math.random() * this.SCIENTISTS.length);

		return this.SCIENTISTS[index];
	}

	randomName(): string {
		const randomName: string = this.randomAdj() + this.randomSct();

		return randomName;
	}
}
