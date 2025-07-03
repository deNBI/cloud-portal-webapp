import { inherits } from "util"

export class FacilityNews {
	id
	title: string
	posted_at: string
	text: string
	motd: string
	tags: string[]
	facility: number
	expire_at: Date
	is_current_motd: boolean

	constructor(news?: Partial<FacilityNews>) {
		Object.assign(this, news)
	}
}

export class ExtendedFacilityNews extends FacilityNews {
	message: string
	reply: string
	type: string
	sendNews: boolean

	constructor(ext?: Partial<ExtendedFacilityNews>) {
		super()
		Object.assign(this, ext)
	}

} 
