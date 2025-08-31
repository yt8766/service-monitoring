drop table if exists sentinel_monitor;

create table sentinel_monitor
(
    app_id String, --应用id
    event_type String, --事件类型
    message String, -- 消息内容
    info JSON,
    create_at DATETIME('Asia/Shanghai') DEFAULT now('Asia/Shanghai') -- 时间戳
)
  engine = MergeTree()
  ORDER BY tuple();

insert into sentinel_monitor(app_id, event_type, filename,functionName,lineno,colno,message,stack,path)
values ('1', 'event1', 'filename1','functionName1','lineno1','colno1','message1','stack1','path1'),
        ('2', 'event2', 'filename2','functionName2','lineno2','colno2','message1','stack1','path1'),
        ('3', 'event3', 'filename3','functionName3','lineno3','colno3','message1','stack1','path1'),
        ('4', 'event4', 'filename4','functionName4','lineno4','colno4','message1','stack1','path1');

DROP TABLE IF EXISTS sentinel_monitor_view;

create MATERIALIZED VIEW sentinel_monitor_view
    ENGINE  = MergeTree()
    ORDER BY tuple()
    POPULATE
AS
SELECT *,concat('monitor--',event_type) AS processed_message,now('Asia/Shanghai') AS view_create_at FROM sentinel_monitor


