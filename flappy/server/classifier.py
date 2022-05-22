from openvino import runtime

class Classifier:
    def __init__(self):
        core = runtime.Core()
        model = core.read_model("/home/tomek/models/mobilenetv2-12.onnx")
        model.reshape([1, 3, 224, 224])
        self.model = core.compile_model(model, "CPU")
        self.spatial_size = self.model.input(0).shape[3]

    def classify(self, frame):
        print(frame.shape)
        pass
