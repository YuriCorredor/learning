import string
import random
import uuid

GOAL = 'you are awesome and i love you so much and i want to be with you forever and ever'

class Element:
  LETTERS = list(string.ascii_lowercase + ' ')
  NUMBER_OF_LETTERS = len(GOAL)

  def __init__(self, word: str = None):
    self.id = uuid.uuid4()
    if word is None:
      self.word = self.generate_random_word()
    else:
      if len(word) != self.NUMBER_OF_LETTERS:
          raise ValueError('Word must have {} letters'.format(self.NUMBER_OF_LETTERS))
      self.word = word

  def fitness(self):
    return sum(1 for i, letter in enumerate(self.word) if letter == GOAL[i])

  def mutate(self):
    if random.randint(0, 10) == 0:
      index = random.randint(0, self.NUMBER_OF_LETTERS - 1)
      self.word = list(self.word)
      self.word[index] = random.choice(self.LETTERS)
      self.word = ''.join(self.word)

  def generate_random_word(self):
    return ''.join(random.choice(self.LETTERS) for _ in range(self.NUMBER_OF_LETTERS))

  def crossover(self, other):
    return ''.join(random.choice(pair) for pair in zip(self.word, other.word))

class Game:
  def __init__(self):
    self.elements = [Element() for _ in range(1000)]
    self.generation = 0

  def start(self):
    while True:
      self.generation += 1

      sorted_elements = sorted(self.elements, key=lambda e: e.fitness(), reverse=True)

      print('Generation: {}, Best: {}, Average: {}'.format(self.generation, sorted_elements[0].word, self.average_fitness()))


      if sorted_elements[0].word == GOAL:
        print('Found "{}" in generation {}'.format(GOAL, self.generation))
        break

      new_generation = sorted_elements[:10]

      while len(new_generation) < len(self.elements):
        parent1, parent2 = random.sample(new_generation, 2)
        child_word = parent1.crossover(parent2)
        child = Element(child_word)
        child.mutate()
        new_generation.append(child)

      self.elements = new_generation

  def average_fitness(self):
    return sum(e.fitness() for e in self.elements) / len(self.elements) / Element.NUMBER_OF_LETTERS * 100

  def best(self):
    return max(self.elements, key=lambda e: e.fitness())

game = Game()
game.start()
