import { Component, OnInit } from '@angular/core';
import { WIKI_FAQ } from '../../links/links';
import { is_vo } from '../shared/globalvar';
import { Question } from './question.model/question.model';

/**
 *FAQ component.
 */
@Component({
	selector: 'app-faq',
	templateUrl: './faq.component.html',
	providers: [],

})

export class FaqComponent implements OnInit {

	WIKI_FAQ: string = WIKI_FAQ;
	title: string = 'Frequently asked questions';
	is_vo_admin: boolean = false;
	data_loaded: boolean = false;
	questions: Question[] = [];

	ngOnInit(): void {
		this.is_vo_admin = is_vo;
		const ques1: Question = new Question();
		const ques2: Question = new Question();
		ques1.asked = 'First question';
		ques2.asked = 'Second Question';
		ques1.answer = 'Easy peasy answer with not a long text.';
		ques2.answer = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
		ques2.links = [['https://google.com', 'TestLink'], ['https://google.com', 'TestLink2']];
		this.questions.push(ques1);
		this.questions.push(ques2);
		this.data_loaded = true;
	}
}
