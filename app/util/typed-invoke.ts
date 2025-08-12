import { invoke } from '@tauri-apps/api/core';
import type { FileInfo } from 'src-tauri/bindings/FileInfo';
import type { Response } from 'src-tauri/bindings/Response';
import type { Folder } from '../../src-tauri/bindings/Folder';
import type { Category } from '../../src-tauri/bindings/Category';
import type { FsoInfo } from '../../src-tauri/bindings/FsoInfo';

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
	ping_sqlite: [void, string];
	read_folder: [{ path: string }, FileInfo[]];
	list_files: [void, Array<FileInfo>];
	add_folder_record: [{ path: string }, void];
	delete_folder_record: [{ path: string }, Response<void>];
	list_folders: [void, Array<Folder>];
	delete_folder: [{ path: string }, Response<void>];
	insert_categories: [{ categories: Array<{ name: string; is_default: boolean }> }, Array<Category>];
	get_categories: [void, Array<Category>];
	insert_fso_async: [{ fso_info_list: FsoInfo[]; category_ids?: number; tag_ids?: number }, number[]];
	process_and_insert_all: [{ fso_list: FsoInfo[] }, BigInt[]];
};
