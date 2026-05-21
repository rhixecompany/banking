# Python Documentation Standards

## Overview

This document outlines the documentation standards for Python code in the Banking project.

## File Organization

- **Scripts**: `scripts/*.py`
- **Configuration**: Root level Python files
- **Requirements**: `requirements.txt`

## Documentation Format

### Google Style Docstrings

Use Google-style docstrings for all Python modules and functions.

```python
"""Module for database initialization and setup.

This module handles the initial setup of the PostgreSQL database
for the Banking application, including schema creation and
initial data seeding.

Example:
    >>> from scripts.init_db import setup_database
    >>> setup_database()
"""

import subprocess
from typing import Optional


def setup_database(drop_existing: bool = False) -> bool:
    """Initialize the database schema.

    Args:
        drop_existing: If True, drops existing tables before creating new ones.
            Defaults to False to prevent accidental data loss.

    Returns:
        True if setup was successful, False otherwise.

    Raises:
        subprocess.CalledProcessError: If database commands fail.
        ConnectionError: If database connection cannot be established.

    Example:
        Basic usage:

        >>> success = setup_database()
        >>> if success:
        ...     print("Database initialized successfully")

        With table reset:

        >>> setup_database(drop_existing=True)
    """
    # implementation
    pass
```

### Class Documentation

```python
class DatabaseManager:
    """Manages database connections and operations.

    This class provides a centralized interface for all database
    interactions in the Banking application, using connection
    pooling and proper resource management.

    Attributes:
        connection_timeout: Maximum time to wait for connection (seconds).
        max_connections: Maximum number of concurrent connections.
        pool_size: Current size of the connection pool.

    Example:
        Creating a manager instance:

        >>> db = DatabaseManager(
        ...     connection_timeout=30,
        ...     max_connections=10
        ... )
        >>> db.connect()
    """

    def __init__(self, connection_timeout: int = 30, max_connections: int = 10):
        """Initialize the database manager.

        Args:
            connection_timeout: Connection timeout in seconds.
            max_connections: Maximum number of connections in pool.
        """
        self.connection_timeout = connection_timeout
        self.max_connections = max_connections
        self.pool_size = 0
```

## Required Documentation

### Scripts

Every Python script must include:

- Module-level docstring describing purpose
- Function docstrings with Args, Returns, Raises, Example
- Type hints for all function parameters and return values

```python
"""Script for running database migrations.

This script wraps the Drizzle ORM migration commands and provides
additional functionality for managing database schema versions.

Usage:
    python scripts/run_migrations.py --direction up
    python scripts/run_migrations.py --direction down --steps 2
"""

from argparse import ArgumentParser
from typing import Optional


def run_migration(direction: str, steps: Optional[int] = None) -> int:
    """Execute database migrations.

    Args:
        direction: Migration direction - 'up' or 'down'.
        steps: Number of migrations to apply. None for all.

    Returns:
        Number of migrations applied.

    Raises:
        ValueError: If direction is not 'up' or 'down'.
    """
    pass
```

### Configuration Files

```python
"""Configuration loader for environment variables.

Loads and validates environment variables required by the Banking
application. Supports both development and production configurations.

Environment Variables:
    DATABASE_URL: PostgreSQL connection string.
    NEXTAUTH_SECRET: Secret for session encryption.
    PLAID_CLIENT_ID: Plaid API client ID.
    PLAID_SECRET: Plaid API secret.
    DWOLLA_KEY: Dwolla API key.
    DWOLLA_SECRET: Dwolla API secret.

Example:
    >>> from scripts.config import load_config
    >>> config = load_config()
    >>> print(config.database_url)
"""

from dataclasses import dataclass
from os import getenv
from typing import Optional


@dataclass
class AppConfig:
    """Application configuration."""
    database_url: str
    nextauth_secret: str
    plaid_client_id: str
    plaid_secret: str
    dwolla_key: str
    dwolla_secret: str


def load_config() -> AppConfig:
    """Load configuration from environment variables."""
    return AppConfig(
        database_url=getenv("DATABASE_URL", ""),
        nextauth_secret=getenv("NEXTAUTH_SECRET", ""),
        plaid_client_id=getenv("PLAID_CLIENT_ID", ""),
        plaid_secret=getenv("PLAID_SECRET", ""),
        dwolla_key=getenv("DWOLLA_KEY", ""),
        dwolla_secret=getenv("DWOLLA_SECRET", "")
    )
```

## Code Examples

### Type Hints

```python
from typing import List, Dict, Optional, Union


def process_transactions(
    transactions: List[Dict[str, Union[str, int]]],
    filter_status: Optional[str] = None
) -> List[Dict[str, Union[str, int, float]]]:
    """Process a list of transactions.

    Args:
        transactions: List of transaction dictionaries.
        filter_status: Optional status to filter by.

    Returns:
        Processed transactions with calculated fields.
    """
    pass
```

### Error Handling

```python
from typing import Tuple


def validate_environment() -> Tuple[bool, Optional[str]]:
    """Validate that all required environment variables are set.

    Returns:
        Tuple of (is_valid, error_message).
    """
    required_vars = ["DATABASE_URL", "NEXTAUTH_SECRET"]
    missing = [var for var in required_vars if not getenv(var)]

    if missing:
        return False, f"Missing required env vars: {', '.join(missing)}"

    return True, None
```

## Best Practices

1. **Use Google-style docstrings** for all functions and classes
2. **Include type hints** for all parameters and return values
3. **Add @example** sections for complex functions
4. **Document exceptions** that functions can raise
5. **Keep docstrings in sync** with code changes

## Related Files

- [requirements.txt](../../requirements.txt)
- [scripts/](../../scripts/)
- [DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md)
