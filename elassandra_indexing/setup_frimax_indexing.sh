# =============================================================================================================================================
# Machines


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Weigher 1
# id: bfa9736e-dae3-4631-a6c1-51ccb30e0e94

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_bfa9736e_dae3_4631_a6c1_51ccb30e0e94_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_bfa9736e_dae3_4631_a6c1_51ccb30e0e94" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_bfa9736e_dae3_4631_a6c1_51ccb30e0e94_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_bfa9736e_dae3_4631_a6c1_51ccb30e0e94" : {
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
# id: e6fa2e82-0c35-4135-8804-827ac0ecf7b9

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_e6fa2e82_0c35_4135_8804_827ac0ecf7b9_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_e6fa2e82_0c35_4135_8804_827ac0ecf7b9" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_e6fa2e82_0c35_4135_8804_827ac0ecf7b9_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_e6fa2e82_0c35_4135_8804_827ac0ecf7b9" : {
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
# id: a0271ed1-d33a-4809-b1f9-0be6f16d72b4

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_a0271ed1_d33a_4809_b1f9_0be6f16d72b4_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_a0271ed1_d33a_4809_b1f9_0be6f16d72b4" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_a0271ed1_d33a_4809_b1f9_0be6f16d72b4_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_a0271ed1_d33a_4809_b1f9_0be6f16d72b4" : {
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
# id: 1331991b-d40b-4671-a1bd-51cdf8dc16af

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_1331991b_d40b_4671_a1bd_51cdf8dc16af_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_1331991b_d40b_4671_a1bd_51cdf8dc16af" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_1331991b_d40b_4671_a1bd_51cdf8dc16af_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_1331991b_d40b_4671_a1bd_51cdf8dc16af" : {
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
# id: 86d1dec8-8b16-48f7-9918-a8fea224ade1

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_86d1dec8_8b16_48f7_9918_a8fea224ade1_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_86d1dec8_8b16_48f7_9918_a8fea224ade1" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_86d1dec8_8b16_48f7_9918_a8fea224ade1_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_86d1dec8_8b16_48f7_9918_a8fea224ade1" : {
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
# id: 08c0a706-3104-4eb6-9a01-f2ebaa0fec0a

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_08c0a706_3104_4eb6_9a01_f2ebaa0fec0a_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_08c0a706_3104_4eb6_9a01_f2ebaa0fec0a" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_08c0a706_3104_4eb6_9a01_f2ebaa0fec0a_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_08c0a706_3104_4eb6_9a01_f2ebaa0fec0a" : {
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
# id: 18e6b4bd-5f77-4153-a879-f77ca3cc0495

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_18e6b4bd_5f77_4153_a879_f77ca3cc0495_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_18e6b4bd_5f77_4153_a879_f77ca3cc0495" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_18e6b4bd_5f77_4153_a879_f77ca3cc0495_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_18e6b4bd_5f77_4153_a879_f77ca3cc0495" : {
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
# id: c5f9173d-f238-40ad-99ff-d3e557940b44

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_c5f9173d_f238_40ad_99ff_d3e557940b44_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_c5f9173d_f238_40ad_99ff_d3e557940b44" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_c5f9173d_f238_40ad_99ff_d3e557940b44_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_c5f9173d_f238_40ad_99ff_d3e557940b44" : {
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
# id: a9caa66d-1969-4a8c-a60f-40d5640672ad

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_a9caa66d_1969_4a8c_a60f_40d5640672ad_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_a9caa66d_1969_4a8c_a60f_40d5640672ad" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_a9caa66d_1969_4a8c_a60f_40d5640672ad_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_a9caa66d_1969_4a8c_a60f_40d5640672ad" : {
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
# id: 924f40c2-69c3-4da0-8d91-61cab0fb60c5

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_machine_924f40c2_69c3_4da0_8d91_61cab0fb60c5_index' -d '{
	"settings": {
        "keyspace": "frimax"
    },
	"mappings":{
		"machine_924f40c2_69c3_4da0_8d91_61cab0fb60c5" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_machine_924f40c2_69c3_4da0_8d91_61cab0fb60c5_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"machine_924f40c2_69c3_4da0_8d91_61cab0fb60c5" : {
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
# id: 6401ad54-cd34-4484-a860-674a0a474b26

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_line_6401ad54_cd34_4484_a860_674a0a474b26_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"line_6401ad54_cd34_4484_a860_674a0a474b26" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_line_6401ad54_cd34_4484_a860_674a0a474b26_index' -d '{
	"settings": {
		"keyspace": "replay_frimax"
	},
	"mappings":{
		"line_6401ad54_cd34_4484_a860_674a0a474b26" : {
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
# name : EGA% Realtime Dashboard
# id: 429de670-cbec-46b2-a9dc-359508de6cc3

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_panel_429de670_cbec_46b2_a9dc_359508de6cc3_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"panel_429de670_cbec_46b2_a9dc_359508de6cc3" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_panel_429de670_cbec_46b2_a9dc_359508de6cc3_index' -d '{
   "settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"panel_429de670_cbec_46b2_a9dc_359508de6cc3" : {
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
# id: 40f010a0-d28a-4aed-8030-2541c83e93f3

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_panel_40f010a0_d28a_4aed_8030_2541c83e93f3_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"panel_40f010a0_d28a_4aed_8030_2541c83e93f3" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_panel_40f010a0_d28a_4aed_8030_2541c83e93f3_index' -d '{
   "settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"panel_40f010a0_d28a_4aed_8030_2541c83e93f3" : {
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
# id: 5ad1fcf5-8a7d-4423-9804-7d511c0742af

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_hdash_5ad1fcf5_8a7d_4423_9804_7d511c0742af_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"hdash_5ad1fcf5_8a7d_4423_9804_7d511c0742af" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_hdash_5ad1fcf5_8a7d_4423_9804_7d511c0742af_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"hdash_5ad1fcf5_8a7d_4423_9804_7d511c0742af" : {
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
# id: fbc0701a-77b2-4625-837b-7e01f10cd425

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_hdash_fbc0701a_77b2_4625_837b_7e01f10cd425_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"hdash_fbc0701a_77b2_4625_837b_7e01f10cd425" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_hdash_fbc0701a_77b2_4625_837b_7e01f10cd425_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"hdash_fbc0701a_77b2_4625_837b_7e01f10cd425" : {
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
# id: 3c864b31-00e9-4381-8864-45287620fa4f

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_hdash_3c864b31_00e9_4381_8864_45287620fa4f_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"hdash_3c864b31_00e9_4381_8864_45287620fa4f" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_hdash_3c864b31_00e9_4381_8864_45287620fa4f_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"hdash_3c864b31_00e9_4381_8864_45287620fa4f" : {
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
# id: 7929dcdf-361e-4bc8-b9b6-919e78e281ae

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_hdash_7929dcdf_361e_4bc8_b9b6_919e78e281ae_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"hdash_7929dcdf_361e_4bc8_b9b6_919e78e281ae" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_hdash_7929dcdf_361e_4bc8_b9b6_919e78e281ae_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"hdash_7929dcdf_361e_4bc8_b9b6_919e78e281ae" : {
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
# id: 4ef64661-0d41-427b-8f7f-51c0124916d7

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_report_4ef64661_0d41_427b_8f7f_51c0124916d7_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"report_4ef64661_0d41_427b_8f7f_51c0124916d7" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_report_4ef64661_0d41_427b_8f7f_51c0124916d7_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"report_4ef64661_0d41_427b_8f7f_51c0124916d7" : {
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
# id: fe9d2584-6fd7-4bbc-9cff-01f4e2188a35

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_report_fe9d2584_6fd7_4bbc_9cff_01f4e2188a35_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"report_fe9d2584_6fd7_4bbc_9cff_01f4e2188a35" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_report_fe9d2584_6fd7_4bbc_9cff_01f4e2188a35_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"report_fe9d2584_6fd7_4bbc_9cff_01f4e2188a35" : {
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
# id: de4167c9-db9c-4b23-976f-870aab6b5f14

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_report_de4167c9_db9c_4b23_976f_870aab6b5f14_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"report_de4167c9_db9c_4b23_976f_870aab6b5f14" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_report_de4167c9_db9c_4b23_976f_870aab6b5f14_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"report_de4167c9_db9c_4b23_976f_870aab6b5f14" : {
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
# id: ca4eadc6-d6b6-4b16-a1d8-19877d844698

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_report_ca4eadc6_d6b6_4b16_a1d8_19877d844698_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"report_ca4eadc6_d6b6_4b16_a1d8_19877d844698" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_frimax_report_ca4eadc6_d6b6_4b16_a1d8_19877d844698_index' -d '{
	"settings": {
        "keyspace": "replay_frimax"
    },
	"mappings":{
		"report_ca4eadc6_d6b6_4b16_a1d8_19877d844698" : {
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
# id: 5c24286a-fc71-4131-a047-6e30c09e7761

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_emd_5c24286a_fc71_4131_a047_6e30c09e7761_index' -d '{
	"settings": {
		"keyspace": "frimax"
	},
	"mappings":{
		"emd_5c24286a_fc71_4131_a047_6e30c09e7761" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/frimax_work_order_status_index' -d '{
	"settings": {
		"keyspace": "frimax"
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


