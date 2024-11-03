from beanie import Document
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from enum import Enum


class VarTypes(Enum):
    string = "string"
    int = "int"


class AuthType(Enum):
    bearer = "bearer"
    header = "header"
    key = "key"
    open = "open"


class Bearer(BaseModel):
    token: str


class HeaderAuth(BaseModel):
    header: str
    token: str


class KeyAuth(BaseModel):
    query: str
    token: str


class Variable(BaseModel):
    type: VarTypes
    name: str
    endpoint: HttpUrl
    object: Optional[str] = None
    auth_type: Optional[AuthType] = None
    auth: Optional[Bearer | HeaderAuth | KeyAuth] = None


class PluginIn(BaseModel):
    name: str
    description: str
    variables: List[Variable]


class Plugin(PluginIn, Document):
    class Settings:
        name = "plugins"
