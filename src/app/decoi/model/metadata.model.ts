import { Multipart } from './multipart.model';

/**
 *  Model for multipart uploads
 */
export class MetadataModel {

	IMS_ID: string;
	SENDING_LAB: string;
	DATE_DRAW: string;
	SEQ_TYPE: string;
	SEQ_REASON: string;
	SAMPLE_TYPE: string;
	PUBLICATION_STATUS: string;
	OWN_FASTA_ID: string;
	FILE_NAME: string;
	upload: Multipart;

}
