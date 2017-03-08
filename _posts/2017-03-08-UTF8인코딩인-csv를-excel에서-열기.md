---
layout: post
title: "UTF8인코딩 csv 파일을 excel에서 열기"
date: 2017-03-08
excerpt: "구버전 excel에서 utf-8 csv 파일을 한글깨짐 없이 excel에서 열 수 있도록 하는 방법"
tags: [excel, csv, utf-8, utf-8bom]
comments: true
---

그나마 최근 버전의 excel(아마.. 2013+)에서는 아무런 조치없이도 utf-8인코딩을 지원하지만
그 이전 버전은 텍스트로 따로 열어야 하던가 다른 text editor를 가지고 인코딩을 euc-kr이나 ansi로 변경해서 열어줘야했다.
그러나 이전 버전에서도 utf-8인코딩인 csv파일을 열수 있다. utf-8 앞의 BOM(byte order mark)을 달아주는 것이다.

BOM은 UTF종류 앞에 붙는 바이트로 UTF-8, UTF-16 등등으로 읽을 수 있게 지정해주는 것이다.

변경하는 방식은 간단하다.
서번에서 csv파일 데이터를 `byte []`로 만들어 client로 보낼 때, 바로 앞에 `[239,187,191]`배열을 추가해주면된다.
한번 추가로 안될 경우 `[239,187,191,239,187,191]` 이렇게 두번을 넣어서 보내주면된다.
서버에서 전송하는 encoding은 `UTF-8`로 지정해주면 된다.

javascript에서 csv파일로 만들어 저장하면 인코딩 형식이 `UTF-8 BOM`으로 열리는 것을 확인 할 수 있다.

필자가 사용하는 CSV변환 유틸을 첨부한다.

```java
public class CsvUtil {

	/**
	 * 목록을 받아 CSV 데이터 형식으로 바꿔주는 함수
	 *
	 * @param list
	 * 			데이터 목록
	 * @param clazz
	 * 			데이터 타입
	 * @return CSV 데이터
	 */
	public static byte [] createCsv(List<?> list, Class<?> clazz) {
		String csvString = "";
		try {
			Field [] fieldList = clazz.getDeclaredFields();
			List<String> fieldName = Arrays.asList(fieldList).stream()
																.map(field -> (field.getName()))
																.collect(Collectors.toList());

			csvString = createHeader(fieldName);

			for (Object item : list) {
				csvString = csvString + CSVWriter.RFC4180_LINE_END + creatCsvLine(item, fieldList, clazz);
			}
		} catch (IllegalArgumentException iae) {
			iae.printStackTrace();
		} catch (IllegalAccessException iae) {
			iae.printStackTrace();
		} catch (InstantiationException iae) {
			iae.printStackTrace();
		}

		return ArrayUtils.addAll(encodingUTF8BOM(), csvString.getBytes());
	}

	/**
	 * CSV 헤더를 만들어주는 함수
	 *
	 * @param fileNameList
	 * 			필드 이름 목록
	 * @return CSV 헤더
	 */
	private static String createHeader(List<String> fileNameList) {
		String header = "";

		for (String fileName : fileNameList) {
			if (StringUtils.equals(header, "") == true) {
				header = fileName;
			} else {
				header = header + CSVWriter.DEFAULT_SEPARATOR + fileName;
			}
		}

		return header;
	}

	/**
	 * 한 줄의 CSV 데이터를 만들어 주기 위한 함수
	 *
	 * @param obj
	 * 			데이터
	 * @param fieldList
	 * 			데이터가 갖고 있는 필드 목록
	 * @param clazz
	 * 			데이터 타입
	 * @return CSV 데이터
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws InstantiationException
	 */
	private static String creatCsvLine(Object obj, Field [] fieldList, Class<?> clazz) throws IllegalArgumentException, IllegalAccessException, InstantiationException {
		String line = "";

		if (StringUtils.equals(obj.getClass().getName(), clazz.getName()) == true) {
			for (int i = 0 ; i < fieldList.length ; i++) {
				boolean accessible = fieldList[i].isAccessible();
				fieldList[i].setAccessible(true);

				if (StringUtils.equals(line, "") == true) {
					line = (String)fieldList[i].get(obj);
				} else {
					line = line + CSVWriter.DEFAULT_SEPARATOR + fieldList[i].get(obj);
				}

				fieldList[i].setAccessible(accessible);
			}
		}

		return line;
	}

	/**
	 * csv가 excel에서도 정상적으로 열리게 하기 위한 인코딩 추가 함수
	 *
	 * @return
	 */
	private static byte [] encodingUTF8BOM() {
		byte [] encoding = new byte[6];

		encoding[0] = (byte) 239;
		encoding[1] = (byte) 187;
		encoding[2] = (byte) 191;
		encoding[3] = (byte) 239;
		encoding[4] = (byte) 187;
		encoding[5] = (byte) 191;

		return encoding;
	}

}
```
