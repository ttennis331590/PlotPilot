import docx
from pprint import pprint
from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline
from flair.data import Sentence
from flair.models import SequenceTagger
import nltk
from tqdm import tqdm
import torch
from fastapi import FastAPI, File, UploadFile
import io
import uvicorn

app = FastAPI()

if torch.cuda.is_available():
    print("GPU support is enabled in PyTorch")
else:
    print("GPU support is not enabled in PyTorch")

Flair = True
#file_path = "./uploads/tim/TEST2.docx"


tokenizer = AutoTokenizer.from_pretrained("nickprock/distilbert-finetuned-ner-ontonotes")
model = AutoModelForTokenClassification.from_pretrained("nickprock/distilbert-finetuned-ner-ontonotes")
nlp = pipeline("ner", model=model, tokenizer=tokenizer)

# Insert labels into the text
def insert_labels(text, ner_results):
    labeled_text = text
    for result in reversed(ner_results):
        label = f"[{result['entity']}]"
        position = result["end"]
        labeled_text = labeled_text[:position] + label + labeled_text[position:]
    return labeled_text

# Main function
def bert_ner(text):
    # Read the docx file
    sentences = nltk.sent_tokenize(text)

    all_ner_results = []
    offset = 0
    for sentence in tqdm(sentences, desc="Processing sentences"):
        ner_results = nlp(sentence)
        # Adjust the start and end positions using the current offset
        for result in ner_results:
            result["start"] += offset
            result["end"] += offset

        all_ner_results.extend(ner_results)
        # Update the offset with the length of the current sentence and the extra space
        offset += len(sentence) + 1

    people = [result for result in all_ner_results if result['entity'] == 'B-PERSON' or result['entity'] == 'I-PERSON']
    pprint(people)

    labeled_text = insert_labels(document_text, all_ner_results)
    print("\nLabeled text:\n")
    print(labeled_text)

def flair_ner(text):
    tagger = SequenceTagger.load("flair/ner-english-ontonotes-fast")
    # tagger = SequenceTagger.load("flair/ner-english-fast")
    
    sentences = nltk.sent_tokenize(text)

    sentence_offsets = []
    start = 0
    
    # Calculate the start and end offsets for each sentence
    for sentence in sentences:
        end = start + len(sentence)
        sentence_offsets.append((start, end))
        start = end + 1
    entities = []
    for index, sentence in enumerate(tqdm(sentences, desc="Processing sentences")):
        sentence = Sentence(sentence)
        tagger.predict(sentence)
        for entity in sentence.get_spans('ner'):
            entity_start = sentence_offsets[index][0] + entity.start_position
            entity_end = sentence_offsets[index][0] + entity.end_position
            entity_score = entity.score
            entity_startend = [entity_start, entity_end]
            entity_data = {
                "Text": entity.text,
                "Mentions": [entity_startend],
                "Type": entity.tag,
                "Score": entity_score  
            }
            entities.append(entity_data)
    pprint("processing entities")
    merged_entities = []
    for entity in entities:
        merged = False
        for m_entity in merged_entities:
            if entity["Text"] == m_entity["Text"]:
                m_entity['Mentions'].extend(entity['Mentions'])
                merged = True
                break

        if not merged:
            merged_entities.append(entity)

    pprint(merged_entities)
    return merged_entities

@app.post("/upload_file/")
async def process_file(file: UploadFile = File(...)):
    print("Processing file: ", file.filename)
    contents = await file.read()
    document = docx.Document(io.BytesIO(contents))
    text = ""
    print(text)
    for paragraph in document.paragraphs:
        text += paragraph.text + "\n"

    if Flair:
        return flair_ner(text)
    else:
        return bert_ner(text)

# Modify the main function to run FastAPI app with Uvicorn
def main():
    uvicorn.run("spacy_server:app", host="0.0.0.0", port=3003, log_level="info", reload=True)

if __name__ == "__main__":
    main()