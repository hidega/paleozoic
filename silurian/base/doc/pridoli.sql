/*

LogRecord : JSON

PropertyRecord : JSON

Property {}

PropertiesResult {
  result: false | null | [Property] | String,
  error: false | null | String 
}

UpsertPolicy {
  UPDATE_OR_CREATE,
  UPDATE_OR_SKIP_IF_EXISTS,
  UPDATE_OR_ERROR_IF_EXISTS,
  CREATE_OR_SKIP_IF_EXISTS,
  CREATE_OR_ERROR_IF_EXISTS
}

IndividualUpsert {
  keyRegexp: String,
  stringValue: String,
  base64Value: String,
  upsertPolicy: UpsertPolicy,
  readonly: bool
}

PropertiesUpsert {
  upserts: [ IndividualUpsert ],
  upsertPolicy: UpsertPolicy
}

LogsQuery {
  maxResults: int,
  timestampFrom: int,
  timestampTo: int,
  owners: [String],
  hasAnyTag: [String],
  hasAllTags: [String]
}

LogResult {
  logs: true | false | null,
  error: false | null | String 
}

DeletePropertiesResult { 
  deletedCount: int,
  error: false | null | String 
}

UpsertPropertiesResult {
  createdCount: int,
  updateCount: int, 
  error: false | null | String 
}

CheckLock {
  name: String,
  ownerId: String
}

CheckLockResult {
  result: false | true | null,
  error: false | null | String 
}

AcquireLock {
  name: String,
  lifetimeMs: int,
  ownerId: String
}

AcquireLockResult {
  alreadyHas: true | false | null,
  success: true | false | null,
  error: false | null | String 
}

ReleaseLock {
  name: String,
  ownerId: String
}

ReleaseLockResult {
  timeOut: true | false | null,
  success: true | false | null,
  error: false | null | String 
}

ProlongLock {
  name: String,
  ownerId: String
}

ProlongLockResult {
  timeOut: true | false | null,
  success: true | false | null,
  error: false | null | String 
}

PridoliServices {
  LogResult log(LogEntry | [LogEntry]),
  [LogRecord] findLogs(LogsQuery),
  [PropertyRecord] findPropertiesByRegexp(String),
  [PropertyRecord] findPropertyByKeys([String]),
  UpsertPropertiesResult upsertProperties([PropertiesUpsert]),
  DeletePropertiesResult deletePropertiesByRegexp(String),
  DeletePropertiesResult deletePropertiesByKeys([String]),
  AcquireLockResult acquireLock(AcquireLock),
  CheckLockResult checkLock(CheckLock),
  ReleaseLockResult releaseLock(ReleaseLock),
  ProlongLockResult prolongLock(ProlongLock)
}

*/ 

use cmdbtest;

set @pridoli_kvps_size_entry_key = 'kvps_db_size';
set @pridoli_kvps_upsert_policy_update_or_create = 'UPDATE_OR_CREATE';
set @pridoli_kvps_upsert_policy_update_or_skip_if_exists = 'update_or_skip_if_exists';
set @pridoli_kvps_upsert_policy_update_or_error_if_exists = 'update_or_error_if_exists';
set @pridoli_kvps_upsert_policy_create_or_skip_if_exists = 'create_or_skip_if_exists';
set @pridoli_kvps_upsert_policy_create_or_error_if_exists = 'create_or_error_if_exists';
set @pridoli_kvps_default_upsert_policy = @pridoli_kvps_upsert_policy_update_or_create;
set @pridoli_kvps_max_dbsize_bytes = 1000000;

set @pridoli_log_max_entry_length = 20000;
set @pridoli_log_truncate_test_freq = 11;
set @pridoli_log_data_high_watermark_bytes = 400;
set @pridoli_log_owner_max_length = 127;
set @pridoli_log_tags_max_length = 511;
set @pridoli_log_category_info = 'INFO';
set @pridoli_log_category_error = 'ERROR';

set @pridoli_maintenance_freq_hours = 1;

set @pridoli_token_regexp = '^[a-zA-Z][a-zA-Z0-9_\.]*$';
set @pridoli_result_success = '{ "success": "true" }';
set @pridoli_sysadmin_id = 'Pridoli_Admin';
set @pridoli_default_charset = 'utf8';

set autocommit = 0;

start transaction;

drop table if exists pridoli_logs;
drop table if exists pridoli_debug;
drop table if exists pridoli_kvps;

create table pridoli_debug ( 
  debug_msg varchar(20000),
  log_timestamp datetime default current_timestamp not null,
  id int unsigned not null auto_increment,
  primary key (id)
) engine=innodb default charset=utf8;

