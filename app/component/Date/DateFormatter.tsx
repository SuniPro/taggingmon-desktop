/**
 * Date 객체를 다음과 같이 포맷팅합니다.
 * new Date(2012, 0, 3) => "2012.01.03"
 */
export const dateToString = (date: Date): string =>
	`${date.getFullYear()}.${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;

/**
 * Date 객체를 다음과 같이 포맷팅합니다.
 * new Date(2012, 0, 3) => "12.01.03"
 */
export const formatDateToYYMMDD = (date: Date): string =>
	`${date.getFullYear().toString().slice(-2)}.${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;

/**
 * Date 객체를 다음과 같이 포맷팅합니다.
 * new Date(2012, 0, 3) => "2012-01"
 */
export const formatDateToYYYYMM = (date: Date): string =>
	`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

/**
 * Date 객체를 다음과 같이 포맷팅합니다.
 * new Date(2012, 0, 3, 12, 34) => "12.01.03 12:34"
 */
export const formatDateToYYMMDDHHMM = (date: Date): string => {
	const year = date.getFullYear().toString().slice(-2);
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${year}.${month}.${day} ${hours}:${minutes}`;
};

/**
 * FileSystem 시간을 Date 형식으로 변경합니다.
 * */
export const parseFileSystemTime = (timestamp: string): Date => {
	// " "를 "T"로 변경하고, 타임존 정보를 제거합니다.
	let isoString = timestamp.replace(' ', 'T').replace(/\s*([+-]\d{2}:\d{2})$/, '$1');

	// 나노초를 밀리초로 변경 (소수점 이하 3자리만 남기고 나머지는 제거)
	isoString = isoString.replace(/\.(\d{3})\d+/, '.$1');

	return new Date(isoString);
};

/**
 * ISO8601 형식의 문자열을 다음과 같이 포맷팅합니다.
 * "2012-01-03T00:00:00.000Z" => "2012.01.03"
 */
export const iso8601ToString = (iso8601: string): string => dateToString(new Date(iso8601));

/**
 * ISO8601 형식의 문자열을 다음과 같이 포맷팅합니다.
 * "2012-01-03T00:00:00.000Z" => "12.01.03"
 */
export const iso8601ToSummaryString = (iso8601: string): string => formatDateToYYMMDD(new Date(iso8601));

/**
 * ISO8601 형식의 문자열을 다음과 같이 포맷팅합니다.
 * "2012-01-03T00:00:00.000Z" => "12.01.03 00:00"
 */
export const iso8601ToYYMMDDHHMM = (iso8601: string): string => formatDateToYYMMDDHHMM(new Date(iso8601));

/**
 * 해당 날짜의 n주 전 기준, 주의 시작일(월요일)과 끝일(일요일)을 반환합니다.
 */
export function getWeekStartAndEndDate(currentDate: Date, weekDifference: number) {
	const startDate = new Date(currentDate);
	const day = currentDate.getDay();

	// startDate를 currentDate의 같은 주 월요일로 설정합니다.
	if (day === 0) {
		// 일요일
		startDate.setDate(startDate.getDate() - 6);
	} else {
		startDate.setDate(startDate.getDate() - day + 1);
	}

	startDate.setDate(startDate.getDate() - 7 * weekDifference); // n주 전으로 설정

	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 6); // startDate의 같은 주 일요일
	return [dateToString(startDate), dateToString(endDate)];
}
