# CHATBOT

CHATBOT_HISTORY_CONTENT = ""
CHATBOT_OUTPUT_CONTEXT = f"Thank you for providing me with information. Ask me anything about the said topic"

def prompt_history_content(lesson_title,lesson_subtitle,content):
  global CHATBOT_HISTORY_CONTENT

  # CHATBOT_HISTORY_CONTENT = f"You are a helpful assistant that provides information based on the lesson provided only. If the question is not related to the lesson, then you can say that it is not related. Lesson Title: {lesson_title}\nSubtitle: {lesson_subtitle}\nContent: {content}. Answer in 2-4 sentences only."
  CHATBOT_HISTORY_CONTENT = f"You are a helpful assistant that provides information based on the lesson provided. Lesson Title: {lesson_title}\nSubtitle: {lesson_subtitle}\nContent: {content}. Answer in 2-4 sentences only."
  
  return CHATBOT_HISTORY_CONTENT

# SUGGESTION

SUGGESTION_SYSTEM_CONTENT = "You are a helpful assistant. RETURN AN HTML MARKUP. USE <br> for breaking lines. I DONT WANT TO SEE ANY NEWLINES \n ON YOUR RESPONSE. I WILL BE DISAPPOINTED"
SUGGESTION_SYSTEM_CONTENT_INSIGHTS = "You are a helpful assistant. ALWAYS RESPOND IN HTML MARKUP, USE <br> for newlines instead of \\n, dont state the title like \" Insights\" instead go directly to your answer and use <h1> up to <h3> for titles, not **"

# SUGGESTION_SYSTEM_CONTENT_PROPOSE = f"""VERY IMPORTANT NOTE: GIVEN THESE HTML MARKUP REMOVE ALL THE CONTENT WRAPPED BY <mark style="background-color: lightcoral;"> UNTIL YOU FIND ITS CLOSING TAG
#                                       VERY IMPORTANT NOTE: ALSO IF YOU ENCOUNTER <mark></mark> WITH NO STYLE OF BACKGROUND COLOR LIGHTCORAL YOU MUST RETAIN IT AND REMOVE ITS TAG SO THAT
#                                       THERE WILL BE NO HIGHLIGHT SINCE THESE mark YELLOW TAG SHOULD BE RETAINED AND THE mark with lightcoral or RED tag SHOULD BE REMOVED.
#                                       VERY IMPORTANT NOTE: I WILL BE DISAPPOINTED IF YOU DID NOT FOLLOW. YOU MUST DO THIS ACCURATELY 100%
#                                       VERY IMPORTANT NOTE: ALL CONTENTS THAT IS OUTSIDE OF THOSE MARK TAG MENTIONED SHOULD BE RETAINED AND THEIR WORDS SHOULD NOT BE MODIFIED
#                                       VERY IMPORTANT NOTE: AGAIN IF YOU SEE <mark></mark> this is YELLOW YOU ONLY REMOVE THE TAG BUT RETAIN WHATS INSIDE THAT TAG
#                                       FOR EX: IF WE HAVE <mark>This should be retained</mark> IT WILL BECOME <p>This should be retained</p>
#                                       BUT IF YOU ENCOUNTER <mark style="background-color: lightcoral;"> This should be remove </mark> THEN IT WILL BE REMOVED COMPLETELY FROM <mark style="background-color: lightcoral;"> UNTIL ITS CLOSING PAIR </mark>
#                                       VERY IMPORTANT NOTE: AGAIN IF YOU SEE <mark style="background-color: lightcoral;"></mark> this is RED YOU WILL BE REMOVING THE CONTENT WRAPPED BY THAT MARK TAG"""

