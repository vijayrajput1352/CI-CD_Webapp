// Default Keypsace
CREATE KEYSPACE IF NOT EXISTS plantworks WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// Tenant Keyspaces

CREATE KEYSPACE IF NOT EXISTS wms WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;
CREATE KEYSPACE IF NOT EXISTS replay_wms WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// =============================================================================================================================================
// Machines


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 3
// id: 846b64de-a58d-4ac9-a70a-3ef1b1baef67

CREATE TABLE IF NOT EXISTS wms.machine_846b64de_a58d_4ac9_a70a_3ef1b1baef67 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_846b64de_a58d_4ac9_a70a_3ef1b1baef67(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 5
// id: 1da5eae6-6e78-4534-88e7-b0e92206d670

CREATE TABLE IF NOT EXISTS wms.machine_1da5eae6_6e78_4534_88e7_b0e92206d670 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_1da5eae6_6e78_4534_88e7_b0e92206d670(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 1
// id: b8c2d6f5-d657-4ddf-96e3-95d05b1fced1

CREATE TABLE IF NOT EXISTS wms.machine_b8c2d6f5_d657_4ddf_96e3_95d05b1fced1 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_b8c2d6f5_d657_4ddf_96e3_95d05b1fced1(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 2
// id: c5eb4d6a-dcb3-4b0d-a402-34e49044b71f

CREATE TABLE IF NOT EXISTS wms.machine_c5eb4d6a_dcb3_4b0d_a402_34e49044b71f (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_c5eb4d6a_dcb3_4b0d_a402_34e49044b71f(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 4
// id: fcc9a77f-c106-4d91-b2be-d0d3d33ab861

CREATE TABLE IF NOT EXISTS wms.machine_fcc9a77f_c106_4d91_b2be_d0d3d33ab861 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_fcc9a77f_c106_4d91_b2be_d0d3d33ab861(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 6
// id: d659c9ec-d2e3-4bea-8a77-8f77303f55ab

CREATE TABLE IF NOT EXISTS wms.machine_d659c9ec_d2e3_4bea_8a77_8f77303f55ab (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_d659c9ec_d2e3_4bea_8a77_8f77303f55ab(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 7
// id: 10640266-ae8a-4f04-b1cf-11003a1319c3

CREATE TABLE IF NOT EXISTS wms.machine_10640266_ae8a_4f04_b1cf_11003a1319c3 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_10640266_ae8a_4f04_b1cf_11003a1319c3(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 8
// id: 6239c6ce-6a8c-4d7c-bbf5-3bc2132b8a90

CREATE TABLE IF NOT EXISTS wms.machine_6239c6ce_6a8c_4d7c_bbf5_3bc2132b8a90 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_6239c6ce_6a8c_4d7c_bbf5_3bc2132b8a90(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 9
// id: 482aa31a-2fab-4da2-95d1-98d23262227e

CREATE TABLE IF NOT EXISTS wms.machine_482aa31a_2fab_4da2_95d1_98d23262227e (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_482aa31a_2fab_4da2_95d1_98d23262227e(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 10
// id: b9734a83-8ee7-4573-872f-7400227abf35

CREATE TABLE IF NOT EXISTS wms.machine_b9734a83_8ee7_4573_872f_7400227abf35 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.machine_b9734a83_8ee7_4573_872f_7400227abf35(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// =============================================================================================================================================
// Lines


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher Line
// id: 99c51e7e-e73a-44ed-9dda-047661e05c2d

CREATE TABLE IF NOT EXISTS wms.line_99c51e7e_e73a_44ed_9dda_047661e05c2d (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.line_99c51e7e_e73a_44ed_9dda_047661e05c2d(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// =============================================================================================================================================
// Panels 


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : EGA% Real Time Dashboard
// id: 4f6d6113-fc45-49b7-ad29-11e27e8bffc8

CREATE TABLE IF NOT EXISTS wms.panel_4f6d6113_fc45_49b7_ad29_11e27e8bffc8 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.panel_4f6d6113_fc45_49b7_ad29_11e27e8bffc8(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Shopfloor Dashboard
// id: 07eb9972-099d-402f-a4ff-7fdcdf6d9a46

CREATE TABLE IF NOT EXISTS wms.panel_07eb9972_099d_402f_a4ff_7fdcdf6d9a46 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.panel_07eb9972_099d_402f_a4ff_7fdcdf6d9a46(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// =============================================================================================================================================
// Historical Dashboards 


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Flavour Comparison EGA Dashboard
// id: d09581e5-e5c8-4f28-9e6b-6e0cf4690653

CREATE TABLE IF NOT EXISTS wms.hdash_d09581e5_e5c8_4f28_9e6b_6e0cf4690653 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.hdash_d09581e5_e5c8_4f28_9e6b_6e0cf4690653(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Machine Comparison Dashboard
// id: 198543ca-94af-45ee-bd78-288e0c7c03e8

CREATE TABLE IF NOT EXISTS wms.hdash_198543ca_94af_45ee_bd78_288e0c7c03e8 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.hdash_198543ca_94af_45ee_bd78_288e0c7c03e8(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Production Dashboard
// id: 111b42bf-6b8c-45d2-91fb-aac619d90e66

CREATE TABLE IF NOT EXISTS wms.hdash_111b42bf_6b8c_45d2_91fb_aac619d90e66 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.hdash_111b42bf_6b8c_45d2_91fb_aac619d90e66(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : EGA Dashboard
// id: cb5e35c8-9c9e-4444-aad4-aec6a97f1183

CREATE TABLE IF NOT EXISTS wms.hdash_cb5e35c8_9c9e_4444_aad4_aec6a97f1183 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.hdash_cb5e35c8_9c9e_4444_aad4_aec6a97f1183(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// =============================================================================================================================================
// Reports 


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Hourly Shift Report
// id: f267498f-0698-49c2-852c-847879a3ee90

CREATE TABLE IF NOT EXISTS wms.report_f267498f_0698_49c2_852c_847879a3ee90 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.report_f267498f_0698_49c2_852c_847879a3ee90(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Daily Report
// id: 205072f6-8df1-4f54-9f8b-b7697bdd4d76

CREATE TABLE IF NOT EXISTS wms.report_205072f6_8df1_4f54_9f8b_b7697bdd4d76 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.report_205072f6_8df1_4f54_9f8b_b7697bdd4d76(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Monthly Report
// id: 22efbcb0-6cbf-4a9c-a574-b5e0ec69e9ed

CREATE TABLE IF NOT EXISTS wms.report_22efbcb0_6cbf_4a9c_a574_b5e0ec69e9ed (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.report_22efbcb0_6cbf_4a9c_a574_b5e0ec69e9ed(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Process Parameter Report
// id: b31ee3c2-5b4c-4277-bfc5-8d7632fa0a34

CREATE TABLE IF NOT EXISTS wms.report_b31ee3c2_5b4c_4277_bfc5_8d7632fa0a34 (
	internal_tag text,
	generated_at timestamp,
	collected_at timestamp,
	data_type text,
	metadata text,
	recorded_at timestamp,
	value text,
	PRIMARY KEY(internal_tag, generated_at)
)
WITH CLUSTERING ORDER BY(generated_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

CREATE TABLE IF NOT EXISTS replay_wms.report_b31ee3c2_5b4c_4277_bfc5_8d7632fa0a34(
	generated_at timestamp,
	raw_input_data text,
	input_data text,
	PRIMARY KEY(generated_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// =============================================================================================================================================
// Emd 


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Preset Uploader
// id: 3da617ac-5644-4ce5-972a-b6be06bb144b

CREATE TABLE IF NOT EXISTS wms.emd_3da617ac_5644_4ce5_972a_b6be06bb144b(
	masterdata_id TEXT,
	internal_tag TEXT,
	data_type TEXT,
	value TEXT,
	active BOOLEAN,
	metadata TEXT,
	inserted_at TIMESTAMP,
	PRIMARY KEY (masterdata_id, inserted_at, internal_tag)
)
WITH CLUSTERING ORDER BY(inserted_at ASC)
AND bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';


// =============================================================================================================================================
// Operator Forms 


// =============================================================================================================================================
// work Orders 

// Status Table

CREATE TABLE IF NOT EXISTS wms.work_order_status(
	work_order_id TEXT,
	work_order_format_id uuid,
	tenant_plant_unit_line_id uuid,
	tenant_plant_unit_station_id uuid,
	start_status TEXT,
	end_status TEXT,
	created_at timestamp,
	updated_at timestamp,
	metadata TEXT,
	PRIMARY KEY (work_order_id, created_at)
)
WITH bloom_filter_fp_chance = 0.01
AND caching = { 'keys': 'ALL', 'rows_per_partition': 'NONE' }
AND comment = ''
AND compaction = { 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4' }
AND compression = { 'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor' }
AND crc_check_chance = 1.0
AND default_time_to_live = 0
AND gc_grace_seconds = 864000
AND max_index_interval = 2048
AND memtable_flush_period_in_ms = 0
AND min_index_interval = 128
AND read_repair_chance = 0.0
AND speculative_retry = '99PERCENTILE';

// Format Tables


