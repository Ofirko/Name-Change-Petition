DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_profiles;

CREATE TABLE signatures (
    id SERIAL primary key,
    sigraphic TEXT NOT NULL,
    timestamp VARCHAR(100),
    user_id int UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL primary key,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    timestamp VARCHAR(100)
);

CREATE TABLE user_profiles (
    id SERIAL primary key,
    age INT,
    city VARCHAR(100),
    url VARCHAR(100),
    user_id INT NOT NULL
);