create table pridoli_kvps ( 
  kvps_value_binary blob,
  kvps_value_utf8 longtext character set utf8,
  kvps_key varchar(3000) character set 'latin1' not null,
  readonly bool not null,
  constraint pridoli_cst_key_name check(kvps_key rlike '^[a-zA-Z][a-zA-Z0-9_\.]*$'),
  primary key (kvps_key)
) engine=innodb; 

insert into pridoli_kvps (kvps_key, kvps_value_utf8, readonly) values (@pridoli_kvps_size_entry_key, '0', true);

create table pridoli_logs (
  id bigint unsigned not null auto_increment,
  log_timestamp datetime default current_timestamp not null,
  tags varchar(2047),
  owner varchar(1023) not null,
  log_data longtext not null,
  data_length int default 100 not null,
  constraint pridoli_cst_owner_name check(owner rlike '^[a-zA-Z][a-zA-Z0-9_\.]*$'),
  constraint pridoli_cst_tags check(tags is null or tags rlike '^[a-zA-Z][\"\,a-zA-Z0-9_ ]*$'),  -- DOTO
  primary key (id)
) engine=innodb default charset=utf8;

-- create index idx_logs_timestamp on pridoli_logs (log_timestamp);  -- DOTO

insert into pridoli_logs (owner, log_data, tags) values (@pridoli_sysadmin_id, 'Initialization has started', @pridoli_log_category_info);

drop function if exists pridoli_create_error_json;
drop function if exists pridoli_clean_token_array;
drop function if exists pridoli_token_array_to_str_set;
drop function if exists pridoli_check_token;
drop function if exists pridoli_str_length;
drop function if exists pridoli_json_array_extract_nth;
drop function if exists pridoli_get_errors;  
drop procedure if exists pridoli_execute_statement; 
drop procedure if exists pridoli_reset_user; 

drop procedure if exists pridoli_truncate_logs;
drop procedure if exists pridoli_log_entries; 
drop procedure if exists pridoli_check_truncate_logs;
drop procedure if exists pridoli_store_log_entries;  
drop procedure if exists pridoli_find_logs;   
drop procedure if exists pridoli_admin_log;
drop function if exists pridoli_find_logs_result; 
drop function if exists pridoli_find_logs_timestamp_clause; 
drop function if exists pridoli_find_logs_limit_clause;
drop function if exists pridoli_find_logs_owner_clause; 
drop function if exists pridoli_find_logs_tags_clause;  
drop function if exists pridoli_find_logs_where_clause;

drop procedure if exists pridoli_do_maintenance;
drop procedure if exists pridoli_debug_msg;

delimiter $$

create procedure pridoli_debug_msg(msg varchar(255))
  begin 
    insert into pridoli_debug (debug_msg) values (msg); 
  end $$ 

create function pridoli_create_error_json(error_msg varchar(1023)) returns varchar(1023)
  no sql deterministic
  begin 
    return concat('{ "error": "', replace(substring(error_msg, 1, 950), '"', '\''), '"}');
  end$$  
  
create function pridoli_get_errors() returns varchar(1023)
  begin 
    get diagnostics condition 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
    return concat('error ', @errno, ' (', @sqlstate, '): ', @text);
  end$$
  
create function pridoli_str_length(str varchar(22000)) returns int
  no sql deterministic
  begin
    return length(ifnull(str, ''));
  end$$ 
  
create function pridoli_json_array_extract_nth(json_array json, n int) returns json
  no sql deterministic
  begin
    return json_extract(json_array, concat('$[', n - 1, ']'));
  end$$ 
  
create function pridoli_check_token(token varchar(20000)) returns bool  
  no sql deterministic
  begin
    declare valid bool default false;
  
    if token is not null and token rlike @pridoli_token_regexp and token not rlike '([^.]*\\.\\.)' and token not like '%\\.' then
      set valid = true;
    end if;
  
    return valid;
  end$$  
  
create function pridoli_clean_token_array(tokens json) returns json
  no sql deterministic
  begin
    declare retval json default '[]';
    declare elem varchar(20000); 
  
    if tokens is not null and json_type(tokens) like 'ARRAY' then
      set tokens = replace(tokens, ' ', '');
      set retval = json_array();
      for i in 1..json_length(tokens) do 
        -- set elem = cast(json_unquote(json_extract(tokens, concat('$[', i - 1, ']'))) as char);
        set elem = cast(json_unquote(pridoli_json_array_extract_nth(tokens, i)) as char);
        if pridoli_check_token(elem) = true then
          set retval = json_array_insert(retval, '$[0]', elem);
        end if;
      end for;
    end if;
  
    return retval;
  end$$ 
  
