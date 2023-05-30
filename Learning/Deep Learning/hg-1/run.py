from transformers import pipeline

# The models are hosted on the Hugging Face Hub
# The ones chosen here are the most popular ones (the default ones, if you will)

classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
print(classifier([
  "I'm happy to learn the 🤗 Transformers library.",
  "I love you.",
  "I hate you."
]))

# [{'label': 'POSITIVE', 'score': 0.9997300505638123}, {'label': 'POSITIVE', 'score': 0.9998705387115479}, {'label': 'NEGATIVE', 'score': 0.9992952346801758}]

classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
print(classifier(
  "This is a course about the Transformers library",
  candidate_labels=["education", "politics", "business"],
))

# {'sequence': 'This is a course about the Transformers library', 'labels': ['education', 'business', 'politics'], 'scores': [0.8445963859558105, 0.1119762884979248, 0.04342731860208511]}

generator = pipeline("text-generation", model="gpt2")
print(generator("In this course, we will teach you how to"))

# [{'generated_text': 'In this course, we will teach you how to take photos of your friends. It will be fun and full of surprises. We will share everything you need to do on your day off with the best photographers you can find and make you feel like a'}]
