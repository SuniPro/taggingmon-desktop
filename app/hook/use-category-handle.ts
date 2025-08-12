import { formatDateToYYYYMM, parseFileSystemTime } from '~/component/Date/DateFormatter';
import { invokeData } from '~/response/response';
import type { Category } from '../../src-tauri/bindings/Category';
import type { FsoInfo } from '../../src-tauri/bindings/FsoInfo';

export type CategoryInput = { name: string; isDefault: boolean };

export const AutoCategoriesAndInfoGenerator = (
	fsoList: FsoInfo[],
): { name: string; isDefault: boolean; fsoInfo: FsoInfo }[] => {
	const seen = new Set<string>();

	return fsoList
		.filter(d => d.created_at)
		.map(info => {
			const dt = parseFileSystemTime(info.created_at!);
			return { name: formatDateToYYYYMM(dt), isDefault: true, fsoInfo: info };
		})
		.filter(c => (seen.has(c.name) ? false : (seen.add(c.name), true)));
};

export async function createAutoCategories(categories: CategoryInput[]): Promise<Category[]> {
	return await invokeData<Category[]>('insert_categories', { categories });
}

export async function getAllCategories(): Promise<Category[]> {
	return await invokeData<Category[]>('get_categories');
}
