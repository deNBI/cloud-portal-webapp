import {Pipe, PipeTransform} from '@angular/core';
import {KeyService} from '../../api-connector/key.service';

/**
 * Pipe which checks for validity of ssh-key.
 */
@Pipe({
		name: 'isValidKeyPipe',
})
export class PublicKeyPipe implements PipeTransform {


		transform(key: string): boolean {
				key = key.trim()
				const valid_rsa: boolean = /^ssh-rsa AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(key);
				const valid_ecdsa_521: boolean = /^ecdsa-sha2-nistp521 AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(key);
				const valid_ecdsa_256: boolean = /^ecdsa-sha2-nistp256 AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(key);
				const valid_ecdsa_384: boolean = /^ecdsa-sha2-nistp384 AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(key);
				const valid_ed25519: boolean = /^ssh-ed25519 AAAA[0-9A-Za-z+/]+[=]{0,3}( [^@]+@[^@]+)?/.test(key);
				return valid_rsa || valid_ecdsa_256 || valid_ecdsa_384 || valid_ecdsa_521 || valid_ed25519;
		}
}
