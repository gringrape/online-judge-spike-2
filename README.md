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