create function pridoli_token_array_to_str_set(tokens json) returns varchar(22000)
  no sql deterministic
  begin
    declare str_set varchar(22000) default '';
    declare len int default json_length(tokens); 
    declare elem json;
  
    for i in 1..len do 
      -- set elem = json_extract(tokens, concat('$[', i - 1, ']'));
      set elem = pridoli_json_array_extract_nth(tokens, i);
      set str_set = concat(str_set, json_unquote(elem));
      if i <> len then
        set str_set = concat(str_set, ',');
      end if;
    end for; 
    return str_set;
  end$$ 
  
create procedure pridoli_truncate_logs(diff_original int) 
  modifies sql data 
  begin
    declare data_length_val int; 
    declare diff int default diff_original; 
    declare last_id_val bigint;
    declare last_id bigint default null;
    declare logs_cursor cursor for select data_length, id from pridoli_logs order by log_timestamp asc; 
  
    open logs_cursor;
  
    read_loop: 
    loop
      if diff < 0 then
        leave read_loop;
      end if;
      fetch logs_cursor into data_length_val, last_id_val; 
      set diff = diff - data_length_val; 
      set last_id = last_id_val;
    end loop;
  
    close logs_cursor; 
   
    if last_id is not null then
      delete from pridoli_logs where id < last_id;
      call pridoli_admin_log(concat('Approx. ', diff_original, ' bytes of ', row_count(), ' log entries were deleted'), @pridoli_log_category_info);
    end if;
  end$$ 

create procedure pridoli_check_truncate_logs() 
  modifies sql data 
  begin
    declare diff int;
    declare log_data_size int;
    
    select sum(data_length) from pridoli_logs into log_data_size; 
  
    set diff = log_data_size - @pridoli_log_data_high_watermark_bytes; 
  
    if diff > 0 then 
      call pridoli_truncate_logs(diff);
    end if;
  end$$ 
    
create procedure pridoli_store_log_entries(entries_json longtext, out check_truncate bool)
  modifies sql data 
  begin
    declare entry json;
    declare owner varchar(1023);
    declare log_data varchar(20000);
    declare tags varchar(511);
    declare data_length int;
      
    set check_truncate = false;
    
    for i in 1..json_length(entries_json) do
      -- set entry = json_extract(entries_json, concat('$[', i - 1, ']'));
      set entry = pridoli_json_array_extract_nth(entries_json, i);
      set owner = json_unquote(json_extract(entry, '$.owner'));
      set log_data = substring(json_unquote(json_extract(entry, '$.logData')), 1, @pridoli_log_max_entry_length);
      set tags = substring(json_extract(entry, '$.tags'), 1, @pridoli_log_tags_max_length);
    
      if tags is not null then
        set tags = pridoli_token_array_to_str_set(pridoli_clean_token_array(tags)); 
      end if;
    
      set data_length = 24 + pridoli_str_length(log_data) + pridoli_str_length(owner) + pridoli_str_length(tags);
    
      insert into pridoli_logs (owner, tags, log_data, data_length) values (owner, tags, log_data, data_length);
    
      if check_truncate = false and last_insert_id() % @pridoli_log_truncate_test_freq = 0 then
        set check_truncate = true;
      end if; 
    end for; 
  end$$ 
  
create procedure pridoli_log_entries(entries_json longtext, out result_msg varchar(1023))
  modifies sql data 
  begin 
    declare check_truncate bool;
  
    declare exit handler for sqlexception
      begin
        rollback;
        set result_msg = pridoli_create_error_json(pridoli_get_errors());
      end;
    
    start transaction; 

    call pridoli_store_log_entries(entries_json, check_truncate); 
  
    if check_truncate then
      call pridoli_check_truncate_logs();
    end if;  
  
    commit;
  
    set result_msg = @pridoli_result_success;
  end$$
  
create function pridoli_find_logs_result(log_id bigint, log_timestamp datetime, tags json, owner varchar(1023), log_data longtext) returns varchar(22000)
  no sql deterministic
  begin
    declare tags_str varchar(1023) default '';
    declare log_data_str varchar(20000) default concat('"data":"', replace(log_data, '"', '\"'), '",');
  
    if tags is not null then
      set tags_str = concat('"tags":', tags, ',');
    end if;
  
    return concat('{"id":', log_id, ',"owner":"', owner, '",', tags_str, log_data_str, '"timestamp":"', log_timestamp, '"}'); 
  end$$
  
