---
layout: post
title: "MultipartFile Test Code 작성"
date: 2016-12-12
categories: [Back-end, Java]
tags: [java, multipartfile, test code, tdd, junit]
comments: true
---

Test Code를 처음 작성해보면서 새롭게 알게 된 지식이 많이 있다. 그중에 MultipartFile에 관한 Test Code를 작성 할 때는 다른 소스와는 차이점이 있는거 같아 Posting을 남긴다.

```java
	public String fileUpload(MultipartFile file){

        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHMMss");
        String timeStampString = dateFormat.format(calendar.getTime());

        if(file != null){
            try {
                StringBuffer fileName = new StringBuffer(file.getOriginalFilename());
                String fileNewName = fileName.insert(fileName.indexOf("."), "_" + timeStampString).toString();
                String fileFullPath = FILE_SAVE_REAL_PATH+fileNewName;

                File dir = new File(FILE_SAVE_REAL_PATH);
                if (!dir.isDirectory()) {
                    dir.mkdirs();
                }

                file.transferTo(new File(fileFullPath));
                return FILE_SAVE_PROJECT_PATH+fileNewName;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return "";
    }  
```


Test를 해야하는 소스는 위와 같다. 파일을 업로드 하기 위한 소스인데, 다른 부분은 이상이 없지만 파일을 받아와 Test를 해야하기 때문에 dump file을 만들어 줘야한다.

결론 먼저 얘기 하자면 이를 위한 Test Code는 다음과 같다.

```java
	@Test
    public void fileUploadTest() throws Exception {

        MockMultipartFile file = new MockMultipartFile("content", fileName.toString(), "multipart/mixed", content);

        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHMMss");
        String timeStampString = dateFormat.format(calendar.getTime());

        String fileNewName = fileName.insert(fileName.indexOf("."), "_" + timeStampString).toString();

        assertThat(fileUploadService.fileUpload(null), is(""));
        assertThat(fileUploadService.fileUpload(file), is(FILE_SAVE_PROJECT_PATH + fileNewName));

    }   
```

아래에 있는 코드는 file이 들어오는 경우와 null 값이 들어오는 경우를 테스트 한다.

```java
    assertThat(fileUploadService.fileUpload(null), is(""));
    assertThat(fileUploadService.fileUpload(file), is(FILE_SAVE_PROJECT_PATH + fileNewName));
```

윗 코드는 파일이 없을 경우 출력이 ""이 되는 가를 확인한 것이고,  
아래 코드는 파일 경로(FILE_SAVE_PROJECT_PATH)에 fileNewName이라는 이름으로 파일을 저장되는 것인지를 확인하는 코드다.

이 코드에서 중요시 봐야 할 코드는

```java
	MockMultipartFile file = new MockMultipartFile("content", fileName.toString(), "multipart/mixed", content);
```

이다.

처음에 이클립스 자동완성으로 MockMultipartFile을 만들게 되면

```java
	MockMultipartFile file = new MockMultipartFile(name, content);
```

라고만 나와 file이름과 내용을 만들어 적는 경우가 다반사 일텐데, 실상은 그렇지 않는다.

파일 이름 앞에 "content", 파일 내용앞에 "multipart/mixed"를 붙여줘야 테스트용 파일이 정상적으로 생성되는 것을 확인 할수 있다.

```java
    final StringBuffer fileName = new StringBuffer("test.jpg");
    final byte[] content = "hello world".getBytes();
```

파일의 이름과 내용은 이런식으로 dump data를 지정해주면 된다.  
오늘 안 사실이인데 StringBuffer는 여러 사용자가 동시에 접근할 경우 이를 막아주는 소스가 있다고 한다.  
하지만 여기선 그리 중요한 기능도 아니고 살면서 그 기능을 사용하는 경우는 극히 드물다고 한다.  
그렇기 때문에 **StringBuilder** 를 사용하는 것이 더 좋은 방식이라고 한다.  
