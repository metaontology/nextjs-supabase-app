#!/bin/bash
input=$(cat)

MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')

BLUE='\033[96m'; GREEN='\033[32m'; YELLOW='\033[33m'; ORANGE='\033[38;5;228m'; RED='\033[31m'; RESET='\033[0m'

# 컨텍스트 사용량에 따라 표시줄 색상 선택
if [ "$PCT" -ge 90 ]; then BAR_COLOR="$RED"
elif [ "$PCT" -ge 70 ]; then BAR_COLOR="$YELLOW"
else BAR_COLOR="$GREEN"; fi

BAR=$(python3 -c "
pct=${PCT}
total=13
filled=round(pct/100*total)
empty=total-filled
print('\u2588'*filled + '\u2591'*empty)
" 2>/dev/null)

MINS=$((DURATION_MS / 60000)); SECS=$(((DURATION_MS % 60000) / 1000))

BRANCH=""
git rev-parse --git-dir > /dev/null 2>&1 && BRANCH=" | 🌿 $(git branch --show-current 2>/dev/null)"

COST_FMT=$(printf '$%.2f' "$COST")

# 1줄: ✨ 파란색 [모델명]
echo -e "✨ ${BLUE}[${MODEL}]${RESET}"
# 2줄: 폴더 경로 (마지막 폴더명 yellow 강조)
DIR_PARENT=$(dirname "$DIR")
DIR_LAST=$(basename "$DIR")
echo -e "📁 ${DIR_PARENT}/${ORANGE}${DIR_LAST}${RESET}${BRANCH}"
# 3줄: context | 비용 | 시간
echo -e "🧩 ${BAR_COLOR}${BAR}${RESET} ${PCT}% | ${YELLOW}${COST_FMT}${RESET} | ⏱️ ${MINS}m ${SECS}s"
