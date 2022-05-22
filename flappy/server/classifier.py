from openvino import runtime
import numpy as np
from enum import Enum

class FrameClass(Enum):
    ARMS_UP = 0
    ARMS_DOWN = 1
    NON_FUNCTIONAL = 2

    @classmethod
    def from_int(cls, value):
        if value == 0:
            return cls.ARMS_UP
        elif value == 1:
            return cls.ARMS_DOWN
        else:
            return cls.NON_FUNCTIONAL

class Classifier:
    def __init__(self):
        core = runtime.Core()
        model = core.read_model("/home/tomek/models/mobilenetv2-12.onnx")
        model.reshape([1, 3, 224, 224])
        self.model = core.compile_model(model, "CPU")
        self.output_name = self.model.output(0)
        self.spatial_size = self.model.input(0).shape[3]

    def input_from_frame(self, frame):
        return np.expand_dims(np.transpose(frame, (2, 0, 1)), 0)

    def classify(self, frame) -> FrameClass:
        input_data = self.input_from_frame(frame)
        res = self.model([input_data])[self.output_name]
        res = np.squeeze(res)
        return FrameClass.from_int(np.argsort(res)[-1])

