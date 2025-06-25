# AWS에서 `eloop.kro.kr` 도메인 설정 가이드

## 준비 사항

### 1. AWS 계정 및 권한

* AWS 콘솔에 로그인 가능한 IAM 사용자 또는 관리 권한을 가진 계정이 필요합니다.
* Route 53, ACM, S3, CloudFront, (필요 시) Elastic Beanstalk/API Gateway 사용 권한을 확인하세요.

### 2. 도메인 등록

* 이미 `eloop.kro.kr`의 **상위 도메인**(`kro.kr`)이 Route 53에 등록되어 있어야 합니다.
* 없다면 Route 53에서 도메인을 구매하거나 외부 등록기관에서 구매 후 네임서버를 Route 53 호스티드 존으로 변경하세요 ([docs.aws.amazon.com][1]).

---

## 1. Route 53 호스티드 존 생성

1. AWS Management Console → Route 53 → **Hosted zones** → **Create hosted zone** 클릭
2. **Domain name**에 `eloop.kro.kr` 입력 (서브도메인만 관리하려면 루트 `kro.kr` 호스티드 존에서 레코드만 추가 가능) ([docs.aws.amazon.com][1]).
3. **Type**은 Public Hosted Zone 선택 후 **Create** 완료.

---

## 2. SSL/TLS 인증서 요청 (ACM)

1. AWS Management Console → Certificate Manager → **Request a certificate** 선택 ([docs.aws.amazon.com][2]).
2. **Request a public certificate** → **Next**
3. **Domain names**에 `eloop.kro.kr` 추가 → **Next**
4. **Validation method**: DNS validation 권장 (Route 53과 자동 통합) ([docs.aws.amazon.com][3]).
5. 요청 완료 후, ACM이 생성한 CNAME 레코드를 Route 53 호스티드 존에 자동으로 추가하거나 수동으로 복사·생성하세요.
6. 상태가 **Issued**로 변경될 때까지 대기합니다.

---

## 3. 정적 웹 호스팅 설정 (S3 + CloudFront)

### 3.1 S3 버킷 생성 및 구성

1. S3 콘솔 → **Create bucket** → 버킷 이름을 `eloop.kro.kr`로 지정
2. **Block Public Access** 설정 해제 후 퍼블릭 읽기 권한 부여
3. **Properties** → **Static website hosting** 활성화

   * **Index document**: `index.html`
   * **Error document**: `404.html` (선택) ([docs.aws.amazon.com][4]).

### 3.2 CloudFront 배포 생성

1. CloudFront 콘솔 → **Create Distribution** → **Web** 선택
2. **Origin domain**에 S3 웹사이트 엔드포인트(`eloop.kro.kr.s3-website-<region>.amazonaws.com`) 지정
3. \*\*Alternate Domain Names (CNAMEs)\*\*에 `eloop.kro.kr` 추가 ([docs.aws.amazon.com][5]).
4. **SSL Certificate**: ACM에서 발급받은 `eloop.kro.kr` 인증서 선택 ([docs.aws.amazon.com][6]).
5. 나머지 설정(Default) 유지 후 **Create Distribution** 클릭
6. 배포 상태가 **Deployed**가 될 때까지 대기합니다.

---

## 4. Route 53 DNS 레코드 구성

### 4.1 CloudFront용 Alias 레코드

1. Route 53 호스티드 존(`eloop.kro.kr`) → **Create record**
2. **Record name**: 비워 두면 루트(`eloop.kro.kr`)에 매핑
3. **Record type**: A – IPv4 address
4. **Alias**: Yes
5. **Alias target**: 생성된 CloudFront 배포 도메인 선택 ([docs.aws.amazon.com][7]) ([docs.aws.amazon.com][8]).
6. **Save record** 클릭

### 4.2 서브도메인 및 기타 레코드

* `www.eloop.kro.kr`으로 리다이렉트가 필요하면 별도 S3 버킷 + CloudFront 설정 후 A 레코드 alias 설정
* **TTL**: 기본 300초 권장

---

## 5. 동적 애플리케이션 배포 (선택)

### 5.1 Elastic Beanstalk

* Elastic Beanstalk 콘솔에서 애플리케이션 환경 생성
* **Domain prefix**: `eloop` (→ `eloop.elasticbeanstalk.com`)
* Route 53 호스티드 존에서 **CNAME 레코드**로 Elastic Beanstalk URL을 매핑 ([docs.aws.amazon.com][9]).

### 5.2 API Gateway (REST 또는 HTTP API)

* API Gateway → **Custom domain names** → `api.eloop.kro.kr` 추가 ([docs.aws.amazon.com][10]).
* ACM에서 발급받은 인증서(US East 1)에 매핑
* **Base Path Mapping**을 통해 스테이지→API 연결
* Route 53에서 A 레코드 alias로 API Gateway 커스텀 도메인 연결

---

## 6. 테스트 및 검증

1. 로컬에서 `dig eloop.kro.kr` 또는 `nslookup`으로 DNS 해석 확인
2. 브라우저에서 `https://eloop.kro.kr` 접속 → SSL 인증서 유효성, 콘텐츠 로드 확인
3. **curl -I [https://eloop.kro.kr](https://eloop.kro.kr)** 로 HTTP 헤더 확인 (200 OK)

---

## 7. 모니터링 및 유지보수

* **CloudWatch Metrics**: CloudFront 요청 수, 오류율, 레이턴시 추적
* **ACM 자동 갱신**: DNS validation 방식이면 만료 30일 전 자동 갱신 지원 ([docs.aws.amazon.com][2]).
* **Route 53 Health Checks**: 가용성 알람 설정
* **CI/CD**: GitHub Actions → S3 배포 & CloudFront 무효화(invalidation) 자동화

---

# 참고 자료

[1]: 1. https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/getting-started.html?utm_source=chatgpt.com "Getting started with Amazon Route 53"
[2]: https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-request-public.html?utm_source=chatgpt.com "AWS Certificate Manager public certificates - AWS Documentation"
[3]: https://docs.aws.amazon.com/acm/latest/userguide/acm-public-certificates.html?utm_source=chatgpt.com "Request a public certificate in AWS Certificate Manager"
[4]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/website-hosting-custom-domain-walkthrough.html?utm_source=chatgpt.com "Configuring a static website using a custom domain registered with ..."
[5]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html?utm_source=chatgpt.com "Use custom URLs by adding alternate domain names (CNAMEs)"
[6]: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html?utm_source=chatgpt.com "Requirements for using SSL/TLS certificates with CloudFront"
[7]: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-cloudfront-distribution.html?utm_source=chatgpt.com "Routing traffic to an Amazon CloudFront distribution by using your ..."
[8]: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html?utm_source=chatgpt.com "Choosing between alias and non-alias records - Amazon Route 53"
[9]: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-to-beanstalk-environment.html?utm_source=chatgpt.com "Routing traffic to an AWS Elastic Beanstalk environment"
[10]: https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html?utm_source=chatgpt.com "Custom domain name for public REST APIs in API Gateway"
