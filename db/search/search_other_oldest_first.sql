SELECT  p.id AS post_id, title, content, img, profile_pic, date_created, upvotes, username AS author_username 
FROM helo_posts p
JOIN helo_users u on u.id = p.author_id
WHERE $1 != p.author
ORDER BY date_created DESC;