SUGGESTION_SYSTEM_CONTENT_PROPOSE = f"""VERY IMPORTANT NOTE: GIVEN THESE HTML MARKUP REMOVE ALL THE CONTENT WRAPPED BY <mark style="background-color: lightcoral;"> UNTIL YOU FIND ITS CLOSING TAG
                                      VERY IMPORTANT NOTE: ALSO IF YOU ENCOUNTER <mark></mark> WITH NO STYLE OF BACKGROUND COLOR LIGHTCORAL YOU MUST RETAIN IT AND REMOVE ITS TAG SO THAT
                                      THERE WILL BE NO HIGHLIGHT SINCE THESE mark YELLOW TAG SHOULD BE RETAINED AND THE mark with lightcoral or RED tag SHOULD BE REMOVED.
                                      VERY IMPORTANT NOTE: I WILL BE DISAPPOINTED IF YOU DID NOT FOLLOW. YOU MUST DO THIS ACCURATELY 100%
                                      VERY IMPORTANT NOTE: ALL CONTENTS THAT IS OUTSIDE OF THOSE MARK TAG MENTIONED SHOULD BE RETAINED AND THEIR WORDS SHOULD NOT BE MODIFIED
                                      VERY IMPORTANT NOTE: AGAIN IF YOU SEE <mark></mark> this is YELLOW YOU ONLY REMOVE THE TAG BUT RETAIN WHATS INSIDE THAT TAG
                                      FOR EX: IF WE HAVE <mark>This should be retained</mark> IT WILL BECOME <p>This should be retained</p>
                                      BUT IF YOU ENCOUNTER <mark style="background-color: lightcoral;"> This should be remove </mark> THEN IT WILL BE REMOVED COMPLETELY FROM <mark style="background-color: lightcoral;"> UNTIL ITS CLOSING PAIR </mark>
                                      VERY IMPORTANT NOTE: AGAIN IF YOU SEE <mark style="background-color: lightcoral;"></mark> this is RED YOU WILL BE REMOVING THE CONTENT WRAPPED BY THAT MARK TAG"""


 # content
