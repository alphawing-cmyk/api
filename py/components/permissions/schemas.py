from pydantic import BaseModel
from typing import Optional

class AddPermission(BaseModel):
    name: str
    description: str

class UpdatePermission(AddPermission):
    id: int

class DeletePermission(BaseModel):
    id: int

class PermissionUserLink(BaseModel):
    userId: int
    permissionId: int
