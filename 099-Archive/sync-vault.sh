#!/bin/bash

set -euo pipefail

SRC="/Users/eastar/Documents/github/JS-Study/"
DST="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/JS-Study-mirror/"

mkdir -p "$DST"

rsync -av --delete \
  --exclude='.git/' \
  --exclude='.obsidian/workspace*' \
  --exclude='.DS_Store' \
  --exclude='node_modules/' \
  "$SRC" "$DST"
