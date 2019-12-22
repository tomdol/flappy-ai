import asyncio
import websockets

async def bird_controller(websocket, path):
    while True:
        await asyncio.sleep(0.5)
        await websocket.send(now)

if __name__ == "__main__":
    start_server = websockets.serve(bird_controller, "127.0.0.1", 9000)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
