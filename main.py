# main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import tensorflow as tf
import pathlib

from keras.models import load_model
import os
import io

from keras.preprocessing.image import load_img

import matplotlib.pyplot as plt
from glob import glob
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained model
model=load_model('model.h5')

# Define API endpoint to receive image uploads and return predictions
@app.post("/predict")
async def predict_skin_disease(image: UploadFile = File(...)):

    data_dir_train = pathlib.Path("C:/Users/Prema/Downloads/model/Skin cancer ISIC The International Skin Imaging Collaboration/Train")
    image_dataset = tf.keras.preprocessing.image_dataset_from_directory(data_dir_train,batch_size=32,image_size=(180,180),
                                                                    label_mode='categorical',seed=123)
    
    class_names = image_dataset.class_names
    
    image = Image.open(image.file).convert("RGB")
    # Test_image = load_img(Test_image[-1], target_size=(180, 180, 3))
    image = image.resize((180,180))
    # plt.imshow(Test_image)
    # plt.grid(False)
    img = np.asarray(image)


    img = np.expand_dims(img, axis=0)
    pred_arr = model.predict(img)
    
    pred = np.argmax(pred_arr)
    value = round(pred_arr[0][pred]*100)
    pred_class = class_names[pred]

    print(pred_class,value)

    return JSONResponse(content={"prediction": pred_class,"percentage": value})
