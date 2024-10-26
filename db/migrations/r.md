No changes in database schema were found - cannot generate a migration. To create a new empty migration use "typeorm migration:create" command
```markdown
```sql
-- Check MySQL version
SELECT VERSION() AS `version`;

-- Check columns in the 'migrations' table
SELECT * FROM `INFORMATION_SCHEMA`.`COLUMNS` 
WHERE `TABLE_SCHEMA` = 'dablog' 
AND `TABLE_NAME` = 'migrations';

-- Create 'migrations' table
CREATE TABLE `migrations` (
    `id` int NOT NULL AUTO_INCREMENT, 
    `timestamp` bigint NOT NULL, 
    `name` varchar(255) NOT NULL, 
    PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Select all records from 'migrations' table ordered by 'id' in descending order
SELECT * FROM `dablog`.`migrations` `migrations` 
ORDER BY `id` DESC;

-- Note: No migrations are pending
```

**Warning:** 
- `1729935887037-add_tokendate_to_user_table` [danger] (do not run)
```

Testalter work

alter token 