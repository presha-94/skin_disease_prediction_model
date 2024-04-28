from keras.models import load_model
import os

import pathlib

from keras.preprocessing.image import load_img

import numpy as np

import matplotlib.pyplot as plt



import tensorflow as tf

model=load_model('model.h5')

data_dir_train = pathlib.Path("C:/Users/Prema/Downloads/model/Skin cancer ISIC The International Skin Imaging Collaboration/Train")
data_dir_test = pathlib.Path("C:/Users/Prema/Downloads/model/Skin cancer ISIC The International Skin Imaging Collaboration/Test")
image_dataset = tf.keras.preprocessing.image_dataset_from_directory(data_dir_train,batch_size=32,image_size=(180,180),
                                                                    label_mode='categorical',seed=123)


class_names = image_dataset.class_names 


from glob import glob
Test_image_path ="C:/Users/Prema/Downloads/model/download.jpeg"
Test_image = glob(Test_image_path)
Test_image = load_img(Test_image[-1], target_size=(180, 180, 3))
plt.imshow(Test_image)
plt.grid(False)

img = np.expand_dims(Test_image, axis=0)
pred = model.predict(img)
pred = np.argmax(pred)
pred_class = class_names[pred]
print(  "Predictive Class "+pred_class )


