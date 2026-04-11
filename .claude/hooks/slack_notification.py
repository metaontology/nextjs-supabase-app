#!/usr/bin/env python3
"""
Claude Code Notification Hook
권한 요청 또는 알림 발생 시 Slack으로 메시지를 전송합니다.
"""

import json
import os
import sys
import urllib.request
from pathlib import Path
from datetime import datetime


def load_env_file(project_root: Path) -> None:
    """
    .env.local 파일에서 환경변수를 로드합니다.
    이미 설정된 환경변수는 덮어쓰지 않습니다.
    """
    env_file = project_root / ".env.local"
    if not env_file.exists():
        return

    with open(env_file, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            # 빈 줄 및 주석 건너뜀
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip("'\"")
            # 이미 설정된 환경변수는 덮어쓰지 않음 (시스템 우선)
            os.environ.setdefault(key, value)


def send_slack_message(webhook_url: str, payload: dict) -> None:
    """Slack Incoming Webhook으로 메시지를 전송합니다."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        webhook_url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        if resp.status != 200:
            raise RuntimeError(f"Slack API 오류: HTTP {resp.status}")


def main() -> None:
    # 프로젝트 루트 = CWD (Claude Code는 프로젝트 루트에서 훅 실행)
    project_root = Path(os.getcwd())
    load_env_file(project_root)

    webhook_url = os.environ.get("SLACK_WEBHOOK_URL")
    if not webhook_url:
        # SLACK_WEBHOOK_URL 미설정 시 조용히 종료 (훅 실패 방지)
        sys.exit(0)

    # stdin에서 Claude Code 훅 데이터 읽기
    try:
        hook_data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        hook_data = {}

    # 알림 메시지 및 메타데이터 추출
    message = hook_data.get("message", "Claude Code에서 알림이 있습니다.")
    title = hook_data.get("title", "Claude Code 알림")
    notification_type = hook_data.get("notification_type", "")
    project_name = project_root.name
    now = datetime.now().strftime("%H:%M:%S")

    payload = {
        "attachments": [
            {
                "color": "warning",  # 노란색 - 주의/확인 필요
                "blocks": [
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": f"🔔 {title}",  # title 필드 동적 반영
                            "emoji": True,
                        },
                    },
                    {
                        "type": "section",
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": f"*메시지:*\n{message}",  # message 레이블 추가
                            },
                        ],
                    },
                    {
                        "type": "context",
                        "elements": [
                            {
                                "type": "mrkdwn",
                                "text": f"📁 *{project_name}*  |  🕐 {now}"
                                        + (f"  |  🏷️ `{notification_type}`" if notification_type else ""),
                            }
                        ],
                    },
                ],
            }
        ]
    }

    try:
        send_slack_message(webhook_url, payload)
    except Exception as e:
        # Slack 전송 실패는 Claude Code 작업을 중단시키지 않음
        print(f"[Slack Hook] 전송 실패: {e}", file=sys.stderr)
        sys.exit(0)


if __name__ == "__main__":
    main()
