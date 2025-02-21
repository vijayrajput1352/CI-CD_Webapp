# =============================================================================================================================================
# Machines


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Weigher 3
# id: 846b64de-a58d-4ac9-a70a-3ef1b1baef67

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_846b64de_a58d_4ac9_a70a_3ef1b1baef67_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_846b64de_a58d_4ac9_a70a_3ef1b1baef67" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_846b64de_a58d_4ac9_a70a_3ef1b1baef67_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_846b64de_a58d_4ac9_a70a_3ef1b1baef67" : {
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
# name : Weigher 5
# id: 1da5eae6-6e78-4534-88e7-b0e92206d670

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_1da5eae6_6e78_4534_88e7_b0e92206d670_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_1da5eae6_6e78_4534_88e7_b0e92206d670" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_1da5eae6_6e78_4534_88e7_b0e92206d670_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_1da5eae6_6e78_4534_88e7_b0e92206d670" : {
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
# name : Weigher 1
# id: b8c2d6f5-d657-4ddf-96e3-95d05b1fced1

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_b8c2d6f5_d657_4ddf_96e3_95d05b1fced1_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_b8c2d6f5_d657_4ddf_96e3_95d05b1fced1" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_b8c2d6f5_d657_4ddf_96e3_95d05b1fced1_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_b8c2d6f5_d657_4ddf_96e3_95d05b1fced1" : {
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
# name : Weigher 2
# id: c5eb4d6a-dcb3-4b0d-a402-34e49044b71f

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_c5eb4d6a_dcb3_4b0d_a402_34e49044b71f_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_c5eb4d6a_dcb3_4b0d_a402_34e49044b71f" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_c5eb4d6a_dcb3_4b0d_a402_34e49044b71f_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_c5eb4d6a_dcb3_4b0d_a402_34e49044b71f" : {
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
# name : Weigher 4
# id: fcc9a77f-c106-4d91-b2be-d0d3d33ab861

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_fcc9a77f_c106_4d91_b2be_d0d3d33ab861_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_fcc9a77f_c106_4d91_b2be_d0d3d33ab861" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_fcc9a77f_c106_4d91_b2be_d0d3d33ab861_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_fcc9a77f_c106_4d91_b2be_d0d3d33ab861" : {
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
# name : Weigher 6
# id: d659c9ec-d2e3-4bea-8a77-8f77303f55ab

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_d659c9ec_d2e3_4bea_8a77_8f77303f55ab_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_d659c9ec_d2e3_4bea_8a77_8f77303f55ab" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_d659c9ec_d2e3_4bea_8a77_8f77303f55ab_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_d659c9ec_d2e3_4bea_8a77_8f77303f55ab" : {
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
# name : Weigher 7
# id: 10640266-ae8a-4f04-b1cf-11003a1319c3

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_10640266_ae8a_4f04_b1cf_11003a1319c3_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_10640266_ae8a_4f04_b1cf_11003a1319c3" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_10640266_ae8a_4f04_b1cf_11003a1319c3_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_10640266_ae8a_4f04_b1cf_11003a1319c3" : {
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
# name : Weigher 8
# id: 6239c6ce-6a8c-4d7c-bbf5-3bc2132b8a90

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_6239c6ce_6a8c_4d7c_bbf5_3bc2132b8a90_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_6239c6ce_6a8c_4d7c_bbf5_3bc2132b8a90" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_6239c6ce_6a8c_4d7c_bbf5_3bc2132b8a90_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_6239c6ce_6a8c_4d7c_bbf5_3bc2132b8a90" : {
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
# name : Weigher 9
# id: 482aa31a-2fab-4da2-95d1-98d23262227e

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_482aa31a_2fab_4da2_95d1_98d23262227e_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_482aa31a_2fab_4da2_95d1_98d23262227e" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_482aa31a_2fab_4da2_95d1_98d23262227e_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_482aa31a_2fab_4da2_95d1_98d23262227e" : {
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
# name : Weigher 10
# id: b9734a83-8ee7-4573-872f-7400227abf35

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_machine_b9734a83_8ee7_4573_872f_7400227abf35_index' -d '{
	"settings": {
        "keyspace": "wms"
    },
	"mappings":{
		"machine_b9734a83_8ee7_4573_872f_7400227abf35" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_machine_b9734a83_8ee7_4573_872f_7400227abf35_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"machine_b9734a83_8ee7_4573_872f_7400227abf35" : {
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
# name : Weigher Line
# id: 99c51e7e-e73a-44ed-9dda-047661e05c2d

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_line_99c51e7e_e73a_44ed_9dda_047661e05c2d_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"line_99c51e7e_e73a_44ed_9dda_047661e05c2d" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_line_99c51e7e_e73a_44ed_9dda_047661e05c2d_index' -d '{
	"settings": {
		"keyspace": "replay_wms"
	},
	"mappings":{
		"line_99c51e7e_e73a_44ed_9dda_047661e05c2d" : {
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


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : EGA% Real Time Dashboard
# id: 4f6d6113-fc45-49b7-ad29-11e27e8bffc8

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_panel_4f6d6113_fc45_49b7_ad29_11e27e8bffc8_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"panel_4f6d6113_fc45_49b7_ad29_11e27e8bffc8" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_panel_4f6d6113_fc45_49b7_ad29_11e27e8bffc8_index' -d '{
   "settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"panel_4f6d6113_fc45_49b7_ad29_11e27e8bffc8" : {
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
# name : Shopfloor Dashboard
# id: 07eb9972-099d-402f-a4ff-7fdcdf6d9a46

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_panel_07eb9972_099d_402f_a4ff_7fdcdf6d9a46_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"panel_07eb9972_099d_402f_a4ff_7fdcdf6d9a46" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_panel_07eb9972_099d_402f_a4ff_7fdcdf6d9a46_index' -d '{
   "settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"panel_07eb9972_099d_402f_a4ff_7fdcdf6d9a46" : {
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
# Historical Dashboards 


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Flavour Comparison EGA Dashboard
# id: d09581e5-e5c8-4f28-9e6b-6e0cf4690653

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_hdash_d09581e5_e5c8_4f28_9e6b_6e0cf4690653_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"hdash_d09581e5_e5c8_4f28_9e6b_6e0cf4690653" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_hdash_d09581e5_e5c8_4f28_9e6b_6e0cf4690653_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"hdash_d09581e5_e5c8_4f28_9e6b_6e0cf4690653" : {
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
# name : Machine Comparison Dashboard
# id: 198543ca-94af-45ee-bd78-288e0c7c03e8

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_hdash_198543ca_94af_45ee_bd78_288e0c7c03e8_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"hdash_198543ca_94af_45ee_bd78_288e0c7c03e8" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_hdash_198543ca_94af_45ee_bd78_288e0c7c03e8_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"hdash_198543ca_94af_45ee_bd78_288e0c7c03e8" : {
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
# name : Production Dashboard
# id: 111b42bf-6b8c-45d2-91fb-aac619d90e66

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_hdash_111b42bf_6b8c_45d2_91fb_aac619d90e66_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"hdash_111b42bf_6b8c_45d2_91fb_aac619d90e66" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_hdash_111b42bf_6b8c_45d2_91fb_aac619d90e66_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"hdash_111b42bf_6b8c_45d2_91fb_aac619d90e66" : {
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
# name : EGA Dashboard
# id: cb5e35c8-9c9e-4444-aad4-aec6a97f1183

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_hdash_cb5e35c8_9c9e_4444_aad4_aec6a97f1183_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"hdash_cb5e35c8_9c9e_4444_aad4_aec6a97f1183" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_hdash_cb5e35c8_9c9e_4444_aad4_aec6a97f1183_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"hdash_cb5e35c8_9c9e_4444_aad4_aec6a97f1183" : {
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
# Reports 


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Hourly Shift Report
# id: f267498f-0698-49c2-852c-847879a3ee90

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_report_f267498f_0698_49c2_852c_847879a3ee90_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"report_f267498f_0698_49c2_852c_847879a3ee90" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_report_f267498f_0698_49c2_852c_847879a3ee90_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"report_f267498f_0698_49c2_852c_847879a3ee90" : {
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
# name : Daily Report
# id: 205072f6-8df1-4f54-9f8b-b7697bdd4d76

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_report_205072f6_8df1_4f54_9f8b_b7697bdd4d76_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"report_205072f6_8df1_4f54_9f8b_b7697bdd4d76" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_report_205072f6_8df1_4f54_9f8b_b7697bdd4d76_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"report_205072f6_8df1_4f54_9f8b_b7697bdd4d76" : {
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
# name : Monthly Report
# id: 22efbcb0-6cbf-4a9c-a574-b5e0ec69e9ed

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_report_22efbcb0_6cbf_4a9c_a574_b5e0ec69e9ed_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"report_22efbcb0_6cbf_4a9c_a574_b5e0ec69e9ed" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_report_22efbcb0_6cbf_4a9c_a574_b5e0ec69e9ed_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"report_22efbcb0_6cbf_4a9c_a574_b5e0ec69e9ed" : {
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
# name : Process Parameter Report
# id: b31ee3c2-5b4c-4277-bfc5-8d7632fa0a34

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_report_b31ee3c2_5b4c_4277_bfc5_8d7632fa0a34_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"report_b31ee3c2_5b4c_4277_bfc5_8d7632fa0a34" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_wms_report_b31ee3c2_5b4c_4277_bfc5_8d7632fa0a34_index' -d '{
	"settings": {
        "keyspace": "replay_wms"
    },
	"mappings":{
		"report_b31ee3c2_5b4c_4277_bfc5_8d7632fa0a34" : {
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
# Emd 


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Preset Uploader
# id: 3da617ac-5644-4ce5-972a-b6be06bb144b

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_emd_3da617ac_5644_4ce5_972a_b6be06bb144b_index' -d '{
	"settings": {
		"keyspace": "wms"
	},
	"mappings":{
		"emd_3da617ac_5644_4ce5_972a_b6be06bb144b" : {
			"properties": {
				"masterdata_id": {
					"type": "keyword",
					"cql_primary_key_order": 0,
					"cql_partition_key": true,
					"cql_collection": "singleton"
				},

				"inserted_at": {
					"type": "date",
					"cql_primary_key_order": 1,
					"cql_collection": "singleton"
				},

				"internal_tag": {
					"type": "keyword",
					"cql_primary_key_order": 2,
					"cql_collection": "singleton"
				},

				"active": {
					"type": "boolean",
					"cql_collection": "singleton"
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



# =============================================================================================================================================
# Operator Forms 


# =============================================================================================================================================
# work Orders 

# Status Table

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/wms_work_order_status_index' -d '{
	"settings": {
		"keyspace": "wms"
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


