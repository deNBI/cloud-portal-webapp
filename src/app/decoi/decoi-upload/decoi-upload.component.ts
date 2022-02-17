import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';
import { Chunk, Multipart } from '../model/multipart.model';
import { DecoiUploadService } from '../../api-connector/decoi-upload.service';
import { MetadataModel } from '../model/metadata.model';

/**
 * Upload component for decoi
 */
@Component({
	selector: 'app-decoi-upload',
	templateUrl: './decoi-upload.component.html',
	styleUrls: ['./decoi-upload.component.scss'],
	providers: [DecoiUploadService],
})
export class DecoiUploadComponent implements OnInit {

	title: string = 'DeCoi Upload';
	chosen_files: Multipart[];
	upload_completed: boolean = false;
	chosen_metadata: File;
	chosen_metadata_error: string[] = [];
	metadata_entries: MetadataModel[] = [];
	active_metadata: MetadataModel;

	load_error_message: string;
	upload_rdy: boolean = false;
	upload_started: boolean = false;
	upload_stopped: boolean = false;
	accepted_extensions: string = '.csv,.ods,.xls,.xlsx,.tsv';
	metadata_faulty: boolean = false;
	private subscription: Subscription = new Subscription();

	constructor(private upload_service: DecoiUploadService) {
	}

	ngOnInit(): void {
		this.chosen_files = [];
		this.load_error_message = null;
	}

	download_csv_sample(): void {
		const csv: string = 'IMS_ID,SENDING_LAB,DATE_DRAW,SEQ_TYPE,SEQ_REASON,SAMPLE_TYPE,'
      + 'PUBLICATION_STATUS,OWN_FASTA_ID,FILE_NAME';

		const blob: Blob = new Blob([csv], { type: 'text/csv' });
		saveAs(blob, 'metadata-sample.csv');
	}

	uploadMetadata(): void {
		this.chosen_metadata_error = [];
		this.upload_stopped = false;
		this.upload_started = false;
		this.upload_completed = true;
		this.upload_service.postMetadata(this.chosen_metadata)
			.subscribe(
				(
					data: MetadataModel[],
				): void => {
					this.metadata_entries = data;
					this.chosen_metadata = null;

				},
				(error: any): void => {
					this.chosen_metadata_error = error.error['errors'];
					this.chosen_metadata = null;

				},
			);

	}

	async load_files(event: EventTarget): Promise<void> {
		this.chosen_files = [];
		this.load_error_message = null;
		try {
			for (const file of event['files']) {
				this.chosen_files.push(new Multipart(file));
			}
		} catch (error) {
			this.load_error_message = error;
		}

		this.chosen_files.forEach((file: Multipart): void => {
			for (const metadata of this.metadata_entries) {
				if (metadata.FILE_NAME === file.file.name) {
					metadata.upload = file;
				}
			}

		});
		this.check_if_still_uncompleted_uploads();
		await this.generate_checksums();

	}

	async generate_checksums(): Promise<void> {
		for (const metadata of this.metadata_entries) {
			if (metadata.upload && !metadata.upload.md5_checksum && !metadata.upload.checksum_generation_started) {
				metadata.upload.generate_md5_checksum();
				await this.waitUntil((): boolean => metadata.upload.ready_for_upload === true);

			}
		}

	}

	load_metadata(event: EventTarget): void {
		this.metadata_faulty = true;
		this.upload_rdy = false;
		this.chosen_metadata = event['files'][0];
		this.metadata_entries = [];
		const name_parts: string[] = this.chosen_metadata['name'].split('.');
		const accepted_extensions: string[] = this.accepted_extensions.split(',');
		for (const ext of accepted_extensions) {
			if (ext.indexOf(name_parts[name_parts.length - 1]) !== -1) {
				this.metadata_faulty = false;
			}
		}
	}

	check_if_all_data_rdy(): void {

		this.upload_rdy = false;

		for (const metadata of this.metadata_entries) {
			if (metadata.upload) {
				if (!metadata.upload.ready_for_upload) {
					this.upload_rdy = false;
					setTimeout(
						(): void => {
							this.check_if_all_data_rdy();

						},
						5000,
					);

					return;
				}
			}
		}
		this.upload_rdy = true;

	}

	waitUntil = async (condition: any): Promise<any> => new Promise((resolve: any): void => {
		const interval: any = setInterval(
			(): void => {
				if (!condition()) {
					return;
				}

				clearInterval(interval);
				resolve();
			},
			2000,
		);
	});

	check_if_still_uncompleted_uploads(): void {
		for (const metadata of this.metadata_entries) {
			if (metadata.upload && !metadata.upload.upload_completed) {
				this.upload_completed = false;

				return;

			}
		}
		this.upload_completed = true;
		this.upload_started = false;
		this.upload_stopped = true;

	}

