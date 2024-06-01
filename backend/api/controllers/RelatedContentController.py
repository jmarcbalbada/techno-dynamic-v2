from rest_framework.viewsets import ModelViewSet
from api.model.RelatedContent import  RelatedContent
from api.serializer.RelatedContentSerializer import  RelatedContentSerializer
from api.model.Faq import Faq
from api.model.Lesson import Lesson
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rest_framework.response import Response

class RelatedContentController(ModelViewSet):
    queryset = RelatedContent.objects.all()
    serializer_class = RelatedContentSerializer

    def process_message_and_add_to_faq(self, request):
    # Retrieve all related content
        # related_contents = RelatedContent.objects.all()
        # temp post
        lesson_id = request.data.get('lesson_id')
        message = request.data.get('message')
        print("message = ", message)
        print("lesson_id = ", lesson_id)

        # {
        #     "message" : "hello",
        #     "lesson_id": ""
        # }
        related_contents = RelatedContent.objects.filter(lesson_id=lesson_id)

        # if there is not FAQ yet
        if not related_contents:

            # If there are no related content entries, create a new one directly
            lesson = Lesson.objects.get(id=lesson_id)
            new_related_content = RelatedContent.objects.create(
                lesson=lesson,
                general_context=message
            )
            Faq.objects.create(
                lesson=lesson,
                related_content=new_related_content,
                question=message
            )
            return f"New related content created and message added to FAQ under related content ID {new_related_content.related_content_id}"

        
        # Prepare the general contexts and the message for comparison
        contexts = [rc.general_context for rc in related_contents]
        contexts.append(message)

        # Vectorize the texts
        vectorizer = TfidfVectorizer().fit_transform(contexts)
        vectors = vectorizer.toarray()

        # Calculate cosine similarity between the message and each general context
        cosine_sim = cosine_similarity(vectors[-1], vectors[:-1])
        max_sim_index = cosine_sim.argmax()
        max_sim_value = cosine_sim.max()

        # Threshold for similarity
        default = 0.7
        SIMILARITY_THRESHOLD = default

        if max_sim_value >= SIMILARITY_THRESHOLD:
            matching_related_content = related_contents[max_sim_index]
            lesson = Lesson.objects.get(id=lesson_id)
            
            #TODO: need to create getters and setters instead of this
            # Add the message to FAQ
            faq = Faq.objects.create(
                lesson=lesson,
                related_content=matching_related_content,
                question=message
            )
            faq.save()
            return f"Message added to FAQ under related content ID {matching_related_content.related_content_id}"
        else:
            # If no similar content is found, create a new RelatedContent
            new_related_content = RelatedContent.objects.create(
                general_context=message
            )
            faq = Faq.objects.create(
                lesson=lesson,
                related_content=new_related_content,
                question=message
            )
            faq.save()
            return f"New related content created and message added to FAQ under related content ID {new_related_content.related_content_id}"

