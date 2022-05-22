from openvino import runtime
import cv2
from video_player import VideoPlayer

# core = runtime.Core()
# model = core.read_model("/home/tomek/models/mobilenetv2-12.onnx")
# cm = core.compile_model(model, "CPU")
try:
    player = VideoPlayer(source=0, flip=True, fps=30)
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
        # if frame larger than full HD, reduce size to improve the performance
        scale = 1280 / max(frame.shape)
        if scale < 1:
            frame = cv2.resize(
                src=frame,
                dsize=None,
                fx=scale,
                fy=scale,
                interpolation=cv2.INTER_AREA,
            )
        cv2.imshow(win_title, frame)
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
