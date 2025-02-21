for setupCassandra in ./cql/setup_*_keyspace.cql
do
	echo "Setup $setupCassandra"
	cqlsh -f $setupCassandra --connect-timeout=500 --request-timeout=500;
done

