from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Any


@dataclass
class InMemoryStore:
    users: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    farmers: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    crops: List[Dict[str, Any]] = field(default_factory=list)
    auctions: List[Dict[str, Any]] = field(default_factory=list)
    blockchain_logs: List[Dict[str, Any]] = field(default_factory=list)
    feedbacks: List[Dict[str, Any]] = field(default_factory=list)
    transport_pools: List[Dict[str, Any]] = field(default_factory=list)


store = InMemoryStore()
