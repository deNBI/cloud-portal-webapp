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
	reply: string
	type: string
	send_news: boolean
	alternative_message: string

	constructor(ext?: Partial<ExtendedFacilityNews>) {
		super()
		Object.assign(this, ext)
	}
}