create function pridoli_find_logs_timestamp_clause(query_json longtext) returns varchar(255) 
  no sql deterministic
  begin
    declare timestamp_from datetime default cast(json_unquote(json_extract(query_json, '$.timestampFrom')) as datetime);
    declare timestamp_to datetime default cast(json_unquote(json_extract(query_json, '$.timestampTo')) as datetime);
    declare timestamp_clause varchar(255) default null;
  
    if timestamp_from is not null and @timestamp_from is not null then
      set timestamp_clause = concat('(log_timestamp between \'', timestamp_from, '\' and \'', timestamp_to, '\')');
    elseif timestamp_from is not null then  
      set timestamp_clause = concat('(log_timestamp > \'', timestamp_from, '\')');
    elseif timestamp_to is not null then  
      set timestamp_clause = concat('(log_timestamp < \'', timestamp_to, '\')');
    end if;
  
    return timestamp_clause;
  end$$
  
create function pridoli_find_logs_limit_clause(query_json longtext) returns varchar(255) 
  no sql deterministic
  begin
    declare limit_clause varchar(255) default '';
    declare max_results int default cast(json_unquote(json_extract(query_json, '$.maxResults')) as int);
  
    if max_results is not null then
      set limit_clause = concat(' limit ', max_results);
    end if;
  
    return limit_clause;
  end$$  
  
create function pridoli_find_logs_owner_clause(query_json longtext) returns varchar(511) 
  no sql deterministic
  begin
    declare owner_clause varchar(511) default null;
    declare owners json default json_extract(query_json, '$.owners'); 
  
    if owners is not null and length(owners) < 400 then 
      set owner_clause = concat('(find_in_set(lower(owner), lower(\'', pridoli_token_array_to_str_set(pridoli_clean_token_array(owners)), '\')) <> 0)');
    end if;
  
    return owner_clause;
  end$$
  
create function pridoli_find_logs_tags_clause(query_json longtext) returns varchar(511) 
  no sql deterministic
  begin
    declare tags_clause varchar(511) default null; 
    declare has_all_tags varchar(511) default json_extract(query_json, '$.hasAllTags'); 
    declare has_any_tag varchar(511) default json_extract(query_json, '$.hasAnyTag'); 
  
    if has_all_tags is not null and length(has_all_tags) < 400 then 
      set tags_clause = null;
    elseif has_any_tag is not null and length(has_any_tag) < 400 then 
      set tags_clause = null;
    end if;
  
    return tags_clause;
  end$$
  
create function pridoli_find_logs_where_clause(query_json longtext) returns varchar(4095)
  no sql deterministic
  begin
    declare timestamp_clause varchar(255);
    declare owner_clause varchar(511);
    declare tags_clause varchar(511);
    declare where_clause varchar(4095) default '';
  
    if query_json is null then
      set query_json = '{}';
    end if;
  
    set timestamp_clause = pridoli_find_logs_timestamp_clause(query_json);
    set owner_clause = pridoli_find_logs_owner_clause(query_json); 
    set tags_clause = pridoli_find_logs_tags_clause(query_json); 
  
    if not (timestamp_clause is null and owner_clause is null and tags_clause is null) then
      set where_clause = concat('where ', concat_ws(' and ', timestamp_clause, owner_clause, tags_clause));
    end if;
  
    return where_clause;
  end$$
  
create procedure pridoli_find_logs(query_json longtext)
  reads sql data 
  begin
    declare stmt_str varchar(4095) default 'select pridoli_find_logs_result(id, log_timestamp, tags, owner, log_data) as log_entries_json from pridoli_logs ';
    declare order_clause varchar(63) default ' order by log_timestamp desc ';
  
    declare exit handler for sqlexception
      begin
        rollback;
        select pridoli_create_error_json(pridoli_get_errors());
      end;  
  
    set stmt_str = concat(stmt_str, pridoli_find_logs_where_clause(query_json), order_clause, pridoli_find_logs_limit_clause(query_json));
  
    prepare find_logs_stmt from stmt_str; 
    execute find_logs_stmt;
    deallocate prepare find_logs_stmt;

    select stmt_str;
  end$$
  
create procedure pridoli_admin_log(msg varchar(512), category varchar(63))  
  modifies sql data 
  begin 
    insert into pridoli_logs (owner, log_data, tags) values (@pridoli_sysadmin_id, msg, category);
  end$$  
  
