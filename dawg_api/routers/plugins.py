from fastapi import APIRouter, HTTPException
from beanie import PydanticObjectId

from models.plugin import Plugin, PluginIn
from routers.compute import router as compute_router

router = APIRouter()
router.include_router(compute_router, prefix="/exec")


@router.put("/")
async def create(plugin: PluginIn):
    _plugin = await Plugin(**plugin.dict()).create()
    return {"id": str(_plugin.id)}


@router.get("/")
async def get_user(id: str = None):

    if id is None:
        plugins = Plugin.find_all()

        return await plugins.to_list()

    _plugin = await Plugin.find_one(Plugin.id == id)

    if _plugin is None:
        return "Invalid id, plugin does not exist."

    return PluginIn(**_plugin.dict())


@router.delete("/")
async def del_plugin(id: str):

    plugin = await Plugin.find_one(Plugin.id == PydanticObjectId(id))

    if plugin is None:
        raise HTTPException(status_code=404, detail={"error": "Plugin not found"})

    return await plugin.delete()
