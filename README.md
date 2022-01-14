# online-judge-spike-2
## 스파이크 목표
- 독립된 환경(Sandbox)에서 사용자 코드 실행

## 작업
- 언어마다 docker container 설정
- container 에서 실행하고 결과 반환
- 시작, 종료 시 실행 흔적 삭제

## 추가과제
- JSON.parse 로 파싱되지 않는 입출력 (특히 javascript 이외의 언어)
- gVisor 를 통한 host system 접근 차단
- VM 을 통해 시스템 접근 모듈(child_process, fs, 자바는?)을 스코프에서 제거
- bash script? -> shell 형식이 아닌 다른 메타포가 있지 않을까?

## 작업 후 관찰 된 내용 정리
### execute 함수가 응집된 몇개의 부분으로 나누어집니다.
- '코드(답안)'를 '입력'과 함께 '실행가능한 형태'로 변환하는 부분
- '실행가능한 형태' 를 저장하는 부분
- 외부 shell(외부 인터페이스) 에 저장된 '실행가능 형태'를 실행시키고 결과를 얻는 부분 
