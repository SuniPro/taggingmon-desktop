declare module '@tauri-apps/api/core' {
	import tauriAppsApiCore = require('@tauri-apps/api/core');

	type TInvoke = typeof tauriAppsApiCore.invoke;
	// @CHECK: any로 변환됨
	type TInvokeParameters = Parameters<TInvoke>;

	type InvokeArgs = invokeParameters[1];
	type InvokeOptions = invokeParameters[2];

	type TCommands = 'dialog_open';

	declare function invoke<T>(cmd: TCommands, args?: InvokeArgs, options?: InvokeOptions): Promise<T>;
}
