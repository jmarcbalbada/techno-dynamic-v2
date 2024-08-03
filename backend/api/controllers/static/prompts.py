# CHATBOT

CHATBOT_HISTORY_CONTENT = ""
CHATBOT_OUTPUT_CONTEXT = f"Thank you for providing me with information. Ask me anything about the said topic"

def prompt_history_content(lesson_title,lesson_subtitle,content):
  global CHATBOT_HISTORY_CONTENT

  CHATBOT_HISTORY_CONTENT = f"You are a helpful assistant that provides information based on the lesson provided only. If the question is not related to the lesson, then you can say that it is not related. Lesson Title: {lesson_title}\nSubtitle: {lesson_subtitle}\nContent: {content}. Answer in 2-4 sentences only."

  return CHATBOT_HISTORY_CONTENT

# SUGGESTION

SUGGESTION_SYSTEM_CONTENT = "You are a helpful assistant. RETURN AN HTML MARKUP. USE <br> for breaking lines. I DONT WANT TO SEE ANY NEWLINES \n ON YOUR RESPONSE. I WILL BE DISAPPOINTED"
SUGGESTION_SYSTEM_CONTENT_INSIGHTS = "You are a helpful assistant. ALWAYS RESPOND IN HTML MARKUP, USE <br> for newlines instead of \\n, dont state the title like \" Insights\" instead go directly to your answer and use <h1> up to <h3> for titles, not **"


 # content
def prompt_create_content_abs(faq_questions,lesson_content_text):
  input_text = f"""
            Here is the FAQ from students:
            ${faq_questions}

            Here are the original lesson contents:
            ${lesson_content_text}

            NOTE:
            RETURN ME HTML MARKUP: use <br> for breaking lines
            RETURN ME A REVISED AND RICH, ENHANCED CONTENT BASED ROM THE FAQ AND ORIGINAL LESSONS.
            USE <h1> UNTIL <h3> for TITLES NOT **
            YOU HAVE TO EXPLAIN AND EXPOUND GIVE MANY EXAMPLES. EACH PARAGRAPH SHOULD HAVE ATLEAST 20 SENTENCES WITH REAL WORLD EXAMPLES. BE REALISTIC USE YOUR SOURCES. AS IF YOU ARE CREATING YOUR FIRST AND LAST CONTENT AS A TEACHER, BE PASSIONATE.
            PROVIDE BULLETS, LIST <li> <ul> GIVEN EXAMPLES ON THE TOPIC, BE CREATIVE IT IS A MUST YOU HAVE LIST OR BULLETS HIGHLY REQUIRED.
            PARAPHRASE EACH PARAGRAPH USE SCHOOL-APPROPRIATE WORDS.

            IT IS EXPECTED THAT YOU HAVE SUMMARY AT THE END, SUMMARIZING THE TOPIC. IF THERE IS A YOUTUBE LINK VIDEO FROM ORIGINAL LESSON CONTENT YOU MUST RETAIN IT.

            I DONT WANT TO SEE ANY NEWLINES \n ON YOUR RESPONSE. I WILL BE DISAPPOINTED. DONT OVERUSE <br> FOR UI PLEASURITY.

            FOR <br> IF YOU ARE USING <h3> YOU CAN HAVE 2 <br> BELOW BUT I YOU ARE USING <h1> UNTIL <h2> USE ONLY 1 <br> BELOW ON IT.
            NOTE: DONT USE TOO MUCH <br> PLEASE. ONLY USE 1-2 <br> PER PARAGRAPH.

            """
  return input_text

  # insights
def prompt_create_insights_abs(faq_questions,lesson_content_text):
  input_text = f"""
            Here is the FAQ from students:
            ${faq_questions}

            Here are the original lesson contents:
            {lesson_content_text}

            NOTE: YOU ARE REQUIRED TO CREATE AN INSIGHT GIVEN THE FAQ AND ORIGINAL LESSON CONTENTS:
            NOTE: YOU MUST RETURN AN HTML MARKUP NOT AN HTML FILE AND IT SHOULD BE RICH INSIGHTS.
            NOTE: YOU MUST SAY IN EVERY BULLET THAT STUDENTS ARE MORELIKELY WANT TO LEARN ABOUT ETC ETC
            Insights in bullet form similar to the following examples this is insight based on the faq from students so most likely you will tell the user (teacher) that Students are most likely eager to learn etc etc.., return in HTML MARKUP: DONT ANSWER STARTING WITH \"Insights:\", just go directly with answers DO NOT MENTION ENHANCED INSIGHTS OR ETC
            - <strong>Entrepreneurship's Impact:</strong> Students are keen to explore entrepreneurship's role in driving economic growth and innovation, especially in identifying opportunities and fostering competition.<br>
            - <strong>Qualities of Success:</strong> There's strong interest in the qualities defining successful entrepreneurs, emphasizing creativity, determination, and resilience.<br>
            - <strong>Technological Influence:</strong> Students recognize the importance of technology in entrepreneurship, highlighting the need to leverage advancements for innovation and competitiveness.<br>
            - <strong>Areas for Improvement:</strong> To enhance learning, deeper insights into specific strategies for opportunity identification, risk management, and technological integration could be provided.<br>
            - <strong>Unlock the full potential of your lesson materials:</strong> By addressing student curiosity and strengthening key concepts.<br>
            Limit to these 5 bullets just focus on painpointing what might wrong in the lesson and how to address them.
            NOTE: IT IS A MUST THAT YOU INCLUDE THESE 5 BULLETS MENTIONED IN YOUR RESPONSE AND HIGHLY ENCOURAGE TO USE <br> rather than "\n
            The insight must be about this:
            ${faq_questions}
            NOTE: You must mention the important words or context what is in the faq_questions.
            """
  
  return input_text