import asyncio
import websockets
import json
import logging

# logging.basicConfig(level=logging.DEBUG)

async def bird_controller(websocket, path):
    while True:
        await asyncio.sleep(2)
        await websocket.send(json.dumps({'command': 'flap'}))


class Comm():
    def __init__(self):
        pass

    def handler(self, ws: websockets.WebSocketServerProtocol, uri: str):
        logging.debug('Registering Comm handler')


if __name__ == '__main__':
    comm = Comm()

    start_server = websockets.serve(comm.handler, '127.0.0.1', 9000)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
