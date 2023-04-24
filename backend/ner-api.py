from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer
from flair.data import Sentence
from flair.models import SequenceTagger
import json
from tqdm import tqdm
from nltk.tokenize import sent_tokenize
from pprint import pprint
import spacy

nlp = spacy.load("en_core_web_sm")

app = FastAPI()

model_name = "djagatiya/ner-roberta-base-ontonotesv5-englishv4"

USE_FLAIR = False  # Set to True to use Flair, False to use Hugging Face model

if USE_FLAIR:
    tagger = SequenceTagger.load("flair/ner-english-ontonotes-fast")
else:
    ner_pipeline = pipeline("ner", model=model_name, tokenizer=model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)

class Text(BaseModel):
    text: str
    
def group_entities_by_type(entities):
    grouped_entities = {}
    for entity in entities:
        entity_type = entity["entity"]
        if entity_type not in grouped_entities:
            grouped_entities[entity_type] = []
        grouped_entities[entity_type].append(entity)
    return grouped_entities

def chunk_text(text, chunk_size):
    words = text.split()
    chunks = []
    current_chunk = []
    current_size = 0

    for word in words:
        current_chunk.append(word)
        current_size += len(word)

        if current_size > chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_size = 0

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks
def extract_character_information(grouped_entities, text):
    character_profiles = []
    print(grouped_entities)

    if "PERSON" in grouped_entities:
        for person in grouped_entities["PERSON"]:
            character_profile = {
                "name": person["word"],
                "age": None,
                "occupation": None,
                "relationships": {
                    "family": [],
                    "friends": [],
                    "colleagues": []
                },
                "traits": [],
                "actions": []
            }

            # Analyze the context around the character's name
            context = text[max(0, person["start"] - 100):min(len(text), person["end"] + 100)]
            print(context)
            context_doc = nlp(context)

            # Extract occupation and age using SpaCy's dependency parsing
            occupation_found = False
            age_found = False
            for token in context_doc:
                if token.text == person["word"]:
                    # Find occupation
                    if token.dep_ == "compound" and token.head.pos_ == "NOUN":
                        character_profile["occupation"] = token.head.text
                        occupation_found = True

                    # Find age
                    if token.dep_ == "nummod" and token.head.pos_ == "NOUN" and token.head.text.lower() in ["age", "years"]:
                        character_profile["age"] = token.text
                        age_found = True

            if not occupation_found:
                character_profile["occupation"] = "Not found"

            if not age_found:
                character_profile["age"] = "Not found"

            character_profiles.append(character_profile)

    return character_profiles
