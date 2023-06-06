from langchain.tools import BaseTool
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.agents import initialize_agent
from langchain.agents.agent_types import AgentType
from math import pi
from typing import Union
from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# This is a tool that calculates the circumference of a circle
class CircumferenceTool(BaseTool):
  name = "Circumference calculator"
  # This is the description of the tool used by the LLM
  description = "use this tool when you need to calculate a circumference using the radius of a circle"

  # This is the function that is called when the tool is run
  def _run(self, radius: Union[int, float]):
    return float(radius)*2.0*pi
  
  # This is the function that is called when the tool is run asynchronously
  def _arun(self, _: Union[int, float]):
    raise NotImplementedError("This tool does not support async")

# Initialize the LLM
llm = ChatOpenAI(
  openai_api_key=OPENAI_API_KEY, # this is inferred and does not need to be passed
  temperature=0,
  model_name="gpt-3.5-turbo"
)

# Initialize conversation memory
conversational_memory = ConversationBufferMemory(
  memory_key='chat_history',
  return_messages=True
)

tools = [CircumferenceTool()]

# REACT: SYNERGIZING REASONING AND ACTING IN LANGUAGE MODELS -> https://arxiv.org/pdf/2210.03629.pdf
agent = initialize_agent(
  agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
  tools=tools,
  llm=llm,
  memory=conversational_memory,
  verbose=True,
  max_iterations=3,
  early_stopping_method='generate',
)

# Existing prompt
print(agent.agent.llm_chain.prompt.messages[0].prompt.template)

# Run the agent with a question about the circumference of a circle
agent("What is the circumference of a circle with radius 74.88mm?")
