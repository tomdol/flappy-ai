from pygame import camera, image, event, time
from pygame.locals import KEYDOWN
from tqdm import tqdm
import pygame
import datetime
import sys
import random

photos_delay = 1000

def init_cam(id):
    pygame.init()
    camera.init()
    cam = camera.Camera(camera.list_cameras()[id])
    cam.start()
    return cam

def take_a_photo(cam, target_dir):
    filename = datetime.datetime.today().strftime('%Y-%m-%d-%H-%M-%S') + ".png"
    image.save(cam.get_image(), target_dir + "/" + filename)

def countdown(delay, color_id):
    colors = ["#FC766A", "#33B864", "#FFFFFF"]
    pbar_interval = 100
    steps = int(delay / pbar_interval)
    
    with tqdm(total=steps, leave=False, bar_format="{bar}", colour=colors[color_id % len(colors)]) as pbar:
        for i in range(steps):
            pbar.update(1)
            time.delay(pbar_interval)

########################################################################################

target_dir = sys.argv[2]
alternate_target_dir = sys.argv[3] if len(sys.argv) == 4 else None
cam = init_cam(int(sys.argv[1]))

countdown(5000, 2)

if alternate_target_dir is not None:
    photos_delay = photos_delay * 2
    dirs = [target_dir, alternate_target_dir]
    i = 0
    while True:
        countdown(photos_delay, i)
        take_a_photo(cam, dirs[i])
        i = (i + 1) % 2
else:
    while True:
        countdown(photos_delay, 0)
        take_a_photo(cam, target_dir)
