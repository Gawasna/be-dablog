CREATE USER 'kawasus'@'localhost' IDENTIFIED BY 'elfneverlie';

GRANT ALL PRIVILEGES ON dablog.* TO 'kawasus'@'localhost';

FLUSH PRIVILEGES;