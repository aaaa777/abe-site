import datetime
import cv2
from flask import Flask, render_template, request
import numpy as np
from facenet_pytorch import MTCNN, InceptionResnetV1
from PIL import Image
from ray import method

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def hello_world():
    img_dir = "./static/imgs/"
    if request.method == "POST":
        #postされた画像を読み込む
        stream = request.files["img"].stream
        img_arr = np.asarray(bytearray(stream.read()), dtype=np.uint8)
        img = cv2.imdecode(img_arr, 1)
        #現在時刻を名前として保存
        dt_now = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
        img_path = img_dir + dt_now + ".jpg"
        cv2.imwrite(img_path, img)
        sim =  hikaku(path=img_path)
        return render_template("index.html", sim=sim)
    else: 
        img_path = None
        return render_template("index.html")
         
def hikaku(path):
    abe_image = "./static/imgs/abe.jpg"
            #### MTCNN ResNet のモデル読み込み
    mtcnn = MTCNN()
    resnet = InceptionResnetV1(pretrained='vggface2').eval()

       
        #画像ファイルから画像の特徴ベクトルを取得(ndarray 512次元)
    img = Image.open(abe_image)
    img_cropped1 = mtcnn(img)
    feature_vector1 = resnet(img_cropped1.unsqueeze(0))
    a = feature_vector1.squeeze().to('cpu').detach().numpy().copy()

    iimg = Image.open(path)
    img_cropped2 = mtcnn(iimg)
    feature_vector2 = resnet(img_cropped2.unsqueeze(0))
    b = feature_vector2.squeeze().to('cpu').detach().numpy().copy()
        #2つのベクトル間のコサイン類似度を取得(cosine_similarity(a, b) = a・b / |a||b|)
    c = np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
    
    return round(c * 100, 3)

if __name__ == "__main__":
    app.run(port=8001, debug=True)