def prompt_create_content_abs(faq_questions,lesson_content_text):


  input_text = f"""
            Here is the FAQ from students:
            ${faq_questions}

            IMPORTANT SIDE NOTE: MAKE SURE TO TAKE NOTE OF THE FORMATTING AND INFORMATION ERRORS THAT ARE POINTED OUT IN THE QUESTIONS PROVIDED. MAKE SURE THAT WHEN YOU ARE GENERATING THE SUGGESTED CONTENT THAT ALL FORMATTING AND INFORMATION ERRORS POINTED OUT BY THE QUESTIONS IS ALREADY ADRESSED AND SOLVED.

            Here are the original lesson contents:
            ${lesson_content_text}

            NOTE: RETURN ME HTML MARKUP: use <br> for breaking lines
            NOTE: USE <h1> UNTIL <h3> for TITLES NOT **
            VERY IMPORTANT INSTRUCTION/S: YOU WILL BE MODIFYING THE CONTENT BUT SPECIFICALLY ONLY MODIFY THOSE CONTENT THAT HAS FAQ FROM STUDENTS BY SEARCHING ITS KEYWORD:
            VERY IMPORTANT NOTE: YOU MUST WRAP YOUR MODIFIED CONTENT WITH <mark> </mark> TO MAKE SURE THAT IT IS THE CONTENT BEING CHANGED OR ADDED
            VERY IMPORTANT NOTE: YOU MUST WRAP THE ONES YOU WILL BE REMOVING (BUT NOT ACTUALLY REMOVE) WITH <mark style="background-color: lightcoral;"> OR WITH RED MARK SO THAT IT WILL TELL USERS THAT THIS
            SPECIFIC CONTENT WILL GET REMOVED JUST LIKE IN GITHUB. SO IN THIS RESPONSE I WILL EXPECT THAT IF PART OF MY CONTENT IS REMOVED IT WILL BE HIGHLIGHTED RED AND YELLOW FOR NEW CONTENT
            IF THERE IS A RED MARK THEN THERE MUST BE A YELLOW TO REPLACED WITH.
            VERY IMPORTANT NOTE: YOU WILL ONLY give <mark style="background-color: lightcoral;"> IF THESE ARE FROM THE ORIGINAL CONTENT BECAUSE IT WILL BE TOO DUMB IF YOU REMOVING SOMETHING IF THEY DIDNT EXIST IN ORIGINAL CONTENT
            PLEASE DO NOT SAY OR MENTION THAT HERE ARE FAQS OR FAQS SINCE YOU ARE THERE TO CHANGE/MODIFY/REMOVE THE CONTENT NOT ANSWERING EACH FAQS.    

            IT IS VERY IMPORTANT THAT YOU HAVE TO RETAIN THE CONTENT/PARAGRAPH OF OTHER TOPICS THAT ARE NOT BEING MENTIONED IN FAQ SINCE THOSE ARE CONTENTS THAT SUFFICE THE LEARNINGS OF STUDENTS
            I WANT YOU TO BE VERY CAREFUL WHICH PARAGRAPHS ARE YOU MODIFYING. IF YOU MODIFY THAT PARAGRAPH IN WHICH THAT WORD BELONGS IN FAQ, YOU CAN HIGHLIGHT SOME REAL-WORLD EXAMPLES.
            YOU HAVE TO EXPLAIN AND EXPOUND GIVE MANY EXAMPLES. EACH PARAGRAPH SHOULD HAVE ATLEAST 20 SENTENCES WITH REAL WORLD EXAMPLES. BE REALISTIC USE YOUR SOURCES. AS IF YOU ARE CREATING YOUR FIRST AND LAST CONTENT AS A TEACHER, BE PASSIONATE.
            PROVIDE BULLETS, LIST <li> <ul> GIVEN EXAMPLES ON THE TOPIC, BE CREATIVE IT IS A MUST YOU HAVE LIST OR BULLETS HIGHLY REQUIRED.
            PARAPHRASE EACH PARAGRAPH USE SCHOOL-APPROPRIATE WORDS.
            VERY IMPORTANT NOTE: IF THERE IS AN IMG OR IMAGE TAG OR IMAGE/YOUTUBE TAG AT THE FIRST PART OF CONTENT IN original lesson contents, ORIGINAL LESSON CONTENTS, YOU SHOULD STILL RETAIN IT AS IT IS CRUCIAL TO RETAIN PICTURES HERE.
            AND YOU MUST ADD A <br> below that IMG OR YOUTUBE TAG TO MAKE SURE IT HAS GOOD UI/UX
            VERY IMPORTANT NOTE: YOU MUST ALSO RETAIN YOUTUBE LINKS TAG IF IT WAS SPECIFIED

            ADDITIONAL NOTE: THIS IS VERY CRUCIAL SINCE WE ALWAYS WANT TO RETAIN WHAT IS ALREADY BEST CONTENT IN THAT PARAGRAPH.
            VERY IMPORTANT NOTE: YOU MUST WRAP YOUR MODIFIED CONTENT WITH <mark> </mark> TO MAKE SURE THAT IT IS THE CONTENT BEING CHANGED OR ADDED
            VERY IMPORTANT NOTE: YOU MUST WRAP THE ONES YOU WILL BE REMOVING WITH <mark style="background-color: lightcoral;"> OR WITH RED MARK SO THAT IT WILL TELL USERS THAT THIS
            SPECIFIC CONTENT WILL GET REMOVED JUST LIKE IN GITHUB. SO IN THIS RESPONSE I WILL EXPECT THAT IF PART OF MY CONTENT IS REMOVED IT WILL BE HIGHLIGHTED RED AND YELLOW FOR NEW CONTENT
            VERY VERY IMPORTANT NOTE: IF THERE IS A <!-- delimiter --> PLS DO NOT REMOVE IT ON THE ORIGINAL CONTENT, BUT IF YOU HAVE ANOTHER SUBTOPIC WANT THAT SPECIFIC TOPIC TO BE OF ANOTHER PAGES
            YOU CAN ADD <!-- delimiter --> (RECOMMENDED) ONLY IF IT MAKES SENSE WHICH MEANS YOU WILL ALSO REMEMBER WHERE WAS THE <!-- delimiter --> ASSIGNED AND MAKE SURE YOU WILL ADD THE <!-- delimiter --> ACCORDINGLY, AND MAKE SURE TO CHOP THOSE CONTENTS BY SUBTOPIC OR WHATEVER THE DELIMITER WAS BEFOR BUT DO NOT REMOVE YOU HAVE TO MAKE SURE THAT IN THE END OF THE CONTENT IS A CONCLUSION NOT ANOTHER TOPIC

            NOTE: IT IS EXPECTED THAT YOU HAVE SUMMARY/CONCLUSION AT THE END, SUMMARIZING THE TOPIC. VERY IMPORTANT IS YOU MUST CHECK YOUR RESPONSE AGAIN THAT
            IF YOU ALREADY HAVE SUMMARY/CONCLUSION, YOU ONLY NEED 1 FOR IT ON LESSON NOT ON EVERY PAGECONTENT.
            NOTE: IF THERE IS A YOUTUBE LINK VIDEO FROM ORIGINAL LESSON CONTENT YOU MUST RETAIN IT AND PUT 1 <br> below it  .

            I DONT WANT TO SEE ANY NEWLINES \n ON YOUR RESPONSE. I WILL BE DISAPPOINTED. DONT OVERUSE <br> FOR UI PLEASURITY.

            FOR <br> IF YOU ARE USING <h3> YOU CAN HAVE 2 <br> BELOW BUT I YOU ARE USING <h1> UNTIL <h2> USE ONLY 1 <br> BELOW ON IT.
            NOTE: DONT USE TOO MUCH <br> PLEASE. ONLY USE 1-2 <br> PER PARAGRAPH.

            MOST IMPORTANT NOTE OF ALL: PLEASE MAKE SURE THAT THE CONTENT IS NOT REDUNDANT AND MAKE SURE THAT YOU WILL FOLLOW THE STEPS IN MARKING YELLOW AS RETAIN CONTENT AND IT SHOULD BE ACCURATE
            AND <mark style="background-color: lightcoral;"> IS FOR TO REMOVE CONTENT SO BEFORE YOU RESPONSE, RECHECK YOUR RESPONSES AND MAKE SURE TO FOLLOW MY INSTRUCTIONS.

            """
  
  # input_text = f"""
  #           Here is the FAQ from students:
  #           ${faq_questions}

  #           Here are the original lesson contents:
  #           ${lesson_content_text}

  #           NOTE: RETURN ME HTML MARKUP: use <br> for breaking lines
  #           NOTE: USE <h1> UNTIL <h3> for TITLES NOT **
  #           VERY IMPORTANT INSTRUCTION/S: YOU WILL BE MODIFYING THE CONTENT BUT SPECIFICALLY ONLY MODIFY THOSE CONTENT THAT HAS FAQ FROM STUDENTS BY SEARCHING ITS KEYWORD,
  #           IT IS VERY IMPORTANT THAT YOU HAVE TO RETAIN THE CONTENT/PARAGRAPH OF OTHER TOPICS THAT ARE NOT BEING MENTIONED IN FAQ SINCE THOSE ARE CONTENTS THAT SUFFICE THE LEARNINGS OF STUDENTS
  #           I WANT YOU TO BE VERY CAREFUL WHICH PARAGRAPHS ARE YOU MODIFYING. IF YOU MODIFY THAT PARAGRAPH IN WHICH THAT WORD BELONGS IN FAQ, YOU CAN HIGHLIGHT SOME REAL-WORLD EXAMPLES.
  #           YOU HAVE TO EXPLAIN AND EXPOUND GIVE MANY EXAMPLES. EACH PARAGRAPH SHOULD HAVE ATLEAST 20 SENTENCES WITH REAL WORLD EXAMPLES. BE REALISTIC USE YOUR SOURCES. AS IF YOU ARE CREATING YOUR FIRST AND LAST CONTENT AS A TEACHER, BE PASSIONATE.
  #           PROVIDE BULLETS, LIST <li> <ul> GIVEN EXAMPLES ON THE TOPIC, BE CREATIVE IT IS A MUST YOU HAVE LIST OR BULLETS HIGHLY REQUIRED.
  #           PARAPHRASE EACH PARAGRAPH USE SCHOOL-APPROPRIATE WORDS.

  #           ADDITIONAL NOTE: THIS IS VERY CRUCIAL SINCE WE ALWAYS WANT TO RETAIN WHAT IS ALREADY BEST CONTENT IN THAT PARAGRAPH.
  #           VERY IMPORTANT NOTE: YOU MUST WRAP YOUR MODIFIED CONTENT WITH <mark> </mark> TO MAKE SURE THAT IT IS THE CONTENT BEING CHANGED OR ADDED
  #           VERY IMPORTANT NOTE: YOU MUST WRAP THE ONES YOU WILL BE REMOVING WITH <mark style="background-color: lightcoral;"> OR WITH RED MARK SO THAT IT WILL TELL USERS THAT THIS
  #           SPECIFIC CONTENT WILL GET REMOVED JUST LIKE IN GITHUB. SO IN THIS RESPONSE I WILL EXPECT THAT IF PART OF MY CONTENT IS REMOVED IT WILL BE HIGHLIGHTED RED AND YELLOW FOR NEW CONTENT

  #           IT IS EXPECTED THAT YOU HAVE SUMMARY AT THE END, SUMMARIZING THE TOPIC. IF THERE IS A YOUTUBE LINK VIDEO FROM ORIGINAL LESSON CONTENT YOU MUST RETAIN IT.

  #           I DONT WANT TO SEE ANY NEWLINES \n ON YOUR RESPONSE. I WILL BE DISAPPOINTED. DONT OVERUSE <br> FOR UI PLEASURITY.

  #           FOR <br> IF YOU ARE USING <h3> YOU CAN HAVE 2 <br> BELOW BUT I YOU ARE USING <h1> UNTIL <h2> USE ONLY 1 <br> BELOW ON IT.
  #           NOTE: DONT USE TOO MUCH <br> PLEASE. ONLY USE 1-2 <br> PER PARAGRAPH.

  #           """

  # input_text = f"""
  #           Here is the FAQ from students:
  #           ${faq_questions}

  #           Here are the original lesson contents:
  #           ${lesson_content_text}

  #           NOTE:
  #           RETURN ME HTML MARKUP: use <br> for breaking lines
  #           RETURN ME A REVISED AND RICH, ENHANCED CONTENT BASED ROM THE FAQ AND ORIGINAL LESSONS.
  #           USE <h1> UNTIL <h3> for TITLES NOT **
  #           YOU HAVE TO EXPLAIN AND EXPOUND GIVE MANY EXAMPLES. EACH PARAGRAPH SHOULD HAVE ATLEAST 20 SENTENCES WITH REAL WORLD EXAMPLES. BE REALISTIC USE YOUR SOURCES. AS IF YOU ARE CREATING YOUR FIRST AND LAST CONTENT AS A TEACHER, BE PASSIONATE.
  #           PROVIDE BULLETS, LIST <li> <ul> GIVEN EXAMPLES ON THE TOPIC, BE CREATIVE IT IS A MUST YOU HAVE LIST OR BULLETS HIGHLY REQUIRED.
  #           PARAPHRASE EACH PARAGRAPH USE SCHOOL-APPROPRIATE WORDS.


  #           IT IS EXPECTED THAT YOU HAVE SUMMARY AT THE END, SUMMARIZING THE TOPIC. IF THERE IS A YOUTUBE LINK VIDEO FROM ORIGINAL LESSON CONTENT YOU MUST RETAIN IT.

  #           I DONT WANT TO SEE ANY NEWLINES \n ON YOUR RESPONSE. I WILL BE DISAPPOINTED. DONT OVERUSE <br> FOR UI PLEASURITY.

  #           FOR <br> IF YOU ARE USING <h3> YOU CAN HAVE 2 <br> BELOW BUT I YOU ARE USING <h1> UNTIL <h2> USE ONLY 1 <br> BELOW ON IT.
  #           NOTE: DONT USE TOO MUCH <br> PLEASE. ONLY USE 1-2 <br> PER PARAGRAPH.

  #           """
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