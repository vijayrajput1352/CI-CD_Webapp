for setupCassandra in ./cql/undo_*_keyspace.cql
do
	echo "Undo $setupCassandra"
	cqlsh -f $setupCassandra --connect-timeout=500 --request-timeout=500;
done
