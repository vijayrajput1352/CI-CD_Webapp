# =============================================================================================================================================
# Machines


# ----------------------------------------------------------------------------------------------------------------------------------------------
# name : Pouch Machine 1
# id: 3b207df8-b908-4311-a9a3-36189b00afc8

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_machine_3b207df8_b908_4311_a9a3_36189b00afc8_index' -d '{
	"settings": {
        "keyspace": "adani"
    },
	"mappings":{
		"machine_3b207df8_b908_4311_a9a3_36189b00afc8" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_machine_3b207df8_b908_4311_a9a3_36189b00afc8_index' -d '{
	"settings": {
        "keyspace": "replay_adani"
    },
	"mappings":{
		"machine_3b207df8_b908_4311_a9a3_36189b00afc8" : {
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
# name : Pouch Machine 2
# id: ee10c6dd-40f5-4045-94dd-2efeade0be97

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_machine_ee10c6dd_40f5_4045_94dd_2efeade0be97_index' -d '{
	"settings": {
        "keyspace": "adani"
    },
	"mappings":{
		"machine_ee10c6dd_40f5_4045_94dd_2efeade0be97" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_machine_ee10c6dd_40f5_4045_94dd_2efeade0be97_index' -d '{
	"settings": {
        "keyspace": "replay_adani"
    },
	"mappings":{
		"machine_ee10c6dd_40f5_4045_94dd_2efeade0be97" : {
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
# name : Pouch Machine 3
# id: 83823628-ad9c-47dc-bbec-ff0948b718d6

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_machine_83823628_ad9c_47dc_bbec_ff0948b718d6_index' -d '{
	"settings": {
        "keyspace": "adani"
    },
	"mappings":{
		"machine_83823628_ad9c_47dc_bbec_ff0948b718d6" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_machine_83823628_ad9c_47dc_bbec_ff0948b718d6_index' -d '{
	"settings": {
        "keyspace": "replay_adani"
    },
	"mappings":{
		"machine_83823628_ad9c_47dc_bbec_ff0948b718d6" : {
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
# name : Pouch Machine 4
# id: 84d123a2-3d46-45af-acfb-6eb16734a1e4

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_machine_84d123a2_3d46_45af_acfb_6eb16734a1e4_index' -d '{
	"settings": {
        "keyspace": "adani"
    },
	"mappings":{
		"machine_84d123a2_3d46_45af_acfb_6eb16734a1e4" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_machine_84d123a2_3d46_45af_acfb_6eb16734a1e4_index' -d '{
	"settings": {
        "keyspace": "replay_adani"
    },
	"mappings":{
		"machine_84d123a2_3d46_45af_acfb_6eb16734a1e4" : {
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
# name : Pouch Machine 5
# id: 2757b309-5b1d-4893-bd43-d4fe0dc8753e

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_machine_2757b309_5b1d_4893_bd43_d4fe0dc8753e_index' -d '{
	"settings": {
        "keyspace": "adani"
    },
	"mappings":{
		"machine_2757b309_5b1d_4893_bd43_d4fe0dc8753e" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_machine_2757b309_5b1d_4893_bd43_d4fe0dc8753e_index' -d '{
	"settings": {
        "keyspace": "replay_adani"
    },
	"mappings":{
		"machine_2757b309_5b1d_4893_bd43_d4fe0dc8753e" : {
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
# name : Line 1
# id: d7665744-9377-477c-a9f7-ed8ae3f0f5fc

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_line_d7665744_9377_477c_a9f7_ed8ae3f0f5fc_index' -d '{
	"settings": {
		"keyspace": "adani"
	},
	"mappings":{
		"line_d7665744_9377_477c_a9f7_ed8ae3f0f5fc" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_line_d7665744_9377_477c_a9f7_ed8ae3f0f5fc_index' -d '{
	"settings": {
		"keyspace": "replay_adani"
	},
	"mappings":{
		"line_d7665744_9377_477c_a9f7_ed8ae3f0f5fc" : {
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
# name : Line 2
# id: fdcc95c0-b97c-46f4-af29-109a6fdc0e47

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_line_fdcc95c0_b97c_46f4_af29_109a6fdc0e47_index' -d '{
	"settings": {
		"keyspace": "adani"
	},
	"mappings":{
		"line_fdcc95c0_b97c_46f4_af29_109a6fdc0e47" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_line_fdcc95c0_b97c_46f4_af29_109a6fdc0e47_index' -d '{
	"settings": {
		"keyspace": "replay_adani"
	},
	"mappings":{
		"line_fdcc95c0_b97c_46f4_af29_109a6fdc0e47" : {
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
# name : Productivity Dashboard
# id: a4e1894a-56f3-4e37-a278-eaea9ffdfa91

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_panel_a4e1894a_56f3_4e37_a278_eaea9ffdfa91_index' -d '{
	"settings": {
		"keyspace": "adani"
	},
	"mappings":{
		"panel_a4e1894a_56f3_4e37_a278_eaea9ffdfa91" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_panel_a4e1894a_56f3_4e37_a278_eaea9ffdfa91_index' -d '{
   "settings": {
        "keyspace": "replay_adani"
    },
	"mappings":{
		"panel_a4e1894a_56f3_4e37_a278_eaea9ffdfa91" : {
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
# name : OEE Dashboard
# id: 0a42c833-944d-4850-9463-dbd623e058f7

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_panel_0a42c833_944d_4850_9463_dbd623e058f7_index' -d '{
	"settings": {
		"keyspace": "adani"
	},
	"mappings":{
		"panel_0a42c833_944d_4850_9463_dbd623e058f7" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_panel_0a42c833_944d_4850_9463_dbd623e058f7_index' -d '{
   "settings": {
        "keyspace": "replay_adani"
    },
	"mappings":{
		"panel_0a42c833_944d_4850_9463_dbd623e058f7" : {
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
# name : Real Time Dashboard
# id: 99f514c1-6cd8-4eeb-b30c-6200402c0842

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_panel_99f514c1_6cd8_4eeb_b30c_6200402c0842_index' -d '{
	"settings": {
		"keyspace": "adani"
	},
	"mappings":{
		"panel_99f514c1_6cd8_4eeb_b30c_6200402c0842" : {
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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/replay_adani_panel_99f514c1_6cd8_4eeb_b30c_6200402c0842_index' -d '{
   "settings": {
        "keyspace": "replay_adani"
    },
	"mappings":{
		"panel_99f514c1_6cd8_4eeb_b30c_6200402c0842" : {
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


# =============================================================================================================================================
# Reports


# =============================================================================================================================================
# Emd


# =============================================================================================================================================
# Operator Forms


# =============================================================================================================================================
# work Orders

# Status Table

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_work_order_status_index' -d '{
	"settings": {
		"keyspace": "adani"
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


