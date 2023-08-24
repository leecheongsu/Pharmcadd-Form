# 작업 리스트

- 스토리보드 - [PDF](./Pharmcadd_Form_스토리보드.pdf) 
- 프로토타입 - [오븐](https://ovenapp.io/view/b1D9R0CAUmqzxV062Awnys0PHwWroDCU/VJBtG)  
- 퍼블리싱 목록 - [Index page](http://localhost:3000/) (front local 실행 후 확인)
- API 목록 - [PDF](./Pharmcadd_Form_API.pdf)
- API Document - [Postman](https://documenter.getpostman.com/view/16313435/UVREm5VR)

---

# 개발환경
## Front
- 프레임워크 - [Next.js](https://nextjs.org/docs/getting-started) (React)
- CSS Library - [tailwindcss](https://tailwindcss.com/docs/installation)

### Front 로컬 접속 정보
```
- HOST : localhost
- PORT : 3000
```
#### Runs the app in the development mode : `next dev`

## Back
- 프레임워크 - Spring boot v2.6.0
- 언어 - Kotlin v1.6.0
- 컴파일러 - JVM v11
- build system - GRADLE

### API 로컬 접속 정보
```
- HOST : localhost
- PORT : 34090
``` 

## DB
- DB - postgresql v42.3.1
- 매핑 라이브러리 - jooq v3.15.4
- 마이그레이션 - flyway v8.0.5


### DB 로컬 접속 정보
```
- HOST : localhost  
- PORT : 5432  
- USERNAME : mdss  
- PWD : ph4rmc4dd  
- DB : pharmcadd-form
```  

### Branch
1. `main`의 `local` 에서 개발  
2. 개발 완료시, `main` 브랜치로 `push`    
3. 매일 작업 전, `main` 브랜치 `rebase` 또는 `merge`

```
- main : 개발
- release : 배포
```
