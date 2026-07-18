"""Structured logging — the Python counterpart of backend's logger.config.js.

One shared logger configured once, imported everywhere. Plain-text lines in
development; the format carries the same fields pino emits (level, time,
message) so log aggregation treats both services uniformly.
"""

import logging
import sys

from app.core.config import settings

logger = logging.getLogger("ai-service")


def configure_logging() -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        logging.Formatter(
            fmt="%(asctime)s %(levelname)s [%(name)s] %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S",
        )
    )
    logger.setLevel(settings.log_level.upper())
    logger.addHandler(handler)
    logger.propagate = False
