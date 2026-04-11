#!/usr/bin/env python3
"""
./config 폴더 접근 차단 훅
PreToolUse 이벤트에서 config 폴더 접근을 감지하고 차단한다.
"""
import json
import sys
import re
import os


def main():
    input_data = json.load(sys.stdin)
    tool_name = input_data.get('tool_name', '')
    tool_input = input_data.get('tool_input', {})

    path = extract_path(tool_name, tool_input)

    if path and is_config_path(path):
        output = {
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": f"⚠️ [protect-config hook] ./config 폴더에 대한 접근이 차단되었습니다: {path}",
                "additionalContext": "⚠️ protect-config 훅이 작동하여 접근을 차단했습니다. 보안 정책: ./config 폴더는 접근이 제한됩니다. 해당 경로 접근을 시도하지 마세요."
            }
        }
        print(json.dumps(output, ensure_ascii=False))

    sys.exit(0)


def extract_path(tool_name, tool_input):
    """도구별 파일 경로 추출"""
    if tool_name in ('Read', 'Write', 'Edit'):
        return tool_input.get('file_path', '')
    elif tool_name == 'Glob':
        return tool_input.get('path', '') or tool_input.get('pattern', '')
    elif tool_name == 'Grep':
        return tool_input.get('path', '')
    elif tool_name == 'Bash':
        command = tool_input.get('command', '')
        # 명령어 문자열에서 config/ 경로 패턴 감지
        if re.search(r'(?:^|[\s\'""/])\.?/?config/', command):
            return f'config (via Bash: {command[:80]})'
        return ''
    return ''


def is_config_path(path):
    """config 폴더 접근 여부 판별"""
    # os.path.normpath로 ./, ../ 등 정규화
    normalized = os.path.normpath(path)
    parts = normalized.split(os.sep)
    # 경로 첫 세그먼트가 config이거나, 경로 중간에 config 폴더 포함
    return parts[0] == 'config' or (len(parts) > 1 and 'config' in parts)


if __name__ == '__main__':
    main()
