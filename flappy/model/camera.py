from pygame import camera, image, event, time
from pygame.locals import KEYDOWN
import pygame
import datetime
import sys
import random

target_dir = sys.argv[2]
photos_delay = 1000

def init_cam(id):
    pygame.init()
    camera.init()
    cam = camera.Camera(camera.list_cameras()[id])
    cam.start()
    return cam

def take_a_photo(cam):
    print("Taking a photo", random.randint(0, 1000))
    filename = datetime.datetime.today().strftime('%Y-%m-%d-%H-%M-%S') + ".png"
    image.save(cam.get_image(), target_dir + "/" + filename)

cam = init_cam(int(sys.argv[1]))
while True:
    time.delay(photos_delay)
    take_a_photo(cam)
