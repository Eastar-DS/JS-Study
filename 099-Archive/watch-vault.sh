#!/bin/bash

set -euo pipefail

SRC="/Users/eastar/Documents/github/JS-Study"
FSWATCH_BIN="/opt/homebrew/bin/fswatch"
SYNC_SCRIPT="/Users/eastar/Documents/github/JS-Study/099-Archive/sync-vault.sh"

"$FSWATCH_BIN" -o "$SRC" | xargs -n1 -I{} "$SYNC_SCRIPT"
