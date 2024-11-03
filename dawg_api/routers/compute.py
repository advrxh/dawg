from fastapi import APIRouter
from beanie import PydanticObjectId

import httpx

from models.plugin import (
    Plugin,
    Variable,
    AuthType,
    VarTypes,
    Bearer,
    HeaderAuth,
    KeyAuth,
)

from typing import List

router = APIRouter()


def find_magnitude(number):
    abs_number = abs(int(number))
    if abs_number == 0:
        return 1

    num_digits = len(str(abs_number))

    magnitude = 10**num_digits
    return magnitude


async def fetch_result(variables: List[Variable]):

    async with httpx.AsyncClient() as client:

        compute_values = []

        for variable in variables:

            variable.endpoint = str(variable.endpoint)

            if isinstance(variable.auth, Bearer):
                request = await client.get(
                    variable.endpoint,
                    headers={"Authorization": f"Bearer {variable.auth.token}"},
                )

                data = request.json()

            elif isinstance(variable.auth, HeaderAuth):
                request = await client.get(
                    variable.endpoint,
                    headers={variable.auth.header: variable.auth.token},
                )

                data = request.json()

            elif isinstance(variable.auth, KeyAuth):
                request = await client.get(
                    variable.endpoint,
                    params={variable.auth.query: variable.auth.token},
                )

                data = request.json()

            else:
                request = await client.get(
                    variable.endpoint,
                )

                data = request.json()

            if variable.type == VarTypes.int:

                if isinstance(data, list):
                    data = data[0]

                    if not isinstance(data, int):
                        data = int(data)

                if isinstance(data, str):
                    data = int(data)

                elif variable.object is not None:

                    keys = variable.object.split(".")

                    for key in keys:
                        data = data[key]

                    data = int(data)

                compute_values.append(data / find_magnitude(data))

            elif variable.type == VarTypes.string:

                if isinstance(data, list):
                    data = data[0]

                elif variable.object is not None:

                    keys = variable.object.split(".")

                    for key in keys:
                        data = data[key]

                compute_values.append(len(data) / find_magnitude(len(data)))

        return round(sum(compute_values) / len(compute_values), 3)


@router.put("/{plugin_id}")
async def exec(plugin_id: str, prompt: str):

    plugin = await Plugin.find_one(Plugin.id == PydanticObjectId(plugin_id))

    result = await fetch_result(plugin.variables)

    return result
