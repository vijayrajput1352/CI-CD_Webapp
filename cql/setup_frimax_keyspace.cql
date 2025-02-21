// Default Keypsace
CREATE KEYSPACE IF NOT EXISTS plantworks WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// Tenant Keyspaces

CREATE KEYSPACE IF NOT EXISTS frimax WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;
CREATE KEYSPACE IF NOT EXISTS replay_frimax WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// =============================================================================================================================================
// Machines


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 1
// id: bfa9736e-dae3-4631-a6c1-51ccb30e0e94

CREATE TABLE IF NOT EXISTS frimax.machine_bfa9736e_dae3_4631_a6c1_51ccb30e0e94 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_bfa9736e_dae3_4631_a6c1_51ccb30e0e94(
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
// id: e6fa2e82-0c35-4135-8804-827ac0ecf7b9

CREATE TABLE IF NOT EXISTS frimax.machine_e6fa2e82_0c35_4135_8804_827ac0ecf7b9 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_e6fa2e82_0c35_4135_8804_827ac0ecf7b9(
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
// name : Weigher 3
// id: a0271ed1-d33a-4809-b1f9-0be6f16d72b4

CREATE TABLE IF NOT EXISTS frimax.machine_a0271ed1_d33a_4809_b1f9_0be6f16d72b4 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_a0271ed1_d33a_4809_b1f9_0be6f16d72b4(
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
// id: 1331991b-d40b-4671-a1bd-51cdf8dc16af

CREATE TABLE IF NOT EXISTS frimax.machine_1331991b_d40b_4671_a1bd_51cdf8dc16af (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_1331991b_d40b_4671_a1bd_51cdf8dc16af(
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
// id: 86d1dec8-8b16-48f7-9918-a8fea224ade1

CREATE TABLE IF NOT EXISTS frimax.machine_86d1dec8_8b16_48f7_9918_a8fea224ade1 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_86d1dec8_8b16_48f7_9918_a8fea224ade1(
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
// id: 08c0a706-3104-4eb6-9a01-f2ebaa0fec0a

CREATE TABLE IF NOT EXISTS frimax.machine_08c0a706_3104_4eb6_9a01_f2ebaa0fec0a (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_08c0a706_3104_4eb6_9a01_f2ebaa0fec0a(
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
// id: 18e6b4bd-5f77-4153-a879-f77ca3cc0495

CREATE TABLE IF NOT EXISTS frimax.machine_18e6b4bd_5f77_4153_a879_f77ca3cc0495 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_18e6b4bd_5f77_4153_a879_f77ca3cc0495(
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
// id: c5f9173d-f238-40ad-99ff-d3e557940b44

CREATE TABLE IF NOT EXISTS frimax.machine_c5f9173d_f238_40ad_99ff_d3e557940b44 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_c5f9173d_f238_40ad_99ff_d3e557940b44(
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
// id: a9caa66d-1969-4a8c-a60f-40d5640672ad

CREATE TABLE IF NOT EXISTS frimax.machine_a9caa66d_1969_4a8c_a60f_40d5640672ad (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_a9caa66d_1969_4a8c_a60f_40d5640672ad(
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
// id: 924f40c2-69c3-4da0-8d91-61cab0fb60c5

CREATE TABLE IF NOT EXISTS frimax.machine_924f40c2_69c3_4da0_8d91_61cab0fb60c5 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.machine_924f40c2_69c3_4da0_8d91_61cab0fb60c5(
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
// id: 6401ad54-cd34-4484-a860-674a0a474b26

CREATE TABLE IF NOT EXISTS frimax.line_6401ad54_cd34_4484_a860_674a0a474b26 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.line_6401ad54_cd34_4484_a860_674a0a474b26(
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
// name : EGA% Realtime Dashboard
// id: 429de670-cbec-46b2-a9dc-359508de6cc3

CREATE TABLE IF NOT EXISTS frimax.panel_429de670_cbec_46b2_a9dc_359508de6cc3 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.panel_429de670_cbec_46b2_a9dc_359508de6cc3(
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
// id: 40f010a0-d28a-4aed-8030-2541c83e93f3

CREATE TABLE IF NOT EXISTS frimax.panel_40f010a0_d28a_4aed_8030_2541c83e93f3 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.panel_40f010a0_d28a_4aed_8030_2541c83e93f3(
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
// id: 5ad1fcf5-8a7d-4423-9804-7d511c0742af

CREATE TABLE IF NOT EXISTS frimax.hdash_5ad1fcf5_8a7d_4423_9804_7d511c0742af (
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

CREATE TABLE IF NOT EXISTS replay_frimax.hdash_5ad1fcf5_8a7d_4423_9804_7d511c0742af(
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
// id: fbc0701a-77b2-4625-837b-7e01f10cd425

CREATE TABLE IF NOT EXISTS frimax.hdash_fbc0701a_77b2_4625_837b_7e01f10cd425 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.hdash_fbc0701a_77b2_4625_837b_7e01f10cd425(
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
// id: 3c864b31-00e9-4381-8864-45287620fa4f

CREATE TABLE IF NOT EXISTS frimax.hdash_3c864b31_00e9_4381_8864_45287620fa4f (
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

CREATE TABLE IF NOT EXISTS replay_frimax.hdash_3c864b31_00e9_4381_8864_45287620fa4f(
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
// id: 7929dcdf-361e-4bc8-b9b6-919e78e281ae

CREATE TABLE IF NOT EXISTS frimax.hdash_7929dcdf_361e_4bc8_b9b6_919e78e281ae (
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

CREATE TABLE IF NOT EXISTS replay_frimax.hdash_7929dcdf_361e_4bc8_b9b6_919e78e281ae(
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
// id: 4ef64661-0d41-427b-8f7f-51c0124916d7

CREATE TABLE IF NOT EXISTS frimax.report_4ef64661_0d41_427b_8f7f_51c0124916d7 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.report_4ef64661_0d41_427b_8f7f_51c0124916d7(
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
// id: fe9d2584-6fd7-4bbc-9cff-01f4e2188a35

CREATE TABLE IF NOT EXISTS frimax.report_fe9d2584_6fd7_4bbc_9cff_01f4e2188a35 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.report_fe9d2584_6fd7_4bbc_9cff_01f4e2188a35(
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
// id: de4167c9-db9c-4b23-976f-870aab6b5f14

CREATE TABLE IF NOT EXISTS frimax.report_de4167c9_db9c_4b23_976f_870aab6b5f14 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.report_de4167c9_db9c_4b23_976f_870aab6b5f14(
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
// id: ca4eadc6-d6b6-4b16-a1d8-19877d844698

CREATE TABLE IF NOT EXISTS frimax.report_ca4eadc6_d6b6_4b16_a1d8_19877d844698 (
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

CREATE TABLE IF NOT EXISTS replay_frimax.report_ca4eadc6_d6b6_4b16_a1d8_19877d844698(
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
// id: 5c24286a-fc71-4131-a047-6e30c09e7761

CREATE TABLE IF NOT EXISTS frimax.emd_5c24286a_fc71_4131_a047_6e30c09e7761(
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

CREATE TABLE IF NOT EXISTS frimax.work_order_status(
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


