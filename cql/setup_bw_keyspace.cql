// Default Keypsace
CREATE KEYSPACE IF NOT EXISTS plantworks WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// Tenant Keyspaces

CREATE KEYSPACE IF NOT EXISTS bw WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;
CREATE KEYSPACE IF NOT EXISTS replay_bw WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// =============================================================================================================================================
// Machines


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Wafer Packing A,B
// id: dc974e4e-226f-4394-9a47-a2e975de5502

CREATE TABLE IF NOT EXISTS bw.machine_dc974e4e_226f_4394_9a47_a2e975de5502 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_dc974e4e_226f_4394_9a47_a2e975de5502(
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
// name : Wafer Packing C,D
// id: 7dc80a5a-fbed-48f6-ad30-2ecce2dbd05d

CREATE TABLE IF NOT EXISTS bw.machine_7dc80a5a_fbed_48f6_ad30_2ecce2dbd05d (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_7dc80a5a_fbed_48f6_ad30_2ecce2dbd05d(
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
// name : Wafer Packing E,F
// id: ec720303-5d4f-4e3d-b69f-4aee726cf357

CREATE TABLE IF NOT EXISTS bw.machine_ec720303_5d4f_4e3d_b69f_4aee726cf357 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_ec720303_5d4f_4e3d_b69f_4aee726cf357(
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
// name : Wafer Packing G,H
// id: d35fef5c-273f-46da-8ce0-56f46680256c

CREATE TABLE IF NOT EXISTS bw.machine_d35fef5c_273f_46da_8ce0_56f46680256c (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_d35fef5c_273f_46da_8ce0_56f46680256c(
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
// name : Wafer Packing I,J
// id: 8938d5ca-e4dc-42eb-8c0c-2a0647e31043

CREATE TABLE IF NOT EXISTS bw.machine_8938d5ca_e4dc_42eb_8c0c_2a0647e31043 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_8938d5ca_e4dc_42eb_8c0c_2a0647e31043(
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
// name : CP Line A,B
// id: e07c2ba4-d4d7-4ad6-9662-6dbc437ed9ad

CREATE TABLE IF NOT EXISTS bw.machine_e07c2ba4_d4d7_4ad6_9662_6dbc437ed9ad (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_e07c2ba4_d4d7_4ad6_9662_6dbc437ed9ad(
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
// name : CP Line C,D
// id: f1ea8f23-58e2-4bde-bcd5-585adfaa306c

CREATE TABLE IF NOT EXISTS bw.machine_f1ea8f23_58e2_4bde_bcd5_585adfaa306c (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_f1ea8f23_58e2_4bde_bcd5_585adfaa306c(
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
// name : CP Line E,F
// id: a24b67a7-7c11-4380-9bad-789ca045da64

CREATE TABLE IF NOT EXISTS bw.machine_a24b67a7_7c11_4380_9bad_789ca045da64 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_a24b67a7_7c11_4380_9bad_789ca045da64(
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
// name : CP Line G,H
// id: 5c6fba60-bff8-48b9-841b-8f4105a82151

CREATE TABLE IF NOT EXISTS bw.machine_5c6fba60_bff8_48b9_841b_8f4105a82151 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_5c6fba60_bff8_48b9_841b_8f4105a82151(
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
// name : CP Line I,J
// id: 4c8917af-1dfa-45d8-8fb3-ad612f8e0d7f

CREATE TABLE IF NOT EXISTS bw.machine_4c8917af_1dfa_45d8_8fb3_ad612f8e0d7f (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_4c8917af_1dfa_45d8_8fb3_ad612f8e0d7f(
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
// name : Aloo Sev &amp; Bhujia K,L
// id: 00f364d6-96b9-4517-9b8c-0aaf11c6ff80

CREATE TABLE IF NOT EXISTS bw.machine_00f364d6_96b9_4517_9b8c_0aaf11c6ff80 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_00f364d6_96b9_4517_9b8c_0aaf11c6ff80(
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
// name : Aloo Sev &amp; Bhujia M,N
// id: 8283b1fc-5c13-4acd-872e-4adcd804e073

CREATE TABLE IF NOT EXISTS bw.machine_8283b1fc_5c13_4acd_872e_4adcd804e073 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_8283b1fc_5c13_4acd_872e_4adcd804e073(
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
// name : Aloo Sev &amp; Bhujia O,P
// id: f2b8f145-8825-4569-9c8a-d06b8734cd6c

CREATE TABLE IF NOT EXISTS bw.machine_f2b8f145_8825_4569_9c8a_d06b8734cd6c (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_f2b8f145_8825_4569_9c8a_d06b8734cd6c(
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
// name : Aloo Sev &amp; Bhujia Q,R
// id: 0c608c1a-0854-4074-98b2-4b0f651b4797

CREATE TABLE IF NOT EXISTS bw.machine_0c608c1a_0854_4074_98b2_4b0f651b4797 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_0c608c1a_0854_4074_98b2_4b0f651b4797(
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
// name : Aloo Sev &amp; Bhujia S,T
// id: 042f2d73-6d11-4b6d-9cb3-55cedcf26dde

CREATE TABLE IF NOT EXISTS bw.machine_042f2d73_6d11_4b6d_9cb3_55cedcf26dde (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_042f2d73_6d11_4b6d_9cb3_55cedcf26dde(
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
// name : Corn Ring A,B
// id: 0394c66d-7f66-4f9a-809e-49b8c5419b44

CREATE TABLE IF NOT EXISTS bw.machine_0394c66d_7f66_4f9a_809e_49b8c5419b44 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_0394c66d_7f66_4f9a_809e_49b8c5419b44(
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
// name : Corn Ring C,D
// id: 16483203-e74f-4c9b-99e0-4ecbac43a58b

CREATE TABLE IF NOT EXISTS bw.machine_16483203_e74f_4c9b_99e0_4ecbac43a58b (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_16483203_e74f_4c9b_99e0_4ecbac43a58b(
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
// name : Corn Ring E,F
// id: b3326a76-cf93-4ec9-aef0-a89875df2acb

CREATE TABLE IF NOT EXISTS bw.machine_b3326a76_cf93_4ec9_aef0_a89875df2acb (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_b3326a76_cf93_4ec9_aef0_a89875df2acb(
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
// name : Corn Ring G,H
// id: 0a3ab408-bb7e-4604-9d93-e589b6f59c4f

CREATE TABLE IF NOT EXISTS bw.machine_0a3ab408_bb7e_4604_9d93_e589b6f59c4f (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_0a3ab408_bb7e_4604_9d93_e589b6f59c4f(
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
// name : Corn Ring I,J
// id: c2747eb9-c942-4eab-b013-cab49efa8b01

CREATE TABLE IF NOT EXISTS bw.machine_c2747eb9_c942_4eab_b013_cab49efa8b01 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_c2747eb9_c942_4eab_b013_cab49efa8b01(
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
// name : Wafer Packing A,B
// id: 06a93532-bb3e-4303-84ee-916c82e9795e

CREATE TABLE IF NOT EXISTS bw.machine_06a93532_bb3e_4303_84ee_916c82e9795e (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_06a93532_bb3e_4303_84ee_916c82e9795e(
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
// name : Wafer Packing C,D
// id: cbcc17d6-edd0-42ce-811e-ed421f56d6b4

CREATE TABLE IF NOT EXISTS bw.machine_cbcc17d6_edd0_42ce_811e_ed421f56d6b4 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_cbcc17d6_edd0_42ce_811e_ed421f56d6b4(
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
// name : Wafer Packing E,F
// id: a4159a4f-7fd4-43ac-a001-2a3e19dc0591

CREATE TABLE IF NOT EXISTS bw.machine_a4159a4f_7fd4_43ac_a001_2a3e19dc0591 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_a4159a4f_7fd4_43ac_a001_2a3e19dc0591(
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
// name : Wafer Packing G,H
// id: b2c6097b-b00e-443b-824a-cdb7e88fc667

CREATE TABLE IF NOT EXISTS bw.machine_b2c6097b_b00e_443b_824a_cdb7e88fc667 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_b2c6097b_b00e_443b_824a_cdb7e88fc667(
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
// name : Wafer Packing I,J
// id: 81b7fb32-a425-4d33-a6db-13ca55de815a

CREATE TABLE IF NOT EXISTS bw.machine_81b7fb32_a425_4d33_a6db_13ca55de815a (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_81b7fb32_a425_4d33_a6db_13ca55de815a(
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
// name : Wafer Packing K,L
// id: e8c0f75c-a3d6-4c5a-af63-63ceee2ebd2b

CREATE TABLE IF NOT EXISTS bw.machine_e8c0f75c_a3d6_4c5a_af63_63ceee2ebd2b (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_e8c0f75c_a3d6_4c5a_af63_63ceee2ebd2b(
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
// name : Wafer Packing M,N
// id: e8b0144b-ae37-41ca-901a-d142e097bae1

CREATE TABLE IF NOT EXISTS bw.machine_e8b0144b_ae37_41ca_901a_d142e097bae1 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_e8b0144b_ae37_41ca_901a_d142e097bae1(
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
// name : Aloo Sev M,N
// id: aa3f782e-e468-4bee-9325-562404e51bc6

CREATE TABLE IF NOT EXISTS bw.machine_aa3f782e_e468_4bee_9325_562404e51bc6 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_aa3f782e_e468_4bee_9325_562404e51bc6(
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
// name : Aloo Sev O,P
// id: 61b52959-e037-4955-afb4-02a5234d1b31

CREATE TABLE IF NOT EXISTS bw.machine_61b52959_e037_4955_afb4_02a5234d1b31 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_61b52959_e037_4955_afb4_02a5234d1b31(
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
// name : Aloo Sev Q,R
// id: 3b2a25ed-37c1-48ed-9d01-ad5cdee79d56

CREATE TABLE IF NOT EXISTS bw.machine_3b2a25ed_37c1_48ed_9d01_ad5cdee79d56 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_3b2a25ed_37c1_48ed_9d01_ad5cdee79d56(
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
// name : Aloo Sev S,T
// id: 14205b21-ab88-4ec5-a095-c169eea8fd41

CREATE TABLE IF NOT EXISTS bw.machine_14205b21_ab88_4ec5_a095_c169eea8fd41 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_14205b21_ab88_4ec5_a095_c169eea8fd41(
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
// name : Aloo Sev U,V
// id: a255e80e-a148-4778-8a44-b41f452a34c9

CREATE TABLE IF NOT EXISTS bw.machine_a255e80e_a148_4778_8a44_b41f452a34c9 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_a255e80e_a148_4778_8a44_b41f452a34c9(
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
// name : CP Line A,B
// id: 14665882-fc67-4342-bea6-cdafe8476ed3

CREATE TABLE IF NOT EXISTS bw.machine_14665882_fc67_4342_bea6_cdafe8476ed3 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_14665882_fc67_4342_bea6_cdafe8476ed3(
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
// name : CP Line C,D
// id: 834769c2-d712-48ef-a4b4-aede4a2ee741

CREATE TABLE IF NOT EXISTS bw.machine_834769c2_d712_48ef_a4b4_aede4a2ee741 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_834769c2_d712_48ef_a4b4_aede4a2ee741(
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
// name : CP Line E,F
// id: a6f2f636-73e0-4506-8f2d-db176c16deaf

CREATE TABLE IF NOT EXISTS bw.machine_a6f2f636_73e0_4506_8f2d_db176c16deaf (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_a6f2f636_73e0_4506_8f2d_db176c16deaf(
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
// name : CP Line G,H
// id: 29456e88-2a52-4fbc-9846-50618dc4b56a

CREATE TABLE IF NOT EXISTS bw.machine_29456e88_2a52_4fbc_9846_50618dc4b56a (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_29456e88_2a52_4fbc_9846_50618dc4b56a(
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
// name : CP Line I,J
// id: 1f763b53-066d-4d5e-a47e-52d8ed51db3c

CREATE TABLE IF NOT EXISTS bw.machine_1f763b53_066d_4d5e_a47e_52d8ed51db3c (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_1f763b53_066d_4d5e_a47e_52d8ed51db3c(
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
// name : CP Line K,L
// id: 3d3287f3-f5c7-4e04-a51f-176135a5f5fc

CREATE TABLE IF NOT EXISTS bw.machine_3d3287f3_f5c7_4e04_a51f_176135a5f5fc (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_3d3287f3_f5c7_4e04_a51f_176135a5f5fc(
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
// name : Shing Bhujia A,B
// id: 98b9229d-96e4-45ba-a585-bf7dd977764a

CREATE TABLE IF NOT EXISTS bw.machine_98b9229d_96e4_45ba_a585_bf7dd977764a (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_98b9229d_96e4_45ba_a585_bf7dd977764a(
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
// name : Shing Bhujia C,D
// id: 403fdb51-71c6-4614-9760-8830e02e3021

CREATE TABLE IF NOT EXISTS bw.machine_403fdb51_71c6_4614_9760_8830e02e3021 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_403fdb51_71c6_4614_9760_8830e02e3021(
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
// name : Shing Bhujia E,F
// id: 37ade8ff-e781-4a4b-b2cd-c6a93b5b7b62

CREATE TABLE IF NOT EXISTS bw.machine_37ade8ff_e781_4a4b_b2cd_c6a93b5b7b62 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_37ade8ff_e781_4a4b_b2cd_c6a93b5b7b62(
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
// name : Shing Bhujia G,H
// id: db6e6a8e-0b14-49fb-b669-2d27ec32df95

CREATE TABLE IF NOT EXISTS bw.machine_db6e6a8e_0b14_49fb_b669_2d27ec32df95 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_db6e6a8e_0b14_49fb_b669_2d27ec32df95(
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
// name : Shing Bhujia I,J
// id: 6ab734c7-fab2-44b8-b135-c03a8aadb0bb

CREATE TABLE IF NOT EXISTS bw.machine_6ab734c7_fab2_44b8_b135_c03a8aadb0bb (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_6ab734c7_fab2_44b8_b135_c03a8aadb0bb(
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
// name : Shing Bhujia K,L
// id: 735173f1-baeb-4827-a985-a106e8b270e5

CREATE TABLE IF NOT EXISTS bw.machine_735173f1_baeb_4827_a985_a106e8b270e5 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_735173f1_baeb_4827_a985_a106e8b270e5(
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
// name : Shing Bhujia M,N
// id: fdce616c-cb64-4bd6-8cc5-3ae6a6e06d67

CREATE TABLE IF NOT EXISTS bw.machine_fdce616c_cb64_4bd6_8cc5_3ae6a6e06d67 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_fdce616c_cb64_4bd6_8cc5_3ae6a6e06d67(
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
// name : Wafers Line Loop 1 A,B
// id: a4146038-bdbc-4144-b6ef-32f243aeaf9a

CREATE TABLE IF NOT EXISTS bw.machine_a4146038_bdbc_4144_b6ef_32f243aeaf9a (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_a4146038_bdbc_4144_b6ef_32f243aeaf9a(
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
// name : Wafers Line Loop 1 C,D
// id: 3ef87462-d24d-4c3a-8530-82196f5f53f6

CREATE TABLE IF NOT EXISTS bw.machine_3ef87462_d24d_4c3a_8530_82196f5f53f6 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_3ef87462_d24d_4c3a_8530_82196f5f53f6(
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
// name : Wafers Line Loop 1 E,F
// id: 391d6c26-d15c-4cae-a5d2-c2cd1ef2456f

CREATE TABLE IF NOT EXISTS bw.machine_391d6c26_d15c_4cae_a5d2_c2cd1ef2456f (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_391d6c26_d15c_4cae_a5d2_c2cd1ef2456f(
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
// name : Wafers Line Loop 1 G,H
// id: bcb61b05-eec1-4a30-8363-2e7952ce0c6d

CREATE TABLE IF NOT EXISTS bw.machine_bcb61b05_eec1_4a30_8363_2e7952ce0c6d (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_bcb61b05_eec1_4a30_8363_2e7952ce0c6d(
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
// name : Wafers Line Loop 1 I,J
// id: 36e79217-7f5a-4db3-9695-6738f7b3e0c9

CREATE TABLE IF NOT EXISTS bw.machine_36e79217_7f5a_4db3_9695_6738f7b3e0c9 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_36e79217_7f5a_4db3_9695_6738f7b3e0c9(
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
// name : Wafers Line Loop 2  K,L
// id: 0c2eadfe-6562-4b9f-8363-059afcd43e84

CREATE TABLE IF NOT EXISTS bw.machine_0c2eadfe_6562_4b9f_8363_059afcd43e84 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_0c2eadfe_6562_4b9f_8363_059afcd43e84(
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
// name : Wafers Line Loop 2  M,N
// id: d662af36-2f4e-4ae8-ba72-0369a32a5435

CREATE TABLE IF NOT EXISTS bw.machine_d662af36_2f4e_4ae8_ba72_0369a32a5435 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_d662af36_2f4e_4ae8_ba72_0369a32a5435(
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
// name : Wafers Line Loop 2  O,P
// id: 91dddfa1-2643-4469-a6ba-b6108f673c00

CREATE TABLE IF NOT EXISTS bw.machine_91dddfa1_2643_4469_a6ba_b6108f673c00 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_91dddfa1_2643_4469_a6ba_b6108f673c00(
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
// name : Wafers Line Loop 2  Q,R
// id: 78ab26f2-bb98-4913-b42f-6245b6c3e419

CREATE TABLE IF NOT EXISTS bw.machine_78ab26f2_bb98_4913_b42f_6245b6c3e419 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_78ab26f2_bb98_4913_b42f_6245b6c3e419(
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
// name : Wafers Line Loop 2  S,T
// id: 57950cf5-8a05-44d3-b364-8c5a10d1d3f2

CREATE TABLE IF NOT EXISTS bw.machine_57950cf5_8a05_44d3_b364_8c5a10d1d3f2 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_57950cf5_8a05_44d3_b364_8c5a10d1d3f2(
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
// name : Wafer Packing A,B
// id: 69f2d057-1d1c-481e-b3c8-77a3b1069c96

CREATE TABLE IF NOT EXISTS bw.machine_69f2d057_1d1c_481e_b3c8_77a3b1069c96 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_69f2d057_1d1c_481e_b3c8_77a3b1069c96(
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
// name : Wafer Packing C,D
// id: e518bbd1-188e-4864-a450-b6cde684ab30

CREATE TABLE IF NOT EXISTS bw.machine_e518bbd1_188e_4864_a450_b6cde684ab30 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_e518bbd1_188e_4864_a450_b6cde684ab30(
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
// name : Wafer Packing E,F
// id: 0b441288-27b6-48fb-b041-22d2cf74e37a

CREATE TABLE IF NOT EXISTS bw.machine_0b441288_27b6_48fb_b041_22d2cf74e37a (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_0b441288_27b6_48fb_b041_22d2cf74e37a(
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
// name : Wafer Packing G,H
// id: a50c8900-5fb8-468b-aa21-821364582893

CREATE TABLE IF NOT EXISTS bw.machine_a50c8900_5fb8_468b_aa21_821364582893 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_a50c8900_5fb8_468b_aa21_821364582893(
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
// name : Wafer Packing I,J
// id: 4b10441a-1956-4310-8591-d3b4d9c64a24

CREATE TABLE IF NOT EXISTS bw.machine_4b10441a_1956_4310_8591_d3b4d9c64a24 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_4b10441a_1956_4310_8591_d3b4d9c64a24(
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
// name : Wafer Packing K,L
// id: 4adf196a-7a80-4564-9432-9a68a01e61a4

CREATE TABLE IF NOT EXISTS bw.machine_4adf196a_7a80_4564_9432_9a68a01e61a4 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_4adf196a_7a80_4564_9432_9a68a01e61a4(
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
// name : Wafer Packing M,N
// id: 7516a360-1125-4ce8-bdc3-b257c4cdcc52

CREATE TABLE IF NOT EXISTS bw.machine_7516a360_1125_4ce8_bdc3_b257c4cdcc52 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_7516a360_1125_4ce8_bdc3_b257c4cdcc52(
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
// name : Wafer Packing O,P
// id: f9ead792-1f77-424f-9116-cbf5ed518958

CREATE TABLE IF NOT EXISTS bw.machine_f9ead792_1f77_424f_9116_cbf5ed518958 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_f9ead792_1f77_424f_9116_cbf5ed518958(
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
// name : Wafer Packing Q,R
// id: afabf464-5c45-4f10-a99a-2287b62e34b7

CREATE TABLE IF NOT EXISTS bw.machine_afabf464_5c45_4f10_a99a_2287b62e34b7 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_afabf464_5c45_4f10_a99a_2287b62e34b7(
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
// name : Aloo Sev Process Line
// id: 480336ed-a76a-49c2-a145-c42a0aeb8615

CREATE TABLE IF NOT EXISTS bw.machine_480336ed_a76a_49c2_a145_c42a0aeb8615 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_480336ed_a76a_49c2_a145_c42a0aeb8615(
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
// name : Aloo sev batch line
// id: 02b4da03-9d1a-4cc1-a834-83b385c95950

CREATE TABLE IF NOT EXISTS bw.machine_02b4da03_9d1a_4cc1_a834_83b385c95950 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_02b4da03_9d1a_4cc1_a834_83b385c95950(
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
// name : Wafer &amp; Chevdo process line
// id: ebab7c8e-3bbe-4806-b5d2-80e69ee16062

CREATE TABLE IF NOT EXISTS bw.machine_ebab7c8e_3bbe_4806_b5d2_80e69ee16062 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_ebab7c8e_3bbe_4806_b5d2_80e69ee16062(
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
// name : Corn Ring and Nachos Packing A,B
// id: de5abda7-e0e4-48fb-8a8a-d88177cdcaa4

CREATE TABLE IF NOT EXISTS bw.machine_de5abda7_e0e4_48fb_8a8a_d88177cdcaa4 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_de5abda7_e0e4_48fb_8a8a_d88177cdcaa4(
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
// name : Corn Ring and Nachos Packing C,D
// id: f4a9857c-686a-4c2d-a50f-9c5dfab27f88

CREATE TABLE IF NOT EXISTS bw.machine_f4a9857c_686a_4c2d_a50f_9c5dfab27f88 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_f4a9857c_686a_4c2d_a50f_9c5dfab27f88(
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
// name : Corn Ring and Nachos Packing E,F
// id: f18c6b70-b13c-4969-bebd-13d1aea46b93

CREATE TABLE IF NOT EXISTS bw.machine_f18c6b70_b13c_4969_bebd_13d1aea46b93 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_f18c6b70_b13c_4969_bebd_13d1aea46b93(
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
// name : Corn Ring and Nachos Packing G,H
// id: c82b7f92-57be-4011-bce1-e0a95ec049ac

CREATE TABLE IF NOT EXISTS bw.machine_c82b7f92_57be_4011_bce1_e0a95ec049ac (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_c82b7f92_57be_4011_bce1_e0a95ec049ac(
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
// name : Corn Ring and Nachos Packing I,J
// id: d7a988d3-404f-48d8-abfa-a113242b6005

CREATE TABLE IF NOT EXISTS bw.machine_d7a988d3_404f_48d8_abfa_a113242b6005 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_d7a988d3_404f_48d8_abfa_a113242b6005(
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
// name : CP Process Line
// id: 4aa2a52c-664f-45b0-843e-df808bef2f3d

CREATE TABLE IF NOT EXISTS bw.machine_4aa2a52c_664f_45b0_843e_df808bef2f3d (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_4aa2a52c_664f_45b0_843e_df808bef2f3d(
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
// name : Wafer &amp; Chevdo process line
// id: ce8d7d3b-7ea9-4ef1-a7a1-db89cd7b773b

CREATE TABLE IF NOT EXISTS bw.machine_ce8d7d3b_7ea9_4ef1_a7a1_db89cd7b773b (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_ce8d7d3b_7ea9_4ef1_a7a1_db89cd7b773b(
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
// name : Corn ring process line
// id: f73c462b-6480-407d-b128-76dbb7ffb8cb

CREATE TABLE IF NOT EXISTS bw.machine_f73c462b_6480_407d_b128_76dbb7ffb8cb (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_f73c462b_6480_407d_b128_76dbb7ffb8cb(
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
// name : Aloo Sev Process Line
// id: 57a726b6-5fa3-43ea-9a4c-4b2c21737a7f

CREATE TABLE IF NOT EXISTS bw.machine_57a726b6_5fa3_43ea_9a4c_4b2c21737a7f (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_57a726b6_5fa3_43ea_9a4c_4b2c21737a7f(
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
// name : Aloo sev batch line
// id: 50177be7-021f-461a-a19d-40ad474de592

CREATE TABLE IF NOT EXISTS bw.machine_50177be7_021f_461a_a19d_40ad474de592 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_50177be7_021f_461a_a19d_40ad474de592(
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
// name : CP batch line
// id: d269120b-ece2-4e43-9f44-cb1b84e7a1a1

CREATE TABLE IF NOT EXISTS bw.machine_d269120b_ece2_4e43_9f44_cb1b84e7a1a1 (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_d269120b_ece2_4e43_9f44_cb1b84e7a1a1(
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
// name : Aloo Sev Process Line 2
// id: 342c675b-6b26-4878-89cf-f9f0cc6649da

CREATE TABLE IF NOT EXISTS bw.machine_342c675b_6b26_4878_89cf_f9f0cc6649da (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_342c675b_6b26_4878_89cf_f9f0cc6649da(
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
// name : CP Process Line 2
// id: 894ff14e-2d16-4ee3-941e-27106754b5ed

CREATE TABLE IF NOT EXISTS bw.machine_894ff14e_2d16_4ee3_941e_27106754b5ed (
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

CREATE TABLE IF NOT EXISTS replay_bw.machine_894ff14e_2d16_4ee3_941e_27106754b5ed(
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
// name : Wafer, Chevdo and Aloo Sev Packing Line
// id: a39827d4-b0c9-4e40-ab09-10b8f79733e6

CREATE TABLE IF NOT EXISTS bw.panel_a39827d4_b0c9_4e40_ab09_10b8f79733e6 (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_a39827d4_b0c9_4e40_ab09_10b8f79733e6(
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
// name : Indore Line Status
// id: 5cb04c38-dd58-4bef-b26e-c03e8aa9d91e

CREATE TABLE IF NOT EXISTS bw.panel_5cb04c38_dd58_4bef_b26e_c03e8aa9d91e (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_5cb04c38_dd58_4bef_b26e_c03e8aa9d91e(
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
// name : Process Line
// id: 8aa9817b-1229-440d-b6e4-dc1600296d51

CREATE TABLE IF NOT EXISTS bw.panel_8aa9817b_1229_440d_b6e4_dc1600296d51 (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_8aa9817b_1229_440d_b6e4_dc1600296d51(
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
// name : Aloo and CP Packing Line
// id: fe38348d-76f6-46bb-a215-a4925c095239

CREATE TABLE IF NOT EXISTS bw.panel_fe38348d_76f6_46bb_a215_a4925c095239 (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_fe38348d_76f6_46bb_a215_a4925c095239(
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
// name : Rajkot Wafer Line Status
// id: 900eaea2-7a6f-4f2e-9a74-d9b9777c9f2e

CREATE TABLE IF NOT EXISTS bw.panel_900eaea2_7a6f_4f2e_9a74_d9b9777c9f2e (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_900eaea2_7a6f_4f2e_9a74_d9b9777c9f2e(
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
// name : Corn Ring Packing Line
// id: c86107cd-d579-4f7b-8d80-791d8e3d95ce

CREATE TABLE IF NOT EXISTS bw.panel_c86107cd_d579_4f7b_8d80_791d8e3d95ce (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_c86107cd_d579_4f7b_8d80_791d8e3d95ce(
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
// name : Rajkot Process Line
// id: 45daad6b-25fa-4570-b0cb-dd826d2876cc

CREATE TABLE IF NOT EXISTS bw.panel_45daad6b_25fa_4570_b0cb_dd826d2876cc (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_45daad6b_25fa_4570_b0cb_dd826d2876cc(
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
// name : Wafer &amp; Chevdo Packing Line
// id: fedfb890-286a-4460-ae30-d389e947979f

CREATE TABLE IF NOT EXISTS bw.panel_fedfb890_286a_4460_ae30_d389e947979f (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_fedfb890_286a_4460_ae30_d389e947979f(
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
// name : Corn Ring and Nachos Packing Line
// id: 61bb876d-3306-4c85-b17e-fd517e1269f8

CREATE TABLE IF NOT EXISTS bw.panel_61bb876d_3306_4c85_b17e_fd517e1269f8 (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_61bb876d_3306_4c85_b17e_fd517e1269f8(
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
// name : Vadodara Status Line
// id: 10e86c74-10f4-4cee-b0e7-acba214d98ac

CREATE TABLE IF NOT EXISTS bw.panel_10e86c74_10f4_4cee_b0e7_acba214d98ac (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_10e86c74_10f4_4cee_b0e7_acba214d98ac(
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
// name : Aloo Packing Line
// id: 3f40a702-c3be-4d76-a48f-3c92e5ec5c54

CREATE TABLE IF NOT EXISTS bw.panel_3f40a702_c3be_4d76_a48f_3c92e5ec5c54 (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_3f40a702_c3be_4d76_a48f_3c92e5ec5c54(
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
// name : CP Packing Line
// id: 005a6f9e-8f4d-42f8-bd76-d87b19189be7

CREATE TABLE IF NOT EXISTS bw.panel_005a6f9e_8f4d_42f8_bd76_d87b19189be7 (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_005a6f9e_8f4d_42f8_bd76_d87b19189be7(
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
// name : Shing Bhujia &amp; Wheelos Packing Line
// id: 5724afec-617d-4374-81ec-3ea9dc132f70

CREATE TABLE IF NOT EXISTS bw.panel_5724afec_617d_4374_81ec_3ea9dc132f70 (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_5724afec_617d_4374_81ec_3ea9dc132f70(
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
// name : Wafer and Chevdo Packing Line
// id: 76263280-407e-4027-8889-463dc2844171

CREATE TABLE IF NOT EXISTS bw.panel_76263280_407e_4027_8889_463dc2844171 (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_76263280_407e_4027_8889_463dc2844171(
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
// name : Wafers Line Loop 1 Packing Line
// id: 5f7bc671-c80e-4a02-b06b-78a9c1057331

CREATE TABLE IF NOT EXISTS bw.panel_5f7bc671_c80e_4a02_b06b_78a9c1057331 (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_5f7bc671_c80e_4a02_b06b_78a9c1057331(
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
// name : Wafers Line Loop 2 Packing Line
// id: 021e3991-7aab-4aa9-8d51-7da032ee80db

CREATE TABLE IF NOT EXISTS bw.panel_021e3991_7aab_4aa9_8d51_7da032ee80db (
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

CREATE TABLE IF NOT EXISTS replay_bw.panel_021e3991_7aab_4aa9_8d51_7da032ee80db(
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


// =============================================================================================================================================
// Reports


// =============================================================================================================================================
// Emd


// =============================================================================================================================================
// Operator Forms


// =============================================================================================================================================
// work Orders

// Status Table

CREATE TABLE IF NOT EXISTS bw.work_order_status(
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


