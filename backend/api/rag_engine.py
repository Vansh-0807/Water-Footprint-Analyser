import os
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import DataFrameLoader
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_classic.chains import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from django.conf import settings
import base64
from langchain_core.messages import HumanMessage, SystemMessage
from tenacity import retry, stop_after_attempt, wait_exponential

# 1. Setup the AI models using your own Gemini API key
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

# 2. Setup the local vector database folder
CHROMA_DB_DIR = os.path.join(settings.BASE_DIR, "chroma_db")

def process_dataset(file_path):
    """
    Reads a CSV dataset, converts rows to text documents, chunks them
    and saves the embeddings into ChromaDB
        
    """
    try:
        # load the CSV into a pandas dataframe
        df = pd.read_csv(file_path)

        # we need a column containing the main text for the AI to read.
        # assuming your csv has a column named 'descriptiom' or we combine them

        # now we convert every row into a string of text
        df['page_content'] = df.apply(lambda row: ' | '.join([f"{col}: {val}" for col, val in row.items()]), axis = 1)

        # load the dataframe into langchain documents
        loader = DataFrameLoader(df, page_content_column = "page_content")
        docs = loader.load()

        # split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap = 500)
        splits = text_splitter.split_documents(docs)

        # save to chromadb
        Chroma.from_documents(documents=splits, embedding=embeddings, persist_directory=CHROMA_DB_DIR)

        return True, "Datset successfully processed and stored in the Vector DB!"
    
    except Exception as e:
        return False, str(e)

@retry(stop=stop_after_attempt(4), wait=wait_exponential(multiplier=2, min=2, max=10))
def ask_chatbot(user_query, media_file=None):
    """
    Searches the Vector DB for text context, and dynamically
    constructs a multimodel prompt so Gemini can see images
    And read the database.
    
    """
    try:
        #1. Connect to the ChromaDB
        vectorstore = Chroma(persist_directory = CHROMA_DB_DIR, embedding_function = embeddings)

        # 2. Retrieve context (If they just uploaded a photo with no text, we search generally)
        search_query = user_query if user_query else "crop disease and soil analysis"
        docs = vectorstore.similarity_search(search_query, k=1)
        context = '\n'.join([doc.page_content for doc in docs])

        # 3. Build the system prompt with the database context
        system_text = (
            "You are an expert agricultural assistant for the Water Footprint Analyser app. \n"
            "You have two main jobs:\n"
            "1. Answer questions about crops, soil, and agriculture using the retrieved context below.\n"
            "2. Guide the user on how to use this application if they ask for help.\n\n"
            "### How to use the Water Footprint Analyser App:\n"
            "- Step 1: Use the 'Detect Location' or 'Select on Map' button to fetch live weather and climate data for your farm.\n"
            "- Step 2: Select your Crop Type and Soil Type from the dropdown menus.\n"
            "- Step 3: Enter your Land Area and choose the unit (hectares or square meters).\n"
            "- Step 4: Click 'Calculate Water Footprint' to view your total/daily water needs, irrigation efficiency, and a detailed chart (Uptake, Evaporation, Runoff).\n\n"
            "Keep your response concise and friendly. If answering about crops, rely on the context provided. If answering about the app, use the manual above.\n\n"
            f"Context:\n{context}"
        )
        
        # 4. Build the user's message (text + image)
        human_content = []
        
        if user_query:
            human_content.append({"type": "text", "text": user_query})
        else:
            human_content.append({"type": "text", "text": "Please analyze this image based on out agricultural data."})

        if media_file:
            # convert the physical image into a Base64 string so the AI can "see" it
            encoded_media = base64.b64encode(media_file.read()).decode('utf-8')
            human_content.append({
                "type": "image_url",
                "image_url" : {"url": f"data: {media_file.content_type};base64,{encoded_media}"}
            })

        # 5. send both prompts to Gemini
        messages = [
            SystemMessage(content=system_text),
            HumanMessage(content=human_content)
        ]

        import time
        max_attempts = 5
        for attempt in range(max_attempts):
            try:
                response = llm.invoke(messages)
                break
            except Exception as e:
                if "503" in str(e) and attempt < max_attempts - 1:
                    time.sleep(2 * (attempt + 1)) # Exponential backoff: 2s, 4s, 6s...
                else:
                    raise e # Re-raise if it's not a 503 or we ran out of attempts

        if isinstance(response.content, list):
            return " ".join([block['text'] for block in response.content if 'text' in block])
        
        return response.content
    
    except Exception as e:
        return f"Sorry, I encountered an error: {str(e)}"


        