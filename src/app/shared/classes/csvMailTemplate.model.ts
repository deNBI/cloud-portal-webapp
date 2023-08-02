import { Application } from '../../applications/application.model/application.model';

export class CsvMailTemplateModel {
	errors: string[] = [];
	warnings: string[] = [];
	valid_projects: Application[] = [];
	keys: string[] = [];
}
