curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/pw_line_b92ac567_1c78_48fc_b600_4d12231ff872_index' -d '{
   "settings": {
        "keyspace": "pw"
    },
   "mappings":{
         "line_b92ac567_1c78_48fc_b600_4d12231ff872" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/replay_pw_line_b92ac567_1c78_48fc_b600_4d12231ff872_index' -d '{
   "settings": {
        "keyspace": "replay_pw"
    },
   "mappings":{
         "line_b92ac567_1c78_48fc_b600_4d12231ff872" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/pw_line_88a0e7fa_9f45_49b7_8ad0_ac5b73aeaaac_index' -d '{
   "settings": {
        "keyspace": "pw"
    },
   "mappings":{
         "line_88a0e7fa_9f45_49b7_8ad0_ac5b73aeaaac" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/replay_pw_line_88a0e7fa_9f45_49b7_8ad0_ac5b73aeaaac_index' -d '{
   "settings": {
        "keyspace": "replay_pw"
    },
   "mappings":{
         "line_88a0e7fa_9f45_49b7_8ad0_ac5b73aeaaac" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/pw_machine_450949a0_43b4_484a_8982_f5a6586568c0_index' -d '{
   "settings": {
        "keyspace": "pw"
    },
   "mappings":{
         "machine_450949a0_43b4_484a_8982_f5a6586568c0" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/replay_pw_machine_450949a0_43b4_484a_8982_f5a6586568c0_index' -d '{
   "settings": {
        "keyspace": "replay_pw"
    },
   "mappings":{
         "machine_450949a0_43b4_484a_8982_f5a6586568c0" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/pw_machine_2aaceeea_d7aa_48bd_9809_0abe9668541f_index' -d '{
   "settings": {
        "keyspace": "pw"
    },
   "mappings":{
         "machine_2aaceeea_d7aa_48bd_9809_0abe9668541f" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/replay_pw_machine_2aaceeea_d7aa_48bd_9809_0abe9668541f_index' -d '{
   "settings": {
        "keyspace": "replay_pw"
    },
   "mappings":{
         "machine_2aaceeea_d7aa_48bd_9809_0abe9668541f" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/pw_machine_ab110b6d_ea61_41eb_bc9c_17e7aa7781c0_index' -d '{
   "settings": {
        "keyspace": "pw"
    },
   "mappings":{
         "machine_ab110b6d_ea61_41eb_bc9c_17e7aa7781c0" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/replay_pw_machine_ab110b6d_ea61_41eb_bc9c_17e7aa7781c0_index' -d '{
   "settings": {
        "keyspace": "replay_pw"
    },
   "mappings":{
         "machine_ab110b6d_ea61_41eb_bc9c_17e7aa7781c0" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/pw_station_2d3c9491_de89_4f7a_89a2_aafbc964fe78_index' -d '{
   "settings": {
        "keyspace": "pw"
    },
   "mappings":{
         "station_2d3c9491_de89_4f7a_89a2_aafbc964fe78" : {
           "discover":".*"
       }
   }
}'

curl -XPUT -H 'Content-Type: application/json' 'http://localhost:9200/replay_pw_station_2d3c9491_de89_4f7a_89a2_aafbc964fe78_index' -d '{
   "settings": {
        "keyspace": "replay_pw"
    },
   "mappings":{
         "station_2d3c9491_de89_4f7a_89a2_aafbc964fe78" : {
           "discover":".*"
       }
   }
}'
