import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={
        "temperature":0.5
    }
)

class Manager:
    
    def __init__(self):
        self.paper_summary=''
    
    def generate_technical_words(self, paragraphs):
        
        prompt = (
            "I am going to provide you a research paper broken down my paragraphs. "
            "Each paragraph is going to have an ID. I want you to find all uncommonly known "
            "technical words and provide their definitions in their context in the paragraph. "
            "Return the output in the following JSON format: [ { id: <id>, definitions: [{ word: <word>, def: <def> }] } ] "
            "If there are 0 words in the given paragraph return that id with an empty list of definitions. "
            f"This is my research paper: {paragraphs}"
        )
        output=self.get_output(prompt)
        words=self.remove_formatting(output)
        try:
            words_json=json.loads(words)
        except Exception as e:
            return e
        
        return words_json
    
    
    def generate_paragraph_summary(self, paragraphs):
        
        prompt = (
            "I am going to provide a research paper broken down my paragraphs. "
            "Each paragraph is going to have an ID. I want you to summarize each paragraph "
            "from my input. Return the output in the following JSON format: "
            "[{id:123, summary:'summarized paragraph'}] "
            f"This is my research paper: {paragraphs}"
        )
        output=self.get_output(prompt)
        words=self.remove_formatting(output)
        try:
            words_json=json.loads(words)
        except Exception as e:
            return e
        return words_json
    

    def generate(self, paragraphs):
        
        summaries=self.generate_paragraph_summary(paragraphs)
        definitions=self.generate_technical_words(paragraphs)
        
        summary_dict = {item['id']: item for item in summaries}
        definition_dict = {item['id']: item for item in definitions}
        
        merged_data = []
        for id_key in summary_dict.keys() & definition_dict.keys():
            merged_item = {**summary_dict[id_key], **definition_dict[id_key]}
            merged_data.append(merged_item)
            
        return merged_data

    def get_output(self, prompt: str):
        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return e

    def remove_formatting(self, text):
        # Remove ```json and ```
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return text


    # def check_json(self, text):
    #     for item in text:
    #         if not (isinstance(item, dict) and set(item.keys()) == {'word', 'definition'}):
    #             raise ValueError('Invalid JSON format')


if __name__ == "__main__":

    paragraph = """
        A large amount of research has been published in
        recent times and is continuing to find an optimal (or
        nearly optimal) prediction model for the stock market.
        Most of the forecasting research has employed the
        statistical time series analysis techniques like auto-
        regression moving average (ARMA) [2] as well as the
        multiple regression models. In recent years, numerous
        stock prediction systems based on AI techniques,
        including artificial neural networks (ANN) [3, 4, 5], fuzzy
        logic [6], hybridization of ANN and fuzzy system [7, 8,
        9], support vector machines [10] have been proposed.
        However, most of them have their own constraints. For
        instance, ANN is very much problem oriented because of
        its chosen architecture. Some researchers have used fuzzy
        systems to develop a model to forecast stock market
        behaviour. To build a fuzzy system one requires some
        background expert knowledge.
    """
    response=Manager()
    # doc_summary=response.generate_pdf_summary(text)
    para_summary = response.generate_paragraph_summary(paragraph)
    print(response)
    words=response.generate_technical_words(paragraph)
    print(words)