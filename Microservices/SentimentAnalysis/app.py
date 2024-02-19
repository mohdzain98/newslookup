from flask import Flask,request,jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

data = pd.read_csv('finalData.csv')
tf = TfidfVectorizer()
tfdf = tf.fit_transform(data['text'])
with open('model.pkl','rb') as file:
    model = pickle.load(file)
status = "active"

@app.route('/')
def hello_world():
    return jsonify({"status":status,"Value":'Sentiment Analysis Running Successfully'})

@app.route("/analysis", methods=['POST'])
@cross_origin()
def analysis():
    title = request.json
    toPredict = title.get('title')
    new_data = [toPredict]
    vect = pd.DataFrame(tf.transform(new_data).toarray())
    new_data = pd.DataFrame(vect)
    prediction = model.predict(new_data)
    if prediction == 0:
        result="Unhealthy"
    else:
        result="Healthy"
    return jsonify({"result":result})

 
if __name__ == '__main__':
    app.run(debug=True)