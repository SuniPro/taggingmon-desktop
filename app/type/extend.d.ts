import type { Response } from 'src-tauri/bindings/Response';

declare module '@tauri-apps/api/core' {
	import tauriAppsApiCore = require('@tauri-apps/api/core');

	type TInvoke = typeof tauriAppsApiCore.invoke;
	// @CHECK: any로 변환됨
	type TInvokeParameters = Parameters<TInvoke>;

	type InvokeArgs = invokeParameters[1];
	type InvokeOptions = invokeParameters[2];

	/******************
	 * Rust 함수들 확장
	 ******************/
	type TCommand = {
		dialog_open: Array<FileInfo>;
	};

	type TCommandNames = keyof TCommand;

	declare function invoke(
		cmd: TCommandNames,
		args?: InvokeArgs,
		options?: InvokeOptions,
	): Promise<Response<TCommand[TCommandNames]>>;
}
