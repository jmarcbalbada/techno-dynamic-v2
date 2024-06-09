SELECT n.notif_id,
       nn.related_content_id,
       nn.lesson_id,
       nn.current_count,
       nn.starting_count
FROM api_noticenotifier nn
         LEFT JOIN api_notification n ON n.notif_id = nn.notification_id