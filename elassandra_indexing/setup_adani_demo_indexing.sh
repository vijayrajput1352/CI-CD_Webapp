# =============================================================================================================================================
# Machines



# =============================================================================================================================================
# Lines


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

curl -XPUT -H 'Content-Type: application/json' 'http://127.0.0.1:9200/adani_demo_work_order_status_index' -d '{
	"settings": {
		"keyspace": "adani_demo"
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


