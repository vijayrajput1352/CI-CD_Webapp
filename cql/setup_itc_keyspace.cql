// Default Keypsace
CREATE KEYSPACE IF NOT EXISTS plantworks WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// Tenant Keyspaces

CREATE KEYSPACE IF NOT EXISTS itc WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;
CREATE KEYSPACE IF NOT EXISTS replay_itc WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// =============================================================================================================================================
// Machines


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Weigher 1
// id: 104bb149-9c0c-478d-b2c5-08afa507d0e8

CREATE TABLE IF NOT EXISTS itc.machine_104bb149_9c0c_478d_b2c5_08afa507d0e8 (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_104bb149_9c0c_478d_b2c5_08afa507d0e8(
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
// id: cf3902ba-88d1-465e-94d7-90988df4c579

CREATE TABLE IF NOT EXISTS itc.machine_cf3902ba_88d1_465e_94d7_90988df4c579 (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_cf3902ba_88d1_465e_94d7_90988df4c579(
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
// id: aaf4089b-7890-442f-8888-dadd8f62c6c0

CREATE TABLE IF NOT EXISTS itc.machine_aaf4089b_7890_442f_8888_dadd8f62c6c0 (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_aaf4089b_7890_442f_8888_dadd8f62c6c0(
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
// id: 5e190601-e84a-4951-9286-c888ef193bee

CREATE TABLE IF NOT EXISTS itc.machine_5e190601_e84a_4951_9286_c888ef193bee (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_5e190601_e84a_4951_9286_c888ef193bee(
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
// id: 00624120-de21-423f-8af2-c886f04be2a9

CREATE TABLE IF NOT EXISTS itc.machine_00624120_de21_423f_8af2_c886f04be2a9 (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_00624120_de21_423f_8af2_c886f04be2a9(
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
// id: cf45d963-c9a6-4f8f-9166-6d014ecff379

CREATE TABLE IF NOT EXISTS itc.machine_cf45d963_c9a6_4f8f_9166_6d014ecff379 (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_cf45d963_c9a6_4f8f_9166_6d014ecff379(
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
// id: 615d5e71-6434-4e6f-9cb3-f5f18ecf7e50

CREATE TABLE IF NOT EXISTS itc.machine_615d5e71_6434_4e6f_9cb3_f5f18ecf7e50 (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_615d5e71_6434_4e6f_9cb3_f5f18ecf7e50(
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
// id: f55a5cd2-be38-4097-bc2c-cd6cb8f05a1c

CREATE TABLE IF NOT EXISTS itc.machine_f55a5cd2_be38_4097_bc2c_cd6cb8f05a1c (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_f55a5cd2_be38_4097_bc2c_cd6cb8f05a1c(
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
// id: 34a45fa5-e74e-4be5-a4c9-cfa09374fe7b

CREATE TABLE IF NOT EXISTS itc.machine_34a45fa5_e74e_4be5_a4c9_cfa09374fe7b (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_34a45fa5_e74e_4be5_a4c9_cfa09374fe7b(
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
// id: e39cc3ba-d5a6-4c07-93dd-f63f3f5af72c

CREATE TABLE IF NOT EXISTS itc.machine_e39cc3ba_d5a6_4c07_93dd_f63f3f5af72c (
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

CREATE TABLE IF NOT EXISTS replay_itc.machine_e39cc3ba_d5a6_4c07_93dd_f63f3f5af72c(
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


// =============================================================================================================================================
// Panels 


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : EGA% Real Time Dashboard
// id: 977bbe04-9505-4195-80be-47fb2921c2dc

CREATE TABLE IF NOT EXISTS itc.panel_977bbe04_9505_4195_80be_47fb2921c2dc (
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

CREATE TABLE IF NOT EXISTS replay_itc.panel_977bbe04_9505_4195_80be_47fb2921c2dc(
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
// name : Weigher Settings Dashboard
// id: f31cc7be-b84d-42ce-ad98-f3679d32c721

CREATE TABLE IF NOT EXISTS itc.panel_f31cc7be_b84d_42ce_ad98_f3679d32c721 (
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

CREATE TABLE IF NOT EXISTS replay_itc.panel_f31cc7be_b84d_42ce_ad98_f3679d32c721(
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
// name : Realtime Tabular Dashboard
// id: fbedfc20-73bc-4071-8b4e-e67d5eb1c70f

CREATE TABLE IF NOT EXISTS itc.panel_fbedfc20_73bc_4071_8b4e_e67d5eb1c70f (
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

CREATE TABLE IF NOT EXISTS replay_itc.panel_fbedfc20_73bc_4071_8b4e_e67d5eb1c70f(
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
// id: 3b224408-8283-407b-86ba-8580424396c6

CREATE TABLE IF NOT EXISTS itc.hdash_3b224408_8283_407b_86ba_8580424396c6 (
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

CREATE TABLE IF NOT EXISTS replay_itc.hdash_3b224408_8283_407b_86ba_8580424396c6(
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
// id: cb3a7cae-84f6-4c7e-9e80-4b77fca600af

CREATE TABLE IF NOT EXISTS itc.hdash_cb3a7cae_84f6_4c7e_9e80_4b77fca600af (
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

CREATE TABLE IF NOT EXISTS replay_itc.hdash_cb3a7cae_84f6_4c7e_9e80_4b77fca600af(
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
// id: 2c101580-6364-45be-a282-d87e8fd706ff

CREATE TABLE IF NOT EXISTS itc.hdash_2c101580_6364_45be_a282_d87e8fd706ff (
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

CREATE TABLE IF NOT EXISTS replay_itc.hdash_2c101580_6364_45be_a282_d87e8fd706ff(
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
// id: 89239b36-32b6-44ee-ad24-b289af6c81f7

CREATE TABLE IF NOT EXISTS itc.report_89239b36_32b6_44ee_ad24_b289af6c81f7 (
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

CREATE TABLE IF NOT EXISTS replay_itc.report_89239b36_32b6_44ee_ad24_b289af6c81f7(
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
// id: 2a15a8d5-e57f-49fd-9810-9c5ad7e9cb5e

CREATE TABLE IF NOT EXISTS itc.report_2a15a8d5_e57f_49fd_9810_9c5ad7e9cb5e (
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

CREATE TABLE IF NOT EXISTS replay_itc.report_2a15a8d5_e57f_49fd_9810_9c5ad7e9cb5e(
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
// id: fd71648b-2ff3-4808-933d-0fcb3ada338c

CREATE TABLE IF NOT EXISTS itc.report_fd71648b_2ff3_4808_933d_0fcb3ada338c (
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

CREATE TABLE IF NOT EXISTS replay_itc.report_fd71648b_2ff3_4808_933d_0fcb3ada338c(
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
// id: afdfcd39-b3f7-47ef-8e03-8e1ac8d52966

CREATE TABLE IF NOT EXISTS itc.report_afdfcd39_b3f7_47ef_8e03_8e1ac8d52966 (
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

CREATE TABLE IF NOT EXISTS replay_itc.report_afdfcd39_b3f7_47ef_8e03_8e1ac8d52966(
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
// id: 957ef4f9-4315-48de-89c2-d81f1460eb35

CREATE TABLE IF NOT EXISTS itc.emd_957ef4f9_4315_48de_89c2_d81f1460eb35(
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

CREATE TABLE IF NOT EXISTS itc.work_order_status(
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


