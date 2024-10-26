## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
## Progress Report

### Ngày 1
- Thiết lập xong cơ sở dữ liệu (DB) và các thực thể (entities).
- Chạy mã tạo người dùng:
  ```sql
  GRANT ALL PRIVILEGES ON dablog.* TO 'kawasus'@'localhost';
  FLUSH PRIVILEGES;
  ```

  ![DB 1](test/Screenshot%202024-10-26%20170800.jpg)
  ![DB 1 alterd](test/Screenshot%202024-10-26%20171328.jpg)
  **Warning:** 
- `1729935887037-add_tokendate_to_user_table` [delete] (do not run)

Testalter work
alter token done
  