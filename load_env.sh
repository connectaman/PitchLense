#!/usr/bin/env sh

# Load environment variables from a .env file and export them.
# Usage:
#   . ./load_env.sh            # loads from ./.env
#   . ./load_env.sh path/to/.env

set -e

ENV_FILE="${1:-.env}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Warning: $ENV_FILE not found; nothing to load." >&2
  # If sourced, return; if executed, exit gracefully
  return 0 2>/dev/null || exit 0
fi

# Export all variables defined in the .env file
# This preserves quoting and supports typical KEY=VALUE lines
set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

echo "Loaded environment from $ENV_FILE"



