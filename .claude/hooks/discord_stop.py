#!/usr/bin/env python3
"""
Claude Code Stop Hook
작업이 완료되었을 때 Discord로 완료 알림을 전송합니다.
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


def send_discord_message(webhook_url: str, payload: dict) -> None:
    """Discord Incoming Webhook으로 메시지를 전송합니다."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        webhook_url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "DiscordBot (claude-code, 1.0)",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        # Discord Webhook 성공: 200 또는 204
        if resp.status not in (200, 204):
            raise RuntimeError(f"Discord API 오류: HTTP {resp.status}")


def extract_text_from_content(content) -> str:
    """content 필드에서 텍스트를 추출합니다. (문자열 또는 블록 배열 모두 지원)"""
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
            elif isinstance(block, str):
                parts.append(block)
        return " ".join(parts).strip()
    return ""


def extract_task_summary(transcript_path: str) -> tuple[str, str]:
    """
    트랜스크립트 JSONL에서 마지막 사용자 요청과 어시스턴트 응답을 추출합니다.
    Returns: (user_request, assistant_response)
    """
    if not transcript_path:
        return "", ""

    path = Path(transcript_path)
    if not path.exists():
        return "", ""

    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except Exception:
        return "", ""

    last_user = ""
    last_assistant = ""

    for line in lines:
        if not line.strip():
            continue
        try:
            entry = json.loads(line)
        except json.JSONDecodeError:
            continue

        # 다양한 포맷 지원: {role, content} 또는 {type, message: {role, content}}
        role = entry.get("role") or entry.get("type", "")
        inner = entry.get("message", entry)
        content = inner.get("content", "")

        text = extract_text_from_content(content)
        if not text:
            continue

        if role == "user":
            last_user = text
        elif role == "assistant":
            last_assistant = text

    # 너무 길면 자르기
    max_user = 150
    max_assistant = 300
    if len(last_user) > max_user:
        last_user = last_user[:max_user] + "..."
    if len(last_assistant) > max_assistant:
        last_assistant = last_assistant[:max_assistant] + "..."

    return last_user, last_assistant


def main() -> None:
    # 프로젝트 루트 = CWD (Claude Code는 프로젝트 루트에서 훅 실행)
    project_root = Path(os.getcwd())
    load_env_file(project_root)

    webhook_url = os.environ.get("DISCORD_WEBHOOK_URL")
    if not webhook_url:
        # DISCORD_WEBHOOK_URL 미설정 시 조용히 종료 (훅 실패 방지)
        sys.exit(0)

    # stdin에서 Claude Code 훅 데이터 읽기
    try:
        hook_data = json.load(sys.stdin)
    except (json.JSONDecodeError, EOFError):
        hook_data = {}

    project_name = project_root.name
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # stop_hook_active: 이미 Stop Hook 중에 다시 Stop된 경우 (루프 방지)
    if hook_data.get("stop_hook_active"):
        sys.exit(0)

    # last_assistant_message: Stop 이벤트에서 직접 제공되는 마지막 응답 (우선 사용)
    # 없으면 트랜스크립트 파싱으로 폴백
    last_assistant_message = hook_data.get("last_assistant_message", "")
    if last_assistant_message and len(last_assistant_message) > 300:
        last_assistant_message = last_assistant_message[:300] + "..."

    transcript_path = hook_data.get("transcript_path", "")
    last_user, last_assistant_fallback = extract_task_summary(transcript_path)

    # hook_data의 last_assistant_message 우선, 없으면 트랜스크립트 파싱 결과 사용
    last_assistant = last_assistant_message or last_assistant_fallback

    # embed fields 구성
    fields = [
        {"name": "프로젝트", "value": project_name, "inline": True},
        {"name": "완료 시각", "value": now, "inline": True},
    ]

    # 작업 내용이 있으면 필드 추가
    if last_user or last_assistant:
        summary_value = ""
        if last_user:
            summary_value += last_user
        if last_assistant:
            if summary_value:
                summary_value += f"\n\n**응답 요약**\n{last_assistant}"
            else:
                summary_value = last_assistant
        fields.append({"name": "요청", "value": summary_value, "inline": False})

    payload = {
        "username": "Claude Code Bot",
        "embeds": [
            {
                "title": "✅ Claude Code 작업 완료",
                "color": 0x57F287,  # 초록색 - 성공/완료
                "fields": fields,
                "footer": {
                    "text": f"📂 {project_root}",
                },
            }
        ],
    }

    try:
        send_discord_message(webhook_url, payload)
    except Exception as e:
        # Discord 전송 실패는 Claude Code 작업을 중단시키지 않음
        print(f"[Discord Hook] 전송 실패: {e}", file=sys.stderr)
        sys.exit(0)


if __name__ == "__main__":
    main()
