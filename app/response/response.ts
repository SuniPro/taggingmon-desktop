// src/lib/tauri.ts
import { invoke } from '@tauri-apps/api/core';
import type { Response } from 'src-tauri/bindings/Response';

export class TransferError extends Error {
	status: number;
	payload: unknown;
	url: string;
	constructor(status: number, message: string, payload: unknown, url: string) {
		super(message);
		this.status = status;
		this.payload = payload;
		this.url = url;
	}
}

/** Tauri Response<T> -> T 로 변환(실패 시 예외) */
export async function invokeData<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
	const res = await invoke<Response<T>>(cmd, args);

	// res가 유효한 객체이고, data 속성을 가지고 있는지 확인합니다.
	if (res && 'data' in res) {
		return res.data as T;
	}

	// 예상치 못한 응답 형식일 경우 예외를 던집니다.
	// 이 경우, Rust 함수가 Response<T>를 반환하지 않았을 가능성이 높습니다.
	throw new TransferError(0, `Unexpected response format from command '${cmd}'.`, res, cmd);
}
