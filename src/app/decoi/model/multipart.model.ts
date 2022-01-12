import { ParallelHasher } from 'ts-md5/dist/parallel_hasher';
/**
 *  Model for multipart uploads
 */
export class Multipart {
  PREPARING_UPLOAD: string = 'Preparing Upload...'
  READY_FOR_UPLOAD: string = 'Ready for Upload'
  UPLOADING: string = 'Uploading...'
  UPLOAD_COMPLETED: string = 'Upload Completed'
  ALREADY_UPLOADED: string = 'Same File Already Exists'
  FINISHING_UPLOAD: string = 'Finishing Upload...'
  UPLOAD_STOPPED: string = 'Upload Stopped';
  SCHEDULED_UPLOAD: string = 'Scheduled Upload'
  STARTING_UPLOAD: string = 'Starting Upload..'

  file: File;
  upload_completed: boolean = false;
  upload_started: boolean = false;
  upload_finish_started: boolean = false;
  chunks: Chunk[] = [];
  md5_checksum: string;
  percent_completed: number = 0;
  msg: string = this.SCHEDULED_UPLOAD;
  ready_for_upload: boolean = false;
  checksum_generation_started: boolean = false;
  all_parts_pushed: boolean = false;
  upload_active: boolean = false;

  constructor(file: File) {
    this.file = file;

  }

  get_all_parts_pushed(): boolean {
    for (const chunk of this.chunks) {
      if (!chunk.part_pushed) {
        this.all_parts_pushed = false;

        return this.all_parts_pushed
      }
    }
    this.all_parts_pushed = true;

    return this.all_parts_pushed;
  }

  set_rdy_for_upload(): void {
    this.msg = this.READY_FOR_UPLOAD;
    this.ready_for_upload = true;
  }

  generate_md5_checksum(): void {
    this.msg = this.PREPARING_UPLOAD
    this.checksum_generation_started = true;
    const hasher: ParallelHasher = new ParallelHasher('static/webapp/assets/js/md5_worker.js');
    hasher.hash(this.file).then((hash: string): void => {
      this.md5_checksum = hash;
      this.set_rdy_for_upload()
    });
  }

  get_all_chunks_completed(): boolean {
    for (const chunk of this.chunks) {
      if (!chunk.get_completed()) {
        return false;
      }
    }

    return true;
  }

  set_msg(msg: string): void {
    if (msg === this.ALREADY_UPLOADED) {
      this.set_already_exists();
    } else {
      this.msg = msg;
    }
  }

  set_already_exists(): void {
    this.msg = this.ALREADY_UPLOADED;
    this.percent_completed = 100;
    this.upload_completed = true;
  }

  get_file_name(): string {
    return this.file['name'];
  }

  get_file_size_in_mb(): string {
    const mb: number = 1024 * 1024
    const size_mb: number = this.get_file_size() / mb

    return size_mb.toFixed(2)

  }

  get_file_size_uploaded_mb(): string {
    const mb: number = 1024 * 1024
    const uploaded_size_mb: number = (this.get_file_size() * (this.percent_completed / 100)) / mb

    return uploaded_size_mb.toFixed(2)
  }

  get_file_size_uploaded_gb(): string {
    const gb: number = 1024 * 1024 * 1024
    const uploaded_size_gb: number = (this.get_file_size() * (this.percent_completed / 100)) / gb

    return uploaded_size_gb.toFixed(2)
  }

  get_file_size_in_gb(): string {
    const gb: number = 1024 * 1024 * 1024
    const size_gb: number = this.get_file_size() / gb

    return size_gb.toFixed(2)

  }

  get_file_size(): number {
    return this.file['size'];
  }

  set_upload_completed(): void {
    this.upload_completed = true;
    this.percent_completed = 100;
    this.msg = this.UPLOAD_COMPLETED
  }

  get_uploaded_size_string(): string {
    if (this.get_file_size_in_gb().charAt(0) === '0') {
      return `${this.get_file_size_uploaded_mb()}/${this.get_file_size_in_mb()} MB`
    } else {
      return `${this.get_file_size_uploaded_gb()}/${this.get_file_size_in_gb()} GB`

    }
  }

  set_uploading_string(): void {
    this.msg = `${this.UPLOADING} ${this.get_uploaded_size_string()}`

  }

  get_percent_completed(): number {
    if (this.chunks.length > 0 && this.percent_completed !== 100) {

      let percentages: number = 0;
      this.chunks.forEach((chunk: Chunk): void => {
        percentages += chunk.percent_completed
      })
      this.percent_completed = percentages / this.chunks.length
      this.set_uploading_string()
    }

    return this.percent_completed
  }
>>>>>>> 92ccc306c0ba4380f3a36d729e9d0cd406caf579
}

/**
 *  Model for chunks of multipart upload
 */
export class Chunk {
	file: File;
	percent_completed: number;
	etag: string;
	presigned_url: string;
	part_number: number;
	upload_completed: boolean;
	part_pushed: boolean = false;

	constructor(part_number: number, signed_url: string, exists: boolean = false) {
		this.file = null;
		this.percent_completed = 0;
		this.etag = '';
		this.presigned_url = signed_url;
		this.part_number = Number(part_number);
		this.upload_completed = false;

		if (exists) {
			this.percent_completed = 100;
			this.upload_completed = true;
			this.part_pushed = true;
		}
	}

	set_part_pushed(val: boolean): void {
		this.part_pushed = val;
	}

	set_file(file: File): void {
		this.file = file;
	}

	get_file(): File {
		return this.file;
	}

	set_percented_complete(percented_complete: number): void {
		this.percent_completed = percented_complete;
	}

	set_etag(etag: string): void {
		this.etag = etag.replace(/["']/g, '');
	}

	get_etag_part_json(): {ETag: string, PartNumber: number} {
		return { ETag: this.etag, PartNumber: this.part_number };
	}

	set_completed(): void {
		this.upload_completed = true;
	}

	get_completed(): boolean {
		return this.upload_completed;
	}

	get_presigned_url(): string {
		return this.presigned_url;
	}
}
