import { invoke } from '@tauri-apps/api/core';
import type { FileInfo } from 'src-tauri/bindings/FileInfo';
import type { Response } from 'src-tauri/bindings/Response';

export const typedInvoke = <T extends keyof TCommand>(
	cmd: T,
	...args: TCommand[T][0] extends void
		? [args?: InvokeArgs, options?: InvokeOptions]
		: [args: TCommand[T][0], options?: InvokeOptions]
): Promise<Response<TCommand[T][1]>> => {
	// @ts-ignore
	return invoke(cmd, ...args);
};

type InvokeParameters = Parameters<typeof invoke>;
type InvokeArgs = InvokeParameters[1];
type InvokeOptions = InvokeParameters[2];

/***********************
 * Rust 함수들 확장 🏄🏼‍♂️ *
 ***********************
 *
 * key: 함수 명
 * value: [파라미터, 리턴값]
 *
 * 파라미터는 스네이크 케이스 :: #[tauri::command(rename_all = "snake_case")]
 */
type TCommand = {
	dialog_open: [void, Array<FileInfo>];
	hello_world: [{ str_arg: string }, string];
};
