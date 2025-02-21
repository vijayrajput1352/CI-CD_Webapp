// Default Keypsace
CREATE KEYSPACE IF NOT EXISTS plantworks WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// Tenant Keyspaces

CREATE KEYSPACE IF NOT EXISTS tcpl WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;
CREATE KEYSPACE IF NOT EXISTS replay_tcpl WITH replication = {'class':'NetworkTopologyStrategy','DC1':'1'} AND durable_writes = true;

// =============================================================================================================================================
// Machines


// ----------------------------------------------------------------------------------------------------------------------------------------------
// name : Rotomac Machine
// id: 2f3c6345-f3a6-4049-8739-4adcb934e52e

CREATE TABLE IF NOT EXISTS tcpl.machine_2f3c6345_f3a6_4049_8739_4adcb934e52e (
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

CREATE TABLE IF NOT EXISTS replay_tcpl.machine_2f3c6345_f3a6_4049_8739_4adcb934e52e(
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

CREATE TABLE IF NOT EXISTS tcpl.work_order_status(
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


