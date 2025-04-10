# =============================================================================================================================================
# Machines


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Weigher 1
# id: 104bb149-9c0c-478d-b2c5-08afa507d0e8

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_104bb149_9c0c_478d_b2c5_08afa507d0e8_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_104bb149_9c0c_478d_b2c5_08afa507d0e8" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_104bb149_9c0c_478d_b2c5_08afa507d0e8_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_104bb149_9c0c_478d_b2c5_08afa507d0e8" : {
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
# id: cf3902ba-88d1-465e-94d7-90988df4c579

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_cf3902ba_88d1_465e_94d7_90988df4c579_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_cf3902ba_88d1_465e_94d7_90988df4c579" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_cf3902ba_88d1_465e_94d7_90988df4c579_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_cf3902ba_88d1_465e_94d7_90988df4c579" : {
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
# name : Weigher 3
# id: aaf4089b-7890-442f-8888-dadd8f62c6c0

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_aaf4089b_7890_442f_8888_dadd8f62c6c0_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_aaf4089b_7890_442f_8888_dadd8f62c6c0" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_aaf4089b_7890_442f_8888_dadd8f62c6c0_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_aaf4089b_7890_442f_8888_dadd8f62c6c0" : {
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
# id: 5e190601-e84a-4951-9286-c888ef193bee

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_5e190601_e84a_4951_9286_c888ef193bee_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_5e190601_e84a_4951_9286_c888ef193bee" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_5e190601_e84a_4951_9286_c888ef193bee_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_5e190601_e84a_4951_9286_c888ef193bee" : {
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
# id: 00624120-de21-423f-8af2-c886f04be2a9

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_00624120_de21_423f_8af2_c886f04be2a9_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_00624120_de21_423f_8af2_c886f04be2a9" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_00624120_de21_423f_8af2_c886f04be2a9_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_00624120_de21_423f_8af2_c886f04be2a9" : {
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
# id: cf45d963-c9a6-4f8f-9166-6d014ecff379

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_cf45d963_c9a6_4f8f_9166_6d014ecff379_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_cf45d963_c9a6_4f8f_9166_6d014ecff379" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_cf45d963_c9a6_4f8f_9166_6d014ecff379_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_cf45d963_c9a6_4f8f_9166_6d014ecff379" : {
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
# id: 615d5e71-6434-4e6f-9cb3-f5f18ecf7e50

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_615d5e71_6434_4e6f_9cb3_f5f18ecf7e50_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_615d5e71_6434_4e6f_9cb3_f5f18ecf7e50" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_615d5e71_6434_4e6f_9cb3_f5f18ecf7e50_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_615d5e71_6434_4e6f_9cb3_f5f18ecf7e50" : {
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
# id: f55a5cd2-be38-4097-bc2c-cd6cb8f05a1c

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_f55a5cd2_be38_4097_bc2c_cd6cb8f05a1c_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_f55a5cd2_be38_4097_bc2c_cd6cb8f05a1c" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_f55a5cd2_be38_4097_bc2c_cd6cb8f05a1c_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_f55a5cd2_be38_4097_bc2c_cd6cb8f05a1c" : {
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
# id: 34a45fa5-e74e-4be5-a4c9-cfa09374fe7b

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_34a45fa5_e74e_4be5_a4c9_cfa09374fe7b_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_34a45fa5_e74e_4be5_a4c9_cfa09374fe7b" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_34a45fa5_e74e_4be5_a4c9_cfa09374fe7b_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_34a45fa5_e74e_4be5_a4c9_cfa09374fe7b" : {
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
# id: e39cc3ba-d5a6-4c07-93dd-f63f3f5af72c

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_machine_e39cc3ba_d5a6_4c07_93dd_f63f3f5af72c_index' -d '{
	"settings": {
        "keyspace": "itc"
    },
	"mappings":{
		"machine_e39cc3ba_d5a6_4c07_93dd_f63f3f5af72c" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_machine_e39cc3ba_d5a6_4c07_93dd_f63f3f5af72c_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"machine_e39cc3ba_d5a6_4c07_93dd_f63f3f5af72c" : {
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


# =============================================================================================================================================
# Panels 


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : EGA% Real Time Dashboard
# id: 977bbe04-9505-4195-80be-47fb2921c2dc

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_panel_977bbe04_9505_4195_80be_47fb2921c2dc_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"panel_977bbe04_9505_4195_80be_47fb2921c2dc" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_panel_977bbe04_9505_4195_80be_47fb2921c2dc_index' -d '{
   "settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"panel_977bbe04_9505_4195_80be_47fb2921c2dc" : {
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
# name : Weigher Settings Dashboard
# id: f31cc7be-b84d-42ce-ad98-f3679d32c721

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_panel_f31cc7be_b84d_42ce_ad98_f3679d32c721_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"panel_f31cc7be_b84d_42ce_ad98_f3679d32c721" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_panel_f31cc7be_b84d_42ce_ad98_f3679d32c721_index' -d '{
   "settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"panel_f31cc7be_b84d_42ce_ad98_f3679d32c721" : {
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
# name : Realtime Tabular Dashboard
# id: fbedfc20-73bc-4071-8b4e-e67d5eb1c70f

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_panel_fbedfc20_73bc_4071_8b4e_e67d5eb1c70f_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"panel_fbedfc20_73bc_4071_8b4e_e67d5eb1c70f" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_panel_fbedfc20_73bc_4071_8b4e_e67d5eb1c70f_index' -d '{
   "settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"panel_fbedfc20_73bc_4071_8b4e_e67d5eb1c70f" : {
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
# id: 3b224408-8283-407b-86ba-8580424396c6

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_hdash_3b224408_8283_407b_86ba_8580424396c6_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"hdash_3b224408_8283_407b_86ba_8580424396c6" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_hdash_3b224408_8283_407b_86ba_8580424396c6_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"hdash_3b224408_8283_407b_86ba_8580424396c6" : {
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
# id: cb3a7cae-84f6-4c7e-9e80-4b77fca600af

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_hdash_cb3a7cae_84f6_4c7e_9e80_4b77fca600af_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"hdash_cb3a7cae_84f6_4c7e_9e80_4b77fca600af" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_hdash_cb3a7cae_84f6_4c7e_9e80_4b77fca600af_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"hdash_cb3a7cae_84f6_4c7e_9e80_4b77fca600af" : {
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
# id: 2c101580-6364-45be-a282-d87e8fd706ff

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_hdash_2c101580_6364_45be_a282_d87e8fd706ff_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"hdash_2c101580_6364_45be_a282_d87e8fd706ff" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_hdash_2c101580_6364_45be_a282_d87e8fd706ff_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"hdash_2c101580_6364_45be_a282_d87e8fd706ff" : {
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
# id: 89239b36-32b6-44ee-ad24-b289af6c81f7

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_report_89239b36_32b6_44ee_ad24_b289af6c81f7_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"report_89239b36_32b6_44ee_ad24_b289af6c81f7" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_report_89239b36_32b6_44ee_ad24_b289af6c81f7_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"report_89239b36_32b6_44ee_ad24_b289af6c81f7" : {
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
# id: 2a15a8d5-e57f-49fd-9810-9c5ad7e9cb5e

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_report_2a15a8d5_e57f_49fd_9810_9c5ad7e9cb5e_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"report_2a15a8d5_e57f_49fd_9810_9c5ad7e9cb5e" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_report_2a15a8d5_e57f_49fd_9810_9c5ad7e9cb5e_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"report_2a15a8d5_e57f_49fd_9810_9c5ad7e9cb5e" : {
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
# id: fd71648b-2ff3-4808-933d-0fcb3ada338c

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_report_fd71648b_2ff3_4808_933d_0fcb3ada338c_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"report_fd71648b_2ff3_4808_933d_0fcb3ada338c" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_report_fd71648b_2ff3_4808_933d_0fcb3ada338c_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"report_fd71648b_2ff3_4808_933d_0fcb3ada338c" : {
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
# id: afdfcd39-b3f7-47ef-8e03-8e1ac8d52966

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_report_afdfcd39_b3f7_47ef_8e03_8e1ac8d52966_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"report_afdfcd39_b3f7_47ef_8e03_8e1ac8d52966" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_itc_report_afdfcd39_b3f7_47ef_8e03_8e1ac8d52966_index' -d '{
	"settings": {
        "keyspace": "replay_itc"
    },
	"mappings":{
		"report_afdfcd39_b3f7_47ef_8e03_8e1ac8d52966" : {
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
# id: 957ef4f9-4315-48de-89c2-d81f1460eb35

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_emd_957ef4f9_4315_48de_89c2_d81f1460eb35_index' -d '{
	"settings": {
		"keyspace": "itc"
	},
	"mappings":{
		"emd_957ef4f9_4315_48de_89c2_d81f1460eb35" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/itc_work_order_status_index' -d '{
	"settings": {
		"keyspace": "itc"
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


