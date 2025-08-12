import { invoke } from '@tauri-apps/api/core';
import type { Response } from 'src-tauri/bindings/Response';
import type { ResponseStatus } from '../../src-tauri/bindings/ResponseStatus';

/**
 * Tauri 명령 실행 중 발생한 오류를 나타내는 클래스.
 * @property status - 응답 상태 ('Failed', 'Canceled' 등)
 * @property payload - Rust에서 전달된 데이터나 오류 정보
 * @property cmd - 실패한 Tauri 명령 이름
 */
export class TransferError extends Error {
	status: ResponseStatus | 'Unknown';
	payload: unknown;
	cmd: string;

	constructor(status: ResponseStatus | 'Unknown', message: string, payload: unknown, cmd: string) {
		super(message);
		this.status = status;
		this.payload = payload;
		this.cmd = cmd;
	}
}

/**
 * Tauri 명령을 실행하고, Rust의 `Response<T>` 객체에서 `data` 필드만 추출합니다.
 * 명령 실패 시 `TransferError`를 던집니다.
 *
 * @param cmd - 실행할 Tauri 명령 이름 (예: 'process_and_insert_all')
 * @param args - 명령에 전달할 인자 객체
 * @returns T 타입의 데이터가 포함된 Promise
 * @throws TransferError - 명령이 실패하거나 데이터 형식이 올바르지 않은 경우
 */
export async function invokeData<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
	try {
		const res: Response<T> = await invoke<Response<T>>(cmd, args);

		// 1. Rust에서 명령이 실패하거나 취소되었다고 명시적으로 응답한 경우
		if (res.status === 'Failed' || res.status === 'Canceled') {
			throw new TransferError(res.status, res.message || `Command '${cmd}' failed.`, res.data, cmd);
		}

		// 2. 명령은 성공했지만, 데이터가 null인 경우
		if (res.status === 'Success' && res.data === null) {
			throw new TransferError('Unknown', `Command '${cmd}' succeeded but returned no data.`, res.data, cmd);
		}

		// 3. 명령이 성공하고 데이터가 존재하는 경우
		if (res.data !== null) {
			return res.data;
		}

		// 4. 모든 조건에 해당하지 않는 예상치 못한 오류
		throw new TransferError('Unknown', `An unexpected error occurred for command '${cmd}'.`, res, cmd);
	} catch (error: any) {
		// Tauri invoke 자체에서 발생한 오류 (예: 인자 타입 불일치, Rust 패닉)
		console.error(`Tauri invoke failed for command '${cmd}'`, error);
		throw new TransferError('Unknown', `API Error: ${error.message || String(error)}`, error, cmd);
	}
}
