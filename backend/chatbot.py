import openai
import os

# Ensure you have set your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_response(prompt):
    response = openai.Completion.create(
        engine="text-davinci-003",  # Use the GPT-3 model
        prompt=prompt,
        max_tokens=150,  # Adjust the response length as needed
        n=1,  # Number of responses to generate
        stop=None,  # You can define a stopping sequence if needed
        temperature=0.7  # Adjust the creativity of the response
    )
    return response.choices[0].text.strip()

def main():
    print("Chatbot: Hello! How can I assist you today? (Type 'exit' to quit)")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            print("Chatbot: Goodbye!")
            break
        response = get_response(user_input)
        print(f"Chatbot: {response}")

if __name__ == '__main__':
    main()
