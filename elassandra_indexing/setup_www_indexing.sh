# =============================================================================================================================================
# Machines


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Machine A
# id: 3b1385b1-07fb-4ac9-8c23-d07fbb1736fe

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/www_machine_3b1385b1_07fb_4ac9_8c23_d07fbb1736fe_index' -d '{
	"settings": {
        "keyspace": "www"
    },
	"mappings":{
		"machine_3b1385b1_07fb_4ac9_8c23_d07fbb1736fe" : {
			"properties":{
				"internal_tag": {
					"type": "keyword",
					"cql_primary_key_order": 0,
					"cql_partition_key": true,
					"cql_collection": "singleton"
				},

				"generated_at": {
					"type": "date",
					"cql_primary_key_order": 1,
					"cql_collection": "singleton"
				},

				"collected_at": {
					"type": "date",
					"cql_collection": "singleton",
					"index": false
				},

				"recorded_at": {
					"type": "date",
					"cql_collection": "singleton",
					"index": false
				},

				"data_type": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				},

				"metadata": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				},

				"value": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				}
			}
		}
	}
}'

printf "\n\n"

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_www_machine_3b1385b1_07fb_4ac9_8c23_d07fbb1736fe_index' -d '{
	"settings": {
        "keyspace": "replay_www"
    },
	"mappings":{
		"machine_3b1385b1_07fb_4ac9_8c23_d07fbb1736fe" : {
			"properties": {
				"generated_at": {
					"type": "date",
					"cql_primary_key_order": 0,
					"cql_partition_key": true,
					"cql_collection": "singleton"
				},

				"raw_input_data": {
					"type": "text",
					"cql_collection": "singleton",
					"index": false
				},

				"input_data": {
					"type": "text",
					"cql_collection": "singleton",
					"index": false
				}
			}
		}
	}
}'

printf "\n\n"



# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Machine B
# id: 11cccee1-307b-4f77-9e9f-6881ceb18637

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/www_machine_11cccee1_307b_4f77_9e9f_6881ceb18637_index' -d '{
	"settings": {
        "keyspace": "www"
    },
	"mappings":{
		"machine_11cccee1_307b_4f77_9e9f_6881ceb18637" : {
			"properties":{
				"internal_tag": {
					"type": "keyword",
					"cql_primary_key_order": 0,
					"cql_partition_key": true,
					"cql_collection": "singleton"
				},

				"generated_at": {
					"type": "date",
					"cql_primary_key_order": 1,
					"cql_collection": "singleton"
				},

				"collected_at": {
					"type": "date",
					"cql_collection": "singleton",
					"index": false
				},

				"recorded_at": {
					"type": "date",
					"cql_collection": "singleton",
					"index": false
				},

				"data_type": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				},

				"metadata": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				},

				"value": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				}
			}
		}
	}
}'

printf "\n\n"

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_www_machine_11cccee1_307b_4f77_9e9f_6881ceb18637_index' -d '{
	"settings": {
        "keyspace": "replay_www"
    },
	"mappings":{
		"machine_11cccee1_307b_4f77_9e9f_6881ceb18637" : {
			"properties": {
				"generated_at": {
					"type": "date",
					"cql_primary_key_order": 0,
					"cql_partition_key": true,
					"cql_collection": "singleton"
				},

				"raw_input_data": {
					"type": "text",
					"cql_collection": "singleton",
					"index": false
				},

				"input_data": {
					"type": "text",
					"cql_collection": "singleton",
					"index": false
				}
			}
		}
	}
}'

printf "\n\n"




# =============================================================================================================================================
# Lines


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Line A
# id: 5667de92-0a57-48e0-8ea4-b7761b1665c5

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/www_line_5667de92_0a57_48e0_8ea4_b7761b1665c5_index' -d '{
	"settings": {
		"keyspace": "www"
	},
	"mappings":{
		"line_5667de92_0a57_48e0_8ea4_b7761b1665c5" : {
			"properties":{
				"internal_tag": {
					"type": "keyword",
					"cql_primary_key_order": 0,
					"cql_partition_key": true,
					"cql_collection": "singleton"
				},

				"generated_at": {
					"type": "date",
					"cql_primary_key_order": 1,
					"cql_collection": "singleton"
				},

				"collected_at": {
					"type": "date",
					"cql_collection": "singleton",
					"index": false
				},

				"recorded_at": {
					"type": "date",
					"cql_collection": "singleton",
					"index": false
				},

				"data_type": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				},

				"metadata": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				},

				"value": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				}
			}
		}
	}
}'

printf "\n\n"

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_www_line_5667de92_0a57_48e0_8ea4_b7761b1665c5_index' -d '{
	"settings": {
		"keyspace": "replay_www"
	},
	"mappings":{
		"line_5667de92_0a57_48e0_8ea4_b7761b1665c5" : {
			"properties": {
				"generated_at": {
					"type": "date",
					"cql_primary_key_order": 0,
					"cql_partition_key": true,
					"cql_collection": "singleton"
				},

				"raw_input_data": {
					"type": "text",
					"cql_collection": "singleton",
					"index": false
				},

				"input_data": {
					"type": "text",
					"cql_collection": "singleton",
					"index": false
				}
			}
		}
	}
}'

printf "\n\n"


# =============================================================================================================================================
# Panels 


# =============================================================================================================================================
# Historical Dashboards 


# =============================================================================================================================================
# Reports 


# =============================================================================================================================================
# Emd 


# =============================================================================================================================================
# Operator Forms 


# =============================================================================================================================================
# work Orders 

# Status Table

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/www_work_order_status_index' -d '{
	"settings": {
		"keyspace": "www"
	},
	"mappings":{
		"work_order_status" : {
			"properties": {
				"work_order_id": {
					"type": "keyword",
					"cql_partition_key": true,
					"cql_primary_key_order": 0,
					"cql_collection": "singleton"
				},

				"created_at": {
					"type": "date",
					"cql_primary_key_order": 1,
					"cql_collection": "singleton"
				},

				"work_order_format_id": {
					"type": "keyword",
					"cql_collection": "singleton"
				},

				"tenant_plant_unit_line_id": {
					"type": "keyword",
					"cql_collection": "singleton"
				},

				"tenant_plant_unit_station_id": {
					"type": "keyword",
					"cql_collection": "singleton"
				},

				"start_status": {
					"type": "keyword",
					"cql_collection": "singleton"
				},

				"end_status": {
					"type": "keyword",
					"cql_collection": "singleton"
				},

				"updated_at": {
					"type": "date",
					"cql_collection": "singleton"
				},

				"metadata": {
					"type": "keyword",
					"cql_collection": "singleton",
					"index": false
				}
			}
		}
	}
}'

printf "\n\n"

# Format Tables