@app.post("/entities")
async def get_entities(text: Text):
    print("Input text: {text.text}")  # Debugging

    named_entities = []

    if USE_FLAIR:
        # Create a Sentence object from the input text
        sentences = sent_tokenize(text.text)

        # Loop over each sentence and predict NER tags
        for sentence_text in tqdm(sentences, total=len(sentences), desc="Processing sentences"):
            sentence = Sentence(sentence_text)
            tagger.predict(sentence)
            # Loop over each entity in the sentence
            for entity in sentence.get_spans('ner'):
                print(entity)

        # Print the dictionary of entities and their sentences
        # pprint(entity_sentences)

        # Predict NER tags using the Fla
        # Process the predicted NER spans
        # for entity in sentence.get_spans('ner'):
        #     named_entities.append({
        #         'entity': entity.tag,

        #         'word': entity.text,
        #         'score': entity.score
        #     })
    else:
            input_tokens_list = []
            sentences = sent_tokenize(text.text)
            for sentence_text in tqdm(sentences, total=len(sentences), desc="Tokenizing sentences"):
                sentence = Sentence(sentence_text)
                tokens = tokenizer(sentence_text, return_tensors="pt", truncation=False, padding=False)
                input_tokens_list.append(tokens)
                

            # for chunk in text_chunks:
            #     tokens = tokenizer(chunk, return_tensors="pt", truncation=False, padding=False)
            #     input_tokens_list.append(tokens)

            entities = []
            for idx, input_tokens in tqdm(enumerate(input_tokens_list), total=len(input_tokens_list), desc="Processing text chunks"):
                # Decode the chunk of token IDs back to text
                decoded_chunk = tokenizer.decode(input_tokens["input_ids"][0])
                # Feed the decoded chunk to the NER model
                chunk_entities = ner_pipeline(decoded_chunk)

                entities.extend(chunk_entities)

            for entity in entities:
                entity["score"] = float(entity["score"])
            named_entities = []
            for span in entities:
                named_entities.append({
                        'entity': span['entity'],
                        'start': span['start'],
                        'end': span['end'],
                        'word': span['word'],
                        'score': float(span['score'])
                    })
            
            pprint("Starting named_entities_cleaning...")
            i = 0
            while i < len(named_entities) - 1:
                if "##" in named_entities[i + 1]["word"]:
                    pprint("cleaning" + named_entities[i]["word"] + " - ## type")
                    named_entities[i]["word"] = named_entities[i]["word"] + named_entities[i + 1]["word"].replace("##", "")
                    named_entities[i]["end"] = named_entities[i + 1]["end"]
                    named_entities.pop(i + 1)
                else:
                    i += 1
            j = 0
            while j < len (named_entities) - 1:
                if named_entities[j]["end"] == named_entities[j + 1]["start"]:
                    pprint("cleaning" + named_entities[j]["word"] + " - j type")
                    named_entities[j]["word"] = named_entities[j]["word"] + named_entities[j + 1]["word"]
                    named_entities[j]["end"] = named_entities[j + 1]["end"]
                    named_entities.pop(j + 1)
                else:
                    
                    j += 1
            k = 0
            while k < len (named_entities) - 1:
                if named_entities[k]["end"] == (named_entities[k+1]["start"] - 1):
                    pprint((named_entities[k+1]["start"] + 1))
                    pprint("cleaning" + named_entities[k]["word"] + " - k+1 type")
                    named_entities[k]["word"] = named_entities[k]["word"] + " " + named_entities[k + 1]["word"]
                    named_entities[k]["end"] = named_entities[k + 1]["end"]
                    named_entities.pop(k + 1)
                else:
                    k += 1
            l = 0
            while l < len(named_entities):
                named_entities[l]["word"] = named_entities[l]["word"].replace("Ġ", "")
                named_entities[l]["word"] = named_entities[l]["word"].replace("Ċ", "")
                l += 1
            pprint("Finished named_entities_cleaning.")
            

            grouped_entities = group_entities_by_type(named_entities)
            character_profiles = extract_character_information(grouped_entities, text.text)
            pprint(named_entities)
            pprint(character_profiles)
                    
                    
                

                    
            json_word_entities = json.dumps(named_entities)
            # json_named_entities = jsonify_named_entities(named_entities)
            # json_named_entities_filtered = json_named_entities_filter(json_named_entities)
            
            # print(f"JSON named entities: {json_word_entities}")  # Debugging
            return {"named_entities": named_entities, "character_profiles": character_profiles}


def jsonify_named_entities(named_entities):
  """Converts a list of named entities to a JSON serializable format."""
  json_named_entities = []
  for named_entity in named_entities:
    json_named_entity = {
      'entity': named_entity['entity'],
      'start': named_entity['start'],
      'end': named_entity['end'],
      'word': named_entity['word'],
      'score': float(named_entity['score'])
      }
    json_named_entities.append(json_named_entity)
  return json_named_entities, named_entities


def json_named_entities_filter(json_named_entities):
    if not isinstance(json_named_entities, list):
        raise TypeError("Expected a list of dictionaries")
    unique_json_named_entities = {}
    for json_named_entity in json_named_entities:
        entity_id = (json_named_entity['start'], json_named_entity['end'])
        if entity_id not in unique_json_named_entities:
            unique_json_named_entities[entity_id] = json_named_entity
    result = list(unique_json_named_entities.values())
    return result