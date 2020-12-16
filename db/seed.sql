CREATE TABLE helo_users (
id SERIAL PRIMARY KEY,
username VARCHAR(250) NOT null,
password VARCHAR(250) NOT null,
profile_pic TEXT
);

CREATE TABLE helo_posts (
id SERIAL PRIMARY KEY,
title VARCHAR(250) NOT null,
content TEXT,
img TEXT,
author_id INT REFERENCES helo_users(id),
date_created TIMESTAMP
);

