#!/usr/bin/env bash
# Pipeline completo de um episódio:  ./pipeline/build_ep.sh 1
# 1) vozes (edge-tts + FFmpeg)  2) mix (trilha/SFX)  3) legendas (faster-whisper -> ASS/SRT)
# 4) animação (Remotion)        5) finalização (FFmpeg + libass): legendas queimadas + áudio + MP4
set -euo pipefail
EP=${1:-1}; E=$(printf "%02d" "$EP")
cd "$(dirname "$0")/.."
ROOT=..; DONE=$ROOT/done
CHROME=${CHROME:-/opt/pw-browsers/chromium}
[ "${SKIP_AUDIO:-0}" = 1 ] || { python3 pipeline/tts.py "$EP"; python3 pipeline/mix.py "$EP"; python3 pipeline/captions.py "$EP"; }
[ "${SKIP_RENDER:-0}" = 1 ] || npx remotion render remotion/index.ts "EP$E" "$DONE/ep${E}_video_sem_audio.mp4" \
  --browser-executable="$CHROME" --concurrency=4 --crf=14 --codec=h264
ffmpeg -y -v error -stats -i "$DONE/ep${E}_video_sem_audio.mp4" -i "$ROOT/raw/mix/ep${E}_master.wav" \
  -filter_complex "[0:v]subtitles=filename=$DONE/ep${E}_legendas.ass:fontsdir=public/fonts,format=yuv420p[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.1 -r 30 -g 60 \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest \
  -metadata title="SISTEMA INVADIDO - EP. $EP" "$DONE/sistema_invadido_ep${E}.mp4"
ffprobe -v error -show_entries format=duration,bit_rate:stream=codec_name,width,height,r_frame_rate -of compact "$DONE/sistema_invadido_ep${E}.mp4"
