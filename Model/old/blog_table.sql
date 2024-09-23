CREATE TABLE `contact_form`.`blogs` 
(
    `blog_title` VARCHAR(50) NOT NULL , 
    `blog_body` VARCHAR(255) NOT NULL , 
    `blog_image` VARCHAR(60) NOT NULL , 
    `blog_author` VARCHAR(50) NOT NULL , 
    `blog_date` TIMESTAMP NOT NULL 
) ENGINE = InnoDB; 



CREATE TABLE `contact_form`.`users` (`name` VARCHAR(50) NOT NULL , `email` VARCHAR(50) NOT NULL , `encrypted_password` VARCHAR(150) NOT NULL , `password` VARCHAR(100) NOT NULL , `created_at` TIMESTAMP NOT NULL ) ENGINE = InnoDB; 