from pygame import camera, image, event, time
from pygame.locals import KEYDOWN
from tqdm import tqdm
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
    filename = datetime.datetime.today().strftime('%Y-%m-%d-%H-%M-%S') + ".png"
    image.save(cam.get_image(), target_dir + "/" + filename)

def countdown(delay):
    pbar_interval = 100
    steps = int(delay / pbar_interval)
    
    with tqdm(total=steps, leave=False, bar_format="{bar}", nrows=4) as pbar:
        for i in range(steps):
            pbar.update(1)
            time.delay(pbar_interval)

########################################################################################

cam = init_cam(int(sys.argv[1]))
while True:
    take_a_photo(cam)
    countdown(photos_delay)
