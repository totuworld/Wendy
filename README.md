# Wendy
소규모 게임 개발팀을 위한 게임 서버

## 소개
Wendy는 게임을 운영할 때 필요한 기능을 포함한 게임 서버입니다. 주된 목적은 게임 서버에 대한 이해를 높여 누구나 게임 운영에 도움을 얻는 것입니다.

게임 클라이언트와 서버로 나눠서 운영하지 않는 경우 사용자의 요구에 빠른 시간안에 대응하기 어렵습니다. 클라이언트를 다시 빌드해서 배포하는데는 많은 시간과 에너지가 소모되기 때문입니다. 더 큰 문제는 어뷰징이나 불법적인 게임 클라이언트 사용을 알아도 제재할 수단이 없거나 많은 시간이 소요되어 금전적인 손해를 입는 것입니다.

이런 문제에서 소규모 게임 개발팀이 조금이나마 도움이 되길 원합니다.

### 커뮤니티
* 향후 트위터나 페이스북등의 공식채널을 제공합니다.
* 버그나 이슈는 [issue tracker](https://github.com/totuworld/Wendy/issues)에 등록해주세요.
* 새로운 기능이나 업데이트가 있으시다면 pull request 보내주세요. :)

## 사용방법

### 필요사항
* (필수) Node.js >= 6.x
* (선택) Microsoft Azure 계정

### 설치
yarn 패키지 매니저를 통해 설치를 진행합니다. yarn이 이미 설치되어있다면 첫번째 명령은 넘어가도 좋습니다.

```bash
$ npm install -g yarn
$ yarn install
```
### 실행방법
실행 방법은 아주 간단합니다.

```bash
$ node server.js
```


## 제공할 기능 목록

### 필수 기능
Wendy가 지원할 필수 기능입니다.

- [ ] 기기정보 관리
- [ ] 사용자 정보 관리
- [ ] 재화 관리
- [ ] 아이템 관리
- [ ] 인앱 영수증 검증

### 부가 기능
차후 구현이 될만한 기능들 목록입니다. 이 중 요구가 많은 것을 중심으로 구현될 예정입니다.

* 상점
* 가챠
* 메시지
* 쿠폰
* 공지
* 파일 관리
* 로그

## License

(The MIT License)

Copyright (c) 2016 Yochang Song

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.