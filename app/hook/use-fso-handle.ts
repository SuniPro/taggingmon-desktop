import type { FsoInfo } from 'src-tauri/bindings/FsoInfo';
import { typedInvoke } from '~/util/typed-invoke';
import { useQuery } from '@tanstack/react-query';
import type { Category } from '../../src-tauri/bindings/Category';
import { invokeData } from '~/response/response';
import { AutoCategoriesAndInfoGenerator } from '~/hook/use-category-handle';

export const useFsoInsertInDB = ({ fsoList }: { fsoList: FsoInfo[] }) => {
	// fsoList;
	//
	// const { data, isLoading, error, refetch } = useQuery<FsoInfo[], Error>({
	// 	queryKey: [''],
	// });
	//
	// const dialogRes = await typedInvoke('dialog_open');
};

export interface insertFsoInDBProps {
	fso_info_list: FsoInfo[];
	category_id?: number | BigInt;
	tag_id?: number | BigInt;

	// fso_info_list: Vec<FsoInfo>,
	// category_ids: Option<Vec<i64>>, // Vec<i64>로 수정
	// tag_ids: Option<Vec<i64>>,       // Vec<i64>로 수정
}

export async function insertFsoInDB(insertFsoInDBProps: insertFsoInDBProps): Promise<number[]> {
	const { fso_info_list, tag_id, category_id } = insertFsoInDBProps;
	// 1. fso_info_list를 복사하여 새로운 배열을 만듭니다.
	//    (원본 데이터를 변경하지 않기 위함)
	const fsoListWithNullId = fso_info_list.map(fso => {
		// 2. 각 객체의 'id' 필드를 null로 설정합니다.
		return { ...fso, id: null };
	});

	return await invokeData<number[]>('insert_fso_async', {
		fsoInfoList: fsoListWithNullId,
		tagId: tag_id,
		categoryId: category_id,
	});
}