	stop_upload(): void {
		this.upload_stopped = true;
		this.subscription.unsubscribe();
		this.subscription = new Subscription();
		if (this.active_metadata) {
			this.active_metadata.upload.set_msg(this.active_metadata.upload.UPLOAD_STOPPED);
			this.active_metadata.upload.upload_active = false;
		}

	}

	async upload_files(): Promise<any> {
		this.check_if_still_uncompleted_uploads();
		this.upload_started = true;
		this.upload_stopped = false;
		const upload_metadata: MetadataModel[] = this.metadata_entries.filter((data: MetadataModel): boolean => !data.upload.upload_completed);

		for (const metadata of upload_metadata) {

			if (!this.upload_stopped && !metadata.upload.upload_active) {
				this.active_metadata = metadata;
				this.active_metadata.upload.upload_active = true;

				if (!metadata.upload.md5_checksum && !metadata.upload.checksum_generation_started) {
					metadata.upload.generate_md5_checksum();
				}
				await this.waitUntil((): boolean => metadata.upload.ready_for_upload === true);
				metadata.upload.msg = metadata.upload.STARTING_UPLOAD;
				this.subscription.add(this.upload_service.get_presigned_urls(metadata.IMS_ID, metadata.upload.get_file_size(), metadata.upload.md5_checksum).subscribe(
					async (result: any): Promise<void> => {
						if ('msg' in result) {
							metadata.upload.set_msg(result['msg']);
							this.check_if_still_uncompleted_uploads();

						} else {
							this.prepare_file_for_upload(metadata.upload, result);
							for (const chunk of metadata.upload.chunks) {
								if (!chunk.upload_completed) {
									this.subscription.add(this.upload_service.upload_chunk_to_presigned_url(chunk.get_presigned_url(), chunk.get_file()).subscribe(
										(event: any): any => {
											if (event.type === HttpEventType.UploadProgress) {
												chunk.set_percented_complete(Math.round(100 * event.loaded / event.total));
												metadata?.upload?.get_percent_completed();

											} else if (event instanceof HttpResponse) {
												event.headers.keys();
												const etag: string = event.headers.get('ETag');
												chunk.set_etag(etag);
												this.upload_service.set_upload_part(metadata.IMS_ID, chunk.part_number, chunk.etag, metadata.upload.md5_checksum)
													.subscribe((): void => {
														chunk.set_completed();
														chunk.set_percented_complete(100);
														chunk.set_part_pushed(true);

													});
											}
										},
									));
								} else {
									metadata?.upload?.get_percent_completed();
								}
							}
							await this.waitUntil((): boolean => metadata?.upload?.get_all_parts_pushed() === true);
							this.complete_upload(metadata);

						}

					},
				));
				await this.waitUntil((): boolean => metadata?.upload?.upload_completed === true);

			} else {
				break;
			}

		}
	}

	prepare_file_for_upload(file: Multipart, result: any): void {
		file['upload_id'] = result['UploadId'];
		file['chunks'] = Object.entries(result['signed_parts']).map(
			([key, val]: any): any => (new Chunk(key, val['presigned_url'], val['part_exists'])),
		);
		const fileSize: number = file.get_file_size();
		const chunkSize: number = Number(result['part_size']);
		const chunks: number = Math.ceil(fileSize / chunkSize);
		let chunk: number = 0;

		while (chunk < chunks) {
			const offset: number = chunk * chunkSize;
			const file_chunk: File = new File([file['file'].slice(offset, offset + chunkSize)], file['file']['name']);
			file['chunks'][chunk].set_file(file_chunk);
			chunk++;
		}
	}

	complete_upload(metadata: MetadataModel): void {
		if (metadata.upload.msg !== metadata.upload.ALREADY_UPLOADED
      && !metadata.upload.upload_completed
      && !metadata.upload.upload_finish_started) {
			metadata.upload.upload_finish_started = true;

			metadata.upload.set_msg(metadata.upload.FINISHING_UPLOAD);

			this.subscription.add(this.upload_service.complete_multipart_upload(metadata.IMS_ID, metadata.upload.md5_checksum).subscribe(
				(result: any): any => {

					metadata.upload.set_upload_completed();
					this.check_if_still_uncompleted_uploads();

					if (this.active_metadata === metadata) {
						this.active_metadata = null;
					}
				},
				(error: any): any => {
					console.log(error);
				},
			));

		} else {
			this.check_if_still_uncompleted_uploads();

			if (this.active_metadata === metadata) {
				this.active_metadata = null;
			}

		}
	}
}
