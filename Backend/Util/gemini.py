import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="gemini-2.0-flash")


class Manager:

    def __init__(self):
        self.paper_summary = ''

    def generate_pdf_summary(self, paper: str):

        prompt = (
            "Given my research paper summarize the paper:"
            f"{paper}"
        )

        self.paper_summary = self.get_output(prompt)
        return self.paper_summary

    def generate_paragraph_summary(self, paragraph: str):

        summary = self.paper_summary

        if summary:
            prompt = (
                "I am going to provide a paragrah and I want you to summarize it. "
                "Only give me the output of the summary and nothing else. "
                f"This is the context of the paragraph, CONTEXT: {summary}. "
                f"This is the paragrah to summarize, PARAGRAPH: {paragraph}"
            )

        else:
            prompt = (
                "I am going to provide a paragrah and I want you to summarize it. "
                "Only give me the output of the summary and nothing else. "
                f"This is the paragrah to summarize, PARAGRAPH: {paragraph}"
            )
        return self.get_output(prompt)

    def generate_technical_words(self, paragraph: str):

        prompt = (
            f"I am going to provide a paragrah from this paper: {self.paper_summary}"
            "I want you to give me all of the uncommonly known technical words and their "
            f"definitions in the context they are used in the paragraph. "
            "Give me the output in JSON format like this: [{word:'text', definition:'text'}]. "
            f"PARAGRAPH: {paragraph}"
        )
        output = self.get_output(prompt)
        words = self.remove_formatting(output)
        try:
            words_json = json.loads(words)
        except Exception as e:
            return e

        return words_json

    def get_output(self, prompt: str):
        try:
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            return e

    def remove_formatting(self, text):
        # Remove ```json and ```
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return text

    def check_json(self, text):
        for item in text:
            if not (isinstance(item, dict) and set(item.keys()) == {'word', 'definition'}):
                raise ValueError('Invalid JSON format')


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
    response = Manager()
    doc_summary = response.generate_pdf_summary(text)
    para_summary = response.generate_paragraph_summary(paragraph)
    print(response)
    words = response.generate_technical_words(paragraph)
    print(words)
