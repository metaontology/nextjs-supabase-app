# Claude Code Hooks

이 디렉토리의 스크립트는 `settings.local.json`에 등록해야 활성화됩니다.
파일만 존재해서는 동작하지 않습니다.

## 스크립트 목록

| 파일                      | 용도                        | 이벤트       |
| ------------------------- | --------------------------- | ------------ |
| `discord_notification.py` | 작업 완료 시 Discord 알림   | `Stop`       |
| `discord_stop.py`         | Claude 중단 시 Discord 알림 | `Stop`       |
| `slack_notification.py`   | 작업 완료 시 Slack 알림     | `Stop`       |
| `slack_stop.py`           | Claude 중단 시 Slack 알림   | `Stop`       |
| `protect-config.py`       | `./config` 폴더 접근 차단   | `PreToolUse` |

## 활성화 방법

`settings.local.json`의 `hooks` 블록에 등록:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/slack_notification.py"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Read|Write|Edit|Glob|Grep|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python3 .claude/hooks/protect-config.py"
          }
        ]
      }
    ]
  }
}
```

## 알림 스크립트 환경변수

Discord/Slack 알림 스크립트는 `.env.local`에 웹훅 URL 설정 필요:

```bash
# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Slack
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```
