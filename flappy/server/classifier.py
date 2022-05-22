from openvino import runtime
import numpy as np

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

    def classify(self, frame):
        input_data = self.input_from_frame(frame)
        res = self.model([input_data])[self.output_name]
        res = np.squeeze(res)
        return np.argsort(res)[-1]

