# 언어 및 커뮤니케이션 규칙

## 🌐 응답 언어
- **모든 응답은 한국어로 작성**

## 💻 코드 언어
- **주석(Comments)**: 한국어
- **문서화 주석(Docstrings/JSDoc)**: 한국어
- **커밋 메시지**: 영문 (→ `.claude/rules/git-commit.md` 참조)

## 📝 예시

### JavaScript 주석
```javascript
// 사용자 인증 처리
function authenticateUser(username, password) {
  /**
   * 사용자 로그인을 처리합니다.
   * @param {string} username - 사용자 이름
   * @param {string} password - 비밀번호
   * @returns {boolean} 인증 성공 여부
   */
  // 구현 내용...
}
```

## ✅ 원칙
- 기술 용어는 필요시 영문 병기 가능 (예: "벡터 데이터베이스(Vector Database)")
- 변수명, 함수명은 영문 사용 (camelCase, snake_case 등 컨벤션 준수)
- 설명과 문서는 반드시 한국어