create procedure pridoli_do_maintenance()  
  modifies sql data 
  begin 
    declare exit handler for sqlexception
      begin
        rollback;
        select pridoli_admin_log('Maintenance error.', @pridoli_log_category_error);
      end; 
    
    start transaction;
    call pridoli_check_truncate_logs();
    commit;
  
    call pridoli_admin_log('Hourly maintenance is done.', @pridoli_log_category_info);
    commit;
  end$$

create procedure pridoli_execute_statement(stmt_str varchar(1023))
  modifies sql data 
  begin 
    prepare m_stmt from stmt_str; 
    execute m_stmt;
    deallocate prepare m_stmt;
  end $$ 
  
create procedure pridoli_reset_user(user_name varchar(31), password varchar(31), db_name varchar(31))
  modifies sql data 
  begin 
    declare host_name varchar(31) default 'localhost';
    declare found_user varchar(31) default null;
    declare error_msg varchar(255) default concat_ws(', ', 'Invalid username / password / database name :', user_name, password, db_name);
    declare full_user_name varchar(63);
  
    if user_name is null or user_name not rlike '[a-z]{8,16}[0-9]*' or password is null or password not rlike '[0-9a-zA-Z]{8,16}' or db_name is null or db_name not rlike '[a-z]{8,16}' then
      signal sqlstate '45000' set message_text = error_msg;
    end if;
  
    set full_user_name = concat('\'', user_name, '\'@\'', host_name, '\'');
    
    select user from mysql.user where host like host_name and user like user_name into found_user; 
  
    if found_user is not null then
      call pridoli_execute_statement(concat('revoke all privileges, grant option from ', full_user_name)); 
      call pridoli_execute_statement(concat('drop user ', full_user_name));
    end if;
  
    call pridoli_execute_statement(concat('create user ', full_user_name, ' identified by \'', password, '\''));
    call pridoli_execute_statement(concat('grant all privileges on ', db_name, '.* to ', full_user_name));
    flush privileges; 
  end $$

delimiter ;

call pridoli_reset_user('pridoliuser', 'kjhkjhkjhkhj', 'cmdbtest'); 

drop event if exists pridoli_maintenance;

create event pridoli_maintenance on schedule every @pridoli_maintenance_freq_hours hour do call pridoli_do_maintenance();

call pridoli_admin_log('Initialization completed successfully', @pridoli_log_category_info);

commit;

--  call pridoli_log_entries('[{ "owner": "owner_1", "logData": "log data 1" }, { "owner": "owner_2", "tags": ["T1", "T2", {"a":1}], "logData": "log data 2" }]', @val);
--  call pridoli_log_entries('[{ "owner": "owner_1", "logData": "log data 3" }, { "owner": "owner_2", "tags": ["T2"], "logData": "log data 4" }]', @val);
--  call pridoli_log_entries('[{ "owner": "owner_3", "logData": "log data 5" }, { "owner": "owner_2", "logData": "log data 6" }]', @val);
--  call pridoli_log_entries('[{ "owner": "owner_3", "logData": "log data 7" }, { "owner": "owner_2", "tags": ["T1"], "logData": "log data 8" }]', @val);
--  call pridoli_log_entries('[{ "owner": "owner_1a", "logData": "log data 9a" }, { "owner": "owner_2a", "tags": ["T1a", "T3a"], "logData": "log data 10a" }]', @val);
--  call pridoli_log_entries('[{ "owner": "owner_1", "logData": "log data 9" }]', @val);
--  call pridoli_log_entries('[{ "owner": "owner_4", "logData": "log data 100" }, { "owner": "owner_5", "tags": ["T1", "T9"], "logData": "log data 101" }]', @val);
--  select @val;

 -- commit;

-- select length();
 
--  select '.lkjh.l' like '%\\.';

-- select id from pridoli_logs order by id asc;

-- select pridoli_find_logs_result(id, log_timestamp, tags, owner, log_data) from pridoli_logs where (log_timestamp > '1999-11-22 12:45:55') and (find_in_set(owner, 'Pista,Joska') <> 0) order by log_timestamp desc ;

-- call pridoli_find_logs('{ "owners": ["pridoli_admin","owner_1"], "timestampFrom": "2021-05-12 12:45:55" }') ;

-- select pridoli_clean_token_array('["g.1","g2","g",8]'); 

--  select json_valid(concat('{"a":"', replace('fad"sf dasfad das f', '"', '\\"'), '"}'));

call pridoli_reset_user('pridoliuser', 'kjhkjhkjhkhj', 'mnhzjmjj');