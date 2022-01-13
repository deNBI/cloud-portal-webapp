export class Question {
	asked: string;
	answer: string;
	links: [string, string][];

	constructor(ques?: Partial<Question>) {
		Object.assign(this, ques);
	}
}
