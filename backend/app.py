from sentence_transformers import SentenceTransformer, util
import numpy as np

# Load the pre-trained model
model = SentenceTransformer('all-MiniLM-L6-v2')

messages = []

def add_message(message):
    messages.append(message)

def calculate_similarity(new_message):
    if not messages:
        print("No messages to compare with.")
        return None, 0, None
    
    # Compute embeddings
    message_embeddings = model.encode(messages)
    new_message_embedding = model.encode(new_message)
    
    # Calculate cosine similarity between the new message and each existing message
    cosine_sim = util.pytorch_cos_sim(new_message_embedding, message_embeddings).numpy()
    max_sim_index = np.argmax(cosine_sim)
    max_sim_value = np.max(cosine_sim)
    text = messages[max_sim_index]
    
    return max_sim_index, max_sim_value, text

def main():
    SIMILARITY_THRESHOLD = 0.7
    
    while True:
        message = input("Enter a message (or type 'exit' to quit): ")
        if message.lower() == 'exit':
            break
        
        max_sim_index, max_sim_value, similar_message = calculate_similarity(message)
        
        if max_sim_value >= SIMILARITY_THRESHOLD:
            print(f"Similar message found: '{similar_message}' with similarity {max_sim_value:.2f}")
        else:
            if similar_message is not None:
                print(f"No similar message found. Highest similarity is '{similar_message}' which has a value of {max_sim_value:.2f}")
            else:
                print("No similar message found.")
            add_message(message)
            print("Message added to the array.")

if __name__ == '__main__':
    main()
