from fastai.vision.all import *
import gradio as gr



im = PILImage.create("images/cat.jpg")
im.thumbnail((192,192))

categories = ("Dog", "Cat")

def is_cat(x): return x[0].isupper() 
learn = load_learner("_model.pkl")

def predict_image(img):
  _, _, probs = learn.predict(img)
  return dict(zip(categories, map(float, probs)))

inputs = gr.inputs.Image(shape=(192,192))

outputs =  gr.outputs.Label(num_top_classes=2)

title = "Cat or Dog?"
description = "This is a demo of a image classifier trained on the Oxford-IIIT Pet Dataset. It can distinguish between 37 species of dogs and cats. Try uploading your own cat or dog photos!"

grinterface = gr.Interface(fn=predict_image, inputs=inputs, outputs=outputs, title=title, description=description)

grinterface.launch()
