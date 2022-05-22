import cv2
from video_player import *
from classifier import *

def crop_and_resize(frame, spatial_size):
    frame = frame[:, 80:560]
    return cv2.resize(
        src=frame,
        dsize=(spatial_size, spatial_size),
        interpolation=cv2.INTER_AREA,
    )

try:
    classifier = Classifier()
    player = VideoPlayer(source=0, flip=True, fps=25)
    player.start()
    win_title = "Flappy Controller"
    cv2.namedWindow(
        winname=win_title, flags=cv2.WINDOW_GUI_NORMAL | cv2.WINDOW_AUTOSIZE
    )
    while True:
        # grab the frame
        frame = player.next()
        if frame is None:
            break
        frame = crop_and_resize(frame, classifier.spatial_size)

        cv2.imshow(win_title, frame)
        classifier.classify(frame)
        key = cv2.waitKey(1)
        if key == 27:
            break
except KeyboardInterrupt:
    print("ctrl-c")
except RuntimeError as e:
    print(e)
finally:
    if player is not None:
        player.stop()
    # if use_popup:
    #     cv2.destroyAllWindows